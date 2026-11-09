import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AccountCard from "../components/AccountCard";
import Navbar from "../components/Navbar";
import api from "../services/api";
import TransferPanel from "../components/TransferPanel";
import TransactionHistory from "../components/TransactionHistory";

function formatCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR" }).format(amount);
  } catch {
    return `${currency || ""} ${amount.toLocaleString("en-IN")}`.trim();
  }
}

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const totalsByCurrency = useMemo(() => accounts.reduce((totals, account) => {
    const currency = account.currency || "INR";
    totals[currency] = (totals[currency] || 0) + (Number(balances[account._id]) || 0);
    return totals;
  }, {}), [accounts, balances]);

  const totalBalance = useMemo(
    () => Object.values(totalsByCurrency).reduce((sum, value) => sum + Number(value || 0), 0),
    [totalsByCurrency],
  );

  const totalIncoming = useMemo(
    () => transactions.reduce((sum, transaction) => {
      const accountIds = new Set(accounts.map((account) => account._id));
      if (accountIds.has(transaction.toAccount)) {
        return sum + Number(transaction.amount || 0);
      }
      return sum;
    }, 0),
    [transactions, accounts],
  );

  const totalOutgoing = useMemo(
    () => transactions.reduce((sum, transaction) => {
      const accountIds = new Set(accounts.map((account) => account._id));
      if (accountIds.has(transaction.fromAccount)) {
        return sum + Number(transaction.amount || 0);
      }
      return sum;
    }, 0),
    [transactions, accounts],
  );

  const netFlow = totalIncoming - totalOutgoing;

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return undefined;
    }
    let cancelled = false;
    const loadAccounts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/accounts", { headers: { Authorization: `Bearer ${token}` } });
        const accountsData = Array.isArray(res.data) ? res.data : res.data?.accounts || [];
        if (cancelled) return;
        setAccounts(accountsData);
        const balanceEntries = await Promise.all(accountsData.map(async (account) => {
          try {
            const balanceRes = await api.get(`/api/accounts/balance/${account._id}`, { headers: { Authorization: `Bearer ${token}` } });
            return [account._id, Number(balanceRes.data.balance) || 0];
          } catch {
            return [account._id, 0];
          }
        }));
        if (!cancelled) setBalances(Object.fromEntries(balanceEntries));
        try {
          const transactionRes = await api.get("/api/transactions", { headers: { Authorization: `Bearer ${token}` } });
          if (!cancelled) setTransactions(transactionRes.data?.transactions || []);
        } catch {
          if (!cancelled) setTransactions([]);
        }
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }
        setError("Unable to load your accounts. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadAccounts();
    return () => { cancelled = true; };
  }, [navigate, token]);

  const createAccount = async () => {
    setCreating(true);
    setError("");
    setNotice("");
    try {
      await api.post("/api/accounts", {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotice("Account created successfully.");
      setTimeout(() => window.location.reload(), 400);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else setError("Unable to create the account. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen dashboard-shell">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="container-responsive py-6 sm:py-8 lg:py-12">
        <header id="overview" className="mb-8 flex scroll-mt-24 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-eyebrow mb-2">Personal banking</p>
            <h1 className="font-geist font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink">Good to see you</h1>
            <p className="mt-2 font-geist text-body-md text-body">Manage your accounts and keep your money moving.</p>
          </div>
          <div className="premium-badge hidden sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-cyan" aria-hidden="true" />
            Secure session active
          </div>
        </header>

        <section className="hero-card relative overflow-hidden rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="font-geist text-body-sm text-white/70">Total balance</p>
              {Object.entries(totalsByCurrency).length > 0 ? (
                <div className="mt-3 space-y-2">
                  {Object.entries(totalsByCurrency).map(([currency, total]) => (
                    <p key={currency} className="font-geist text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
                      {formatCurrency(total, currency)}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-3 font-geist text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">—</p>
              )}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-geist text-body-sm text-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                Updated just now
              </div>
            </div>

            <div className="space-y-3">
              <div className="mini-panel">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-geist text-body-sm text-white/80">Active accounts</span>
                  <span className="font-geist text-2xl font-medium text-white">{accounts.length}</span>
                </div>
              </div>
              <div className="mini-panel">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-geist text-body-sm text-white/80">Net flow</span>
                  <span className={`font-geist text-xl font-medium ${netFlow >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                    {formatCurrency(Math.abs(netFlow), "INR")}
                  </span>
                </div>
                <p className="mt-2 font-geist text-body-sm text-white/70">{netFlow >= 0 ? "Incoming exceeds outgoing" : "Spending is ahead of incoming"}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="stat-card">
            <p className="label">Available cash</p>
            <p className="value">{formatCurrency(totalBalance, "INR")}</p>
            <div className="trend"><span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />Across all accounts</div>
          </div>
          <div className="stat-card">
            <p className="label">Incoming</p>
            <p className="value">{formatCurrency(totalIncoming, "INR")}</p>
            <div className="trend"><span className="h-2 w-2 rounded-full bg-cyan-500" aria-hidden="true" />Last activity</div>
          </div>
          <div className="stat-card">
            <p className="label">Outgoing</p>
            <p className="value">{formatCurrency(totalOutgoing, "INR")}</p>
            <div className="trend"><span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />This cycle</div>
          </div>
          <div className="stat-card">
            <p className="label">Account health</p>
            <p className="value">{accounts.length > 0 ? "Stable" : "Open"}</p>
            <div className="trend"><span className="h-2 w-2 rounded-full bg-violet-500" aria-hidden="true" />{accounts.length} accounts live</div>
          </div>
        </section>

        {error && <div role="alert" className="mt-6 bg-error-deep/10 border border-error text-error rounded-sm px-4 py-3 font-geist text-body-sm">{error}</div>}
        {notice && <div role="status" className="mt-6 bg-cyan-soft border border-cyan text-ink rounded-sm px-4 py-3 font-geist text-body-sm">{notice}</div>}

        <div className="mb-10 mt-8">
          <p className="section-eyebrow mb-3">Quick actions</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={createAccount} disabled={creating || loading} className="btn-primary flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed">{creating ? "Creating Account..." : "Create Account"}</button>
            <button onClick={logout} className="btn-ghost-sm flex-1 sm:flex-none">Logout</button>
          </div>
        </div>

        <div id="accounts" className="scroll-mt-24">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="section-eyebrow mb-2">Portfolio</p>
              <h2 className="font-geist font-medium text-heading-lg text-ink">Your accounts</h2>
            </div>
            <span className="text-body-sm text-mute">{accounts.length} {accounts.length === 1 ? "account" : "accounts"}</span>
          </div>
          {loading ? (
            <div className="feature-card text-center py-12">
              <div className="mb-4 inline-block h-8 w-8 motion-safe:animate-spin rounded-full border-2 border-ink border-t-transparent" />
              <p className="font-geist text-body-md text-mute">Loading your accounts...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="feature-card text-center py-12">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-hairline-soft text-mute" aria-hidden="true">
                <span className="text-2xl">🏦</span>
              </div>
              <p className="mb-4 font-geist text-body-md text-mute">No accounts yet</p>
              <p className="mb-6 font-geist text-body-sm text-mute">Create your first bank account to get started</p>
              <button onClick={createAccount} disabled={creating} className="btn-primary-sm disabled:opacity-50">{creating ? "Creating..." : "Create Your First Account"}</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {accounts.map((account) => (
                <AccountCard key={account._id} account={account} balance={balances[account._id] ?? 0} />
              ))}
            </div>
          )}
        </div>

        {!loading && accounts.length > 0 && (
          <div id="activity" className="mt-10 grid gap-8 scroll-mt-24 xl:grid-cols-[1.2fr_0.8fr]">
            <TransferPanel accounts={accounts} token={token} onComplete={() => window.location.reload()} />
            <TransactionHistory transactions={transactions} accounts={accounts} />
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
