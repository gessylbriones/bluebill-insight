import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
} from "@/lib/billing.functions";

export const Route = createFileRoute("/_authenticated/customers")({
  head: () => ({
    meta: [
      { title: "Customers — BlueBill" },
      { name: "description", content: "Manage your BlueBill customers." },
    ],
  }),
  component: Customers,
});

function Customers() {
  const queryClient = useQueryClient();
  const fetchCustomers = useServerFn(listCustomers);
  const addCustomer = useServerFn(createCustomer);
  const removeCustomer = useServerFn(deleteCustomer);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: () => fetchCustomers(),
  });

  const createMutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setShowForm(false);
      setName("");
      setEmail("");
      setCompany("");
      setError(null);
    },
    onError: (err) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: removeCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Customers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The people and businesses you bill
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add customer
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({ data: { name, email, company } });
          }}
          className="mt-6 rounded-2xl border border-border bg-card p-6"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Name *
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                placeholder="Jane Cooper"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                placeholder="jane@acme.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Company
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                placeholder="Acme Inc."
              />
            </div>
          </div>
          {error && (
            <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              {createMutation.isPending ? "Saving…" : "Save customer"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        {!customers?.length ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            No customers yet. Add your first customer to start invoicing.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {customers.map((customer) => (
              <li
                key={customer.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[customer.company, customer.email]
                      .filter(Boolean)
                      .join(" · ") || "No details"}
                  </p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate({ data: { id: customer.id } })}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Delete ${customer.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
