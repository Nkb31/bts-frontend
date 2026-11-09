import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import api from "../services/api";

function TransferPanel({ accounts, token, onComplete }) {
  const [fromAccount, setFromAccount] = useState(accounts[0]?._id || "");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submitTransfer = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    if (!fromAccount || !toAccount || Number(amount) <= 0) {
      setStatus({ type: "error", message: "Choose a source account, enter a destination account, and use a valid amount." });
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/transactions", {
        fromAccount,
        toAccount: toAccount.trim(),
        amount: Number(amount),
        idempotencyKey: crypto.randomUUID(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setAmount("");
      setToAccount("");
      setStatus({ type: "success", message: "Transfer completed successfully." });
      onComplete();
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Transfer failed. Check the account ID and balance, then try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="feature-card-elevated" aria-labelledby="transfer-heading">
      <div className="flex items-start justify-between gap-4 mb-6"><div><p className="section-eyebrow mb-2">Move money</p><h2 id="transfer-heading" className="font-geist font-medium text-heading-lg text-ink">Send a transfer</h2><p className="font-geist text-body-sm text-body mt-1">Move funds securely between active accounts.</p></div><span className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-link-soft text-link text-xl" aria-hidden="true"><FaExchangeAlt /></span></div>
      {status.message && <div role={status.type === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-sm px-4 py-3 mb-5 text-body-sm ${status.type === "error" ? "bg-error-deep/10 text-error-deep" : "bg-cyan-soft text-ink"}`}>{status.message}</div>}
      <form onSubmit={submitTransfer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="font-geist text-label-sm text-ink">From account<select name="fromAccount" value={fromAccount} onChange={(event) => setFromAccount(event.target.value)} className="text-input w-full mt-2" required>{accounts.map((account) => <option key={account._id} value={account._id}>{account._id.slice(-8)} · {account.currency}</option>)}</select></label>
        <label className="font-geist text-label-sm text-ink">Destination account<input name="toAccount" value={toAccount} onChange={(event) => setToAccount(event.target.value)} className="text-input w-full mt-2" placeholder="Paste account ID…" required /></label>
        <label className="font-geist text-label-sm text-ink">Amount<input name="amount" type="number" min="0.01" step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} className="text-input w-full mt-2" placeholder="0.00" required /></label>
        <div className="md:col-span-3"><button type="submit" disabled={submitting || accounts.length === 0} className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? "Processing…" : "Send transfer"}</button></div>
      </form>
    </section>
  );
}

export default TransferPanel;
