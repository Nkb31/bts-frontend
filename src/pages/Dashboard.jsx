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

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
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
          navigate("/", { replace: true });
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
        navigate("/", { replace: true });
      } else setError("Unable to create the account. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  if (!token) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen dashboard-shell">
      <Navbar />
      <div className="container-responsive py-6 sm:py-8 lg:py-10">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div><p className="section-eyebrow mb-2">Personal banking</p><h1 className="font-geist font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink">Good to see you</h1><p className="font-geist text-body-md text-body mt-2">Manage your accounts and keep your money moving.</p></div>
          <div className="hidden sm:flex items-center gap-2 text-body-sm text-mute"><span className="w-2 h-2 rounded-full bg-cyan" />Secure session active</div>
        </div>
        <div className="hero-card rounded-lg p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-geist text-body-sm mb-2 opacity-75">Total balance</p>
              <div className="space-y-1">
                {Object.entries(totalsByCurrency).length > 0 ? Object.entries(totalsByCurrency).map(([currency, total]) => (
                  <p key={currency} className="font-geist font-medium text-3xl sm:text-4xl tracking-tight text-on-primary">{formatCurrency(total, currency)}</p>
                )) : <p className="font-geist font-medium text-3xl sm:text-4xl tracking-tight text-on-primary">—</p>}
              </div>
            </div>
            <div className="text-left sm:text-right"><p className="font-geist text-body-sm opacity-75">Active accounts</p><p className="font-geist font-medium text-3xl text-on-primary">{accounts.length}</p><p className="font-geist text-body-sm opacity-60 mt-1">Ready to use</p></div>
          </div>
        </div>
        {error && <div role="alert" className="bg-error-deep/10 border border-error text-error rounded-sm px-4 py-3 mb-6 font-geist text-body-sm">{error}</div>}
        {notice && <div role="status" className="bg-cyan-soft border border-cyan text-ink rounded-sm px-4 py-3 mb-6 font-geist text-body-sm">{notice}</div>}
        <div className="mb-10"><p className="section-eyebrow mb-3">Quick actions</p><div className="flex flex-col sm:flex-row gap-3">
          <button onClick={createAccount} disabled={creating || loading} className="btn-primary flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed">{creating ? "Creating Account..." : "Create Account"}</button>
          <button onClick={logout} className="btn-ghost-sm flex-1 sm:flex-none">Logout</button>
        </div></div>
        <div>
          <div className="flex items-end justify-between mb-4"><div><p className="section-eyebrow mb-2">Portfolio</p><h2 className="font-geist font-medium text-heading-lg text-ink">Your accounts</h2></div><span className="text-body-sm text-mute">{accounts.length} {accounts.length === 1 ? "account" : "accounts"}</span></div>
          {loading ? <div className="feature-card text-center py-12"><div className="inline-block w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin mb-4" /><p className="font-geist text-body-md text-mute">Loading your accounts...</p></div> : accounts.length === 0 ? (
            <div className="feature-card text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-hairline-soft text-mute mb-4" aria-hidden="true"><span className="text-2xl">🏦</span></div>
              <p className="font-geist text-body-md text-mute mb-4">No accounts yet</p><p className="font-geist text-body-sm text-mute mb-6">Create your first bank account to get started</p>
              <button onClick={createAccount} disabled={creating} className="btn-primary-sm disabled:opacity-50">{creating ? "Creating..." : "Create Your First Account"}</button>
            </div>
          ) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">{accounts.map((account) => <AccountCard key={account._id} account={account} balance={balances[account._id] ?? 0} />)}</div>}
        </div>
        {!loading && accounts.length > 0 && <div className="mt-8 space-y-8"><TransferPanel accounts={accounts} token={token} onComplete={() => window.location.reload()} /><TransactionHistory transactions={transactions} accounts={accounts} /></div>}
      </div>
    </div>
  );
}

export default Dashboard;
