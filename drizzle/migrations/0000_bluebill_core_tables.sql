-- BlueBill core schema: customers, invoices, invoice line items, payments
-- All tables are owner-scoped via user_id with RLS.

CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  email text,
  company text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own customers" ON public.customers
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  notes text,
  tax_rate numeric(5,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, invoice_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own invoices" ON public.invoices
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  position int NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO authenticated;
GRANT ALL ON public.invoice_items TO service_role;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own invoice items" ON public.invoice_items
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid()));

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  paid_at timestamptz NOT NULL DEFAULT now(),
  method text,
  reference text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own payments" ON public.payments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid()));

CREATE INDEX idx_customers_user ON public.customers(user_id);
CREATE INDEX idx_invoices_user ON public.invoices(user_id);
CREATE INDEX idx_invoices_customer ON public.invoices(customer_id);
CREATE INDEX idx_invoice_items_invoice ON public.invoice_items(invoice_id);
CREATE INDEX idx_payments_invoice ON public.payments(invoice_id);