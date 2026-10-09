import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "./dashboard";
import {
  createInvoice,
  deleteInvoice,
  listCustomers,
  listInvoices,
  setInvoiceStatus,
} from "@/lib/billing.functions";

export const Route = createFileRoute("/_authenticated/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices — BlueBill" },
      { name: "description", content: "Create and manage your BlueBill invoices." },
    ],
  }),
  component: Invoices,
});

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

type Item = { description: string; quantity: number; unit_price: number };

function invoiceTotal(inv: {
  tax_rate: number | string;
  invoice_items?: { quantity: number | string; unit_price: number | string }[] | null;
}) {
  const subtotal = (inv.invoice_items ?? []).reduce(
    (s, it) => s + Number(it.quantity) * Number(it.unit_price),
    0,
  );
  return subtotal * (1 + Number(inv.tax_rate) / 100);
}

function Invoices() {
  const queryClient = useQueryClient();
  const fetchInvoices = useServerFn(listInvoices);
  const fetchCustomers = useServerFn(listCustomers);
  const addInvoice = useServerFn(createInvoice);
  const updateStatus = useServerFn(setInvoiceStatus);
  const removeInvoice = useServerFn(deleteInvoice);

  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(
    () => `INV-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  );
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [items, setItems] = useState<Item[]>([
    { description: "", quantity: 1, unit_price: 0 },
  ]);
  const [error, setError] = useState<string | null>(null);

  const { data: invoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => fetchInvoices(),
  });
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: () => fetchCustomers(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["invoices"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  const createMutation = useMutation({
    mutationFn: addInvoice,
    onSuccess: () => {
      invalidate();
      setShowForm(false);
      setItems([{ description: "", quantity: 1, unit_price: 0 }]);
      setInvoiceNumber(`INV-${String(Math.floor(Math.random() * 9000) + 1000)}`);
      setError(null);
    },
    onError: (err) => setError(err.message),
  });

  const statusMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: removeInvoice,
    onSuccess: invalidate,
  });

  const formTotal =
    items.reduce((s, it) => s + it.quantity * it.unit_price, 0) *
    (1 + taxRate / 100);

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, send, and track your invoices
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New invoice
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({
              data: {
                customer_id: customerId,
                invoice_number: invoiceNumber,
                due_date: dueDate,
                tax_rate: taxRate,
                items: items.filter((it) => it.description.trim()),
              },
            });
          }}
          className="mt-6 rounded-2xl border border-border bg-card p-6"
        >
          {!customers?.length ? (
            <p className="text-sm text-muted-foreground">
              You need at least one customer before creating an invoice. Add one
              on the Customers page first.
            </p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Customer *
                  </label>
                  <select
                    required
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select…</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Invoice # *
                  </label>
                  <input
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Due date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Tax rate %
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Line items
                </label>
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        required
                        value={item.description}
                        onChange={(e) => {
                          const next = [...items];
                          next[i] = { ...item, description: e.target.value };
                          setItems(next);
                        }}
                        placeholder="Description"
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                      />
                      <input
                        type="number"
                        min={0.01}
                        step={0.01}
                        value={item.quantity}
                        onChange={(e) => {
                          const next = [...items];
                          next[i] = { ...item, quantity: Number(e.target.value) };
                          setItems(next);
                        }}
                        placeholder="Qty"
                        className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                      />
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.unit_price}
                        onChange={(e) => {
                          const next = [...items];
                          next[i] = { ...item, unit_price: Number(e.target.value) };
                          setItems(next);
                        }}
                        placeholder="Price"
                        className="w-28 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setItems(items.filter((_, idx) => idx !== i))
                        }
                        disabled={items.length === 1}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setItems([...items, { description: "", quantity: 1, unit_price: 0 }])
                  }
                  className="mt-2 text-sm font-medium text-primary hover:underline"
                >
                  + Add line item
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-semibold text-foreground">
                  Total: {money(formTotal)}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Creating…" : "Create invoice"}
                  </button>
                </div>
              </div>
              {error && (
                <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
            </>
          )}
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        {!invoices?.length ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            No invoices yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {invoices.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    #{inv.invoice_number} · {inv.customers?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Issued {new Date(inv.issue_date).toLocaleDateString()}
                    {inv.due_date &&
                      ` · Due ${new Date(inv.due_date).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {money(invoiceTotal(inv))}
                  </span>
                  <StatusBadge status={inv.status} />
                  {inv.status !== "paid" && inv.status !== "cancelled" && (
                    <button
                      onClick={() =>
                        statusMutation.mutate({
                          data: { id: inv.id, status: "paid" },
                        })
                      }
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                    >
                      Mark paid
                    </button>
                  )}
                  <button
                    onClick={() =>
                      deleteMutation.mutate({ data: { id: inv.id } })
                    }
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Delete invoice ${inv.invoice_number}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
