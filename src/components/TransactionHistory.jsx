function TransactionHistory({ transactions, accounts }) {
  const accountIds = new Set(accounts.map((account) => account._id));
  const formatCurrency = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(amount) || 0);

  return (
    <section className="feature-card-elevated" aria-labelledby="transactions-heading">
      <div className="flex items-end justify-between gap-4 mb-5"><div><p className="section-eyebrow mb-2">Activity</p><h2 id="transactions-heading" className="font-geist font-medium text-heading-lg text-ink">Recent transfers</h2></div><span className="text-body-sm text-mute">Last 50</span></div>
      {transactions.length === 0 ? <p className="text-body-sm text-mute py-5">Your recent transfers will appear here.</p> : <div className="divide-y divide-hairline">{transactions.map((transaction) => { const outgoing = accountIds.has(transaction.fromAccount); return <div key={transaction._id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><div className="min-w-0"><p className="font-geist text-body-sm text-ink truncate">{outgoing ? "Transfer sent" : "Transfer received"}</p><p className="font-geist text-body-sm text-mute truncate">{new Date(transaction.createdAt).toLocaleDateString()} · {transaction.status}</p></div><p className={`font-geist font-medium tabular-nums ${outgoing ? "text-error-deep" : "text-cyan"}`}>{outgoing ? "−" : "+"}{formatCurrency(transaction.amount)}</p></div>; })}</div>}
    </section>
  );
}

export default TransactionHistory;
