import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CreditCard,
  FileText,
  Globe,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BlueBill — Invoicing that pays you faster" },
      {
        name: "description",
        content:
          "BlueBill helps freelancers and small businesses create beautiful invoices, track payments, and get paid faster — all in one place.",
      },
      { property: "og:title", content: "BlueBill — Invoicing that pays you faster" },
      {
        property: "og:description",
        content:
          "Create beautiful invoices, track payments, and get paid faster with BlueBill.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: FileText,
    title: "Beautiful invoices in seconds",
    description:
      "Pick a template, add your line items, and send. Your clients get a polished, professional invoice every time.",
  },
  {
    icon: CreditCard,
    title: "One-click payments",
    description:
      "Accept cards and bank transfers right on the invoice. No chasing, no awkward reminders.",
  },
  {
    icon: Bell,
    title: "Smart reminders",
    description:
      "BlueBill nudges late payers automatically, so you never have to send that follow-up email again.",
  },
  {
    icon: BarChart3,
    title: "Know your numbers",
    description:
      "See what's paid, pending, and overdue at a glance. Export everything for tax season in one click.",
  },
  {
    icon: Globe,
    title: "Bill anyone, anywhere",
    description:
      "Multi-currency invoicing with automatic tax handling for clients around the world.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "Bank-grade encryption keeps your data and your clients' payment details safe.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create",
    description: "Build a branded invoice in under a minute with smart templates.",
  },
  {
    number: "02",
    title: "Send",
    description: "Deliver it by email or link, with online payment built in.",
  },
  {
    number: "03",
    title: "Get paid",
    description: "Track status in real time and watch the money land.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    tagline: "For getting going",
    features: ["5 invoices per month", "1 user", "Online payments", "Email support"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    tagline: "For growing businesses",
    features: [
      "Unlimited invoices",
      "Automatic reminders",
      "Custom branding",
      "Expense tracking",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    tagline: "For working together",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Roles & permissions",
      "Accounting integrations",
    ],
    highlighted: false,
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              BlueBill
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, var(--hero-glow), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center md:pt-28">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            New: automatic late-payment reminders
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
            Invoicing that pays you{" "}
            <span className="text-primary">faster</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            BlueBill helps freelancers and small businesses create beautiful
            invoices, track payments, and get paid — without the busywork.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90"
            >
              Start free today
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button className="rounded-lg border border-border bg-card px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent">
              See how it works
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free plan available · No credit card required
          </p>

          {/* Invoice mockup */}
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-chart-4/60" />
                  <div className="h-3 w-3 rounded-full bg-chart-2/60" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Invoice #1042
                </span>
              </div>
              <div className="p-6 text-left">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                        <FileText className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                      <span className="font-bold text-foreground">BlueBill</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Billed to: Acme Studio
                    </p>
                  </div>
                  <div className="rounded-full bg-chart-2/15 px-3 py-1 text-xs font-semibold text-chart-2">
                    Paid
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    ["Brand identity design", "$2,400.00"],
                    ["Website development", "$3,800.00"],
                    ["Monthly maintenance", "$450.00"],
                  ].map(([item, amount]) => (
                    <div
                      key={item}
                      className="flex items-center justify-between border-b border-border/60 pb-3 text-sm"
                    >
                      <span className="text-foreground">{item}</span>
                      <span className="font-medium text-foreground">{amount}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">$6,650.00</span>
                </div>
                <button className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90">
                  Pay invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Trusted by 12,000+ freelancers and small businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-lg font-bold tracking-tight text-muted-foreground/60">
            <span>Nortwind</span>
            <span>Acme Studio</span>
            <span>Loopwork</span>
            <span>Fieldstone</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to get paid
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From the first invoice to the final reminder, BlueBill handles the
            busywork so you can focus on the work.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Paid in three steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No setup headaches. No learning curve.
            </p>
          </div>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <span className="text-5xl font-extrabold tracking-tight text-primary/20">
                  {step.number}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you grow.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlighted
                  ? "relative rounded-2xl border-2 border-primary bg-card p-8 shadow-xl"
                  : "rounded-2xl border border-border bg-card p-8"
              }
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={
                  plan.highlighted
                    ? "mt-8 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                    : "mt-8 w-full rounded-lg border border-border bg-background py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                }
              >
                {plan.price === "Free" ? "Start free" : "Start 14-day trial"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center md:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            Stop chasing payments. Start getting paid.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Join thousands of businesses sending their first BlueBill invoice today.
          </p>
          <Link
            to="/auth"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-background px-6 py-3 text-base font-semibold text-foreground shadow-lg transition-all hover:opacity-90"
          >
            Create your first invoice
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <FileText className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">BlueBill</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 BlueBill. Invoicing that pays you faster.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
