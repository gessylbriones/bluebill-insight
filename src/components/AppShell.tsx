import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { FileText, LayoutDashboard, LogOut, Receipt, Users } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/invoices", label: "Invoices", icon: Receipt },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold tracking-tight text-foreground">
                BlueBill
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={
                      active
                        ? "flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
                        : "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</main>
    </div>
  );
}
