import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, CircleAlert, CircleCheck, Receipt, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getDashboardStats, listInvoices } from "@/lib/billing.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BlueBill" },
      { name: "description", content: "Your BlueBill invoicing overview." },
    ],
  }),
  component: Dashboard,
});

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

function Dashboard() {
  const fetchStats = useServerFn(getDashboardStats);
  const fetchInvoices = useServerFn(listInvoices);

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetchStats(),
  });
  const { data: invoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => fetchInvoices(),
  });

  const cards = [
    {
      label: "Outstanding",
      value: money(stats?.outstanding ?? 0),
      icon: Wallet,
    },
    {
      label: "Collected",
      value: money(stats?.paid ?? 0),
      icon: CircleCheck,
    },
    {
      label: "Total invoices",
      value: String(stats?.totalInvoices ?? 0),
      icon: Receipt,
    },
    {
      label: "Overdue",
      value: String(stats?.overdueCount ?? 0),
      icon: CircleAlert,
    },
  ];

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your billing at a glance
          </p>
        </div>
        <Link
          to="/invoices"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          New invoice
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-foreground">
        Recent invoices
      </h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        {!invoices?.length ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No invoices yet. Create your first one to get started.
            </p>
            <Link
              to="/invoices"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Create invoice
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {invoices.slice(0, 5).map((inv) => {
              const subtotal = (inv.invoice_items ?? []).reduce(
                (s, it) => s + Number(it.quantity) * Number(it.unit_price),
                0,
              );
              const total = subtotal * (1 + Number(inv.tax_rate) / 100);
              return (
                <li
                  key={inv.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      #{inv.invoice_number} · {inv.customers?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(inv.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground">
                      {money(total)}
                    </span>
                    <StatusBadge status={inv.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-chart-2/15 text-chart-2",
    sent: "bg-primary/10 text-primary",
    overdue: "bg-destructive/10 text-destructive",
    draft: "bg-muted text-muted-foreground",
    cancelled: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] ?? styles.draft}`}
    >
      {status}
    </span>
  );
}
