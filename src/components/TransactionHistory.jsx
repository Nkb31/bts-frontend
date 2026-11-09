function TransactionHistory({ transactions, accounts }) {
  const accountIds = new Set(accounts.map((account) => account._id));
  const formatCurrency = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(amount) || 0);

  return (
    <section className="feature-card-elevated rounded-2xl p-5 sm:p-6" aria-labelledby="transactions-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow mb-2">Activity</p>
          <h2 id="transactions-heading" className="font-geist font-medium text-heading-lg text-ink">Recent transfers</h2>
        </div>
        <span className="font-geist text-body-sm text-mute">Last 50</span>
      </div>

      {transactions.length === 0 ? (
        <p className="py-5 font-geist text-body-sm text-mute">Your recent transfers will appear here.</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const outgoing = accountIds.has(transaction.fromAccount);
            return (
              <div key={transaction._id} className="ledger-row bg-canvas/40 px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-geist text-body-sm text-ink">{outgoing ? "Transfer sent" : "Transfer received"}</p>
                  <p className="truncate font-geist text-body-sm text-mute">{new Date(transaction.createdAt).toLocaleDateString()} · {transaction.status}</p>
                </div>
                <p className={`font-geist font-medium tabular-nums ${outgoing ? "text-error-deep" : "text-cyan"}`}>
                  {outgoing ? "−" : "+"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TransactionHistory;
