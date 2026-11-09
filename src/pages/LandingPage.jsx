import { Link } from "react-router-dom";
import { FaCheckCircle, FaShieldAlt, FaChartLine, FaWallet, FaBolt } from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle";

const features = [
  { icon: FaShieldAlt, title: "Bank-grade security", description: "Protected sessions and clear account access." },
  { icon: FaChartLine, title: "Live overview", description: "Track balances and movement across every account." },
  { icon: FaWallet, title: "Fast transfers", description: "Move money between accounts in seconds." },
  { icon: FaBolt, title: "Smart workflows", description: "Focused tools for account creation and review." },
];

const stats = [
  { value: "Ledger-backed", label: "balances from transaction entries" },
  { value: "Account-to-account", label: "transfers with clear validation" },
  { value: "Recent activity", label: "review sent and received funds" },
];

export default function LandingPage() {
  return (
    <div className="landing-shell min-h-screen text-ink">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-canvas/80 border-b border-hairline">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-on-primary shadow-sm"><FaWallet className="text-sm" /></span>
            <div>
              <div className="font-geist text-base font-medium tracking-tight">Bank Transaction System</div>
              <div className="font-geist-mono text-[10px] uppercase tracking-[0.24em] text-mute">Private banking</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="btn-ghost-sm hidden sm:inline-flex">Sign in</Link>
            <Link to="/register" className="btn-primary">Open account</Link>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-20">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas-elevated px-3 py-1.5 font-geist-mono text-[10px] uppercase tracking-[0.22em] text-mute shadow-sm">
              <FaCheckCircle className="text-cyan-500" />
              Trusted money workflow
            </div>
            <h1 className="max-w-144 font-geist text-5xl font-medium tracking-[-0.06em] text-ink sm:text-6xl">
              Move money with clarity.
            </h1>
            <p className="mt-6 max-w-144 font-geist text-lg leading-8 text-body">
              A modern banking experience built for accounts, transfers, balances, and confident financial decision-making.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary justify-center">Create account</Link>
              <Link to="/login" className="btn-secondary justify-center">Sign in</Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                  <div key={item.label} className="min-w-0 rounded-2xl border border-hairline bg-canvas-elevated p-4 shadow-sm">
                    <div className="font-geist text-lg font-medium tracking-tight text-ink">{item.value}</div>
                    <div className="mt-1 font-geist text-body-sm text-body">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-hairline bg-canvas-elevated p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="rounded-[22px] bg-[#0b1320] p-5 text-white shadow-inner shadow-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-geist-mono text-[10px] uppercase tracking-[0.22em] text-white/70">Example portfolio</p>
                    <h2 className="mt-2 font-geist text-3xl font-medium tracking-tight">₹18,420.00</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-geist text-body-sm text-white/80">
                    +12.4%
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="font-geist text-body-sm text-white/75">Available cash</div>
                    <div className="mt-2 font-geist text-2xl font-medium">₹9,548</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="font-geist text-body-sm text-white/75">Outgoing</div>
                    <div className="mt-2 font-geist text-2xl font-medium text-amber-300">₹2,940</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {["Main account", "Savings account", "Travel wallet"].map((label, idx) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div>
                        <div className="font-geist text-body-sm text-white/75">{label}</div>
                        <div className="mt-1 font-geist text-lg font-medium">{["₹8,214", "₹6,300", "₹3,906"][idx]}</div>
                      </div>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 text-center">
            <p className="font-geist-mono text-[10px] uppercase tracking-[0.24em] text-mute">Everything your money needs</p>
            <h2 className="mt-3 font-geist text-3xl font-medium tracking-tight text-ink sm:text-4xl">Built for clarity and control.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-hairline bg-canvas-elevated p-6 shadow-sm motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-link-soft text-link">
                  <Icon aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-geist text-xl font-medium text-ink">{title}</h3>
                <p className="mt-3 font-geist text-body-md leading-7 text-body">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-[28px] border border-hairline bg-canvas-elevated p-8 shadow-sm sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.24em] text-mute">Why teams choose BTS</p>
              <h3 className="mt-3 font-geist text-3xl font-medium tracking-tight text-ink">All your essential banking actions in one place.</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-hairline-soft p-5">
                <div className="font-geist text-lg font-medium text-ink">Account onboarding</div>
                <p className="mt-2 font-geist text-body-md text-body">Create multiple accounts, track status, and review balances instantly.</p>
              </div>
              <div className="rounded-2xl bg-hairline-soft p-5">
                <div className="font-geist text-lg font-medium text-ink">Secure transfers</div>
                <p className="mt-2 font-geist text-body-md text-body">Send funds between accounts with clear validation and feedback.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline bg-canvas-elevated/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-center text-body sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="font-geist text-body-sm">© 2026 Bank Transaction System</div>
          <div className="flex items-center justify-center gap-6 font-geist text-body-sm text-mute">
            <span>Security</span>
            <span>Transfers</span>
            <span>Dashboard</span>
          </div>
          <Link to="/login" className="font-geist text-body-sm font-medium text-link">Get started</Link>
        </div>
      </footer>
    </div>
  );
}
