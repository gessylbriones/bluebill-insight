import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Customers ----------

export const listCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const createCustomer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        name: z.string().min(1).max(200),
        email: z.string().email().max(320).optional().or(z.literal("")),
        company: z.string().max(200).optional().or(z.literal("")),
        address: z.string().max(500).optional().or(z.literal("")),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("customers")
      .insert({
        user_id: context.userId,
        name: data.name,
        email: data.email || null,
        company: data.company || null,
        address: data.address || null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteCustomer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("customers")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Invoices ----------

const invoiceItemSchema = z.object({
  description: z.string().min(1).max(500),
  quantity: z.number().positive().max(1_000_000),
  unit_price: z.number().min(0).max(100_000_000),
});

export const listInvoices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("invoices")
      .select("*, customers(name, company), invoice_items(*), payments(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const createInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        customer_id: z.string().uuid(),
        invoice_number: z.string().min(1).max(50),
        due_date: z.string().optional().or(z.literal("")),
        notes: z.string().max(2000).optional().or(z.literal("")),
        tax_rate: z.number().min(0).max(100).default(0),
        items: z.array(invoiceItemSchema).min(1).max(100),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: invoice, error } = await context.supabase
      .from("invoices")
      .insert({
        user_id: context.userId,
        customer_id: data.customer_id,
        invoice_number: data.invoice_number,
        status: "sent",
        due_date: data.due_date || null,
        notes: data.notes || null,
        tax_rate: data.tax_rate,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    const items = data.items.map((item, i) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      position: i,
    }));
    const { error: itemsError } = await context.supabase
      .from("invoice_items")
      .insert(items);
    if (itemsError) throw new Error(itemsError.message);
    return invoice;
  });

export const setInvoiceStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("invoices")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("invoices")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Payments ----------

export const recordPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        invoice_id: z.string().uuid(),
        amount: z.number().positive().max(100_000_000),
        method: z.string().max(100).optional().or(z.literal("")),
        reference: z.string().max(200).optional().or(z.literal("")),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("payments").insert({
      invoice_id: data.invoice_id,
      amount: data.amount,
      method: data.method || null,
      reference: data.reference || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Dashboard stats ----------

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: invoices, error } = await context.supabase
      .from("invoices")
      .select("id, status, tax_rate, invoice_items(quantity, unit_price), payments(amount)");
    if (error) throw new Error(error.message);

    let outstanding = 0;
    let paid = 0;
    let overdueCount = 0;
    for (const inv of invoices ?? []) {
      const subtotal = (inv.invoice_items ?? []).reduce(
        (s, it) => s + Number(it.quantity) * Number(it.unit_price),
        0,
      );
      const total = subtotal * (1 + Number(inv.tax_rate) / 100);
      const paidAmount = (inv.payments ?? []).reduce(
        (s, p) => s + Number(p.amount),
        0,
      );
      paid += inv.status === "paid" ? total : paidAmount;
      if (inv.status !== "paid" && inv.status !== "cancelled") {
        outstanding += Math.max(total - paidAmount, 0);
      }
      if (inv.status === "overdue") overdueCount += 1;
    }
    return {
      totalInvoices: invoices?.length ?? 0,
      outstanding,
      paid,
      overdueCount,
    };
  });
