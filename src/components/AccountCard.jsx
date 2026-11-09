function AccountCard({ account, balance }) {
  const formatCurrency = (amount, currency) => {
    const numericAmount = Number(amount) || 0;
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency || "INR",
      }).format(numericAmount);
    } catch {
      return `${currency || ""} ${numericAmount.toLocaleString("en-IN")}`.trim();
    }
  };

  return (
    <div className="feature-card account-card cursor-default rounded-2xl p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-link-soft text-lg text-link" aria-hidden="true">↗</span>
            <h3 className="font-geist text-base font-medium text-ink sm:text-heading-md">Bank Account</h3>
          </div>
          <p className="mt-1 font-geist text-body-sm text-mute">Account #{account._id?.slice(-8) || "N/A"}</p>
        </div>
        <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-geist text-label-sm ${account.status?.toLowerCase() === "active" ? "bg-cyan-soft text-cyan" : account.status?.toLowerCase() === "pending" ? "bg-warning-soft text-warning-deep" : "bg-error-deep/10 text-error-deep"}`}>
          {account.status?.toLowerCase() || "unknown"}
        </span>
      </div>
      <div className="space-y-3">
        <div className="ledger-row">
          <span className="font-geist text-body-sm text-mute">Currency</span>
          <span className="font-geist text-body-sm font-medium text-ink">{account.currency}</span>
        </div>
        <div className="ledger-row">
          <span className="font-geist text-body-sm text-mute">Balance</span>
          <span className="font-geist text-body-sm font-medium text-ink">{formatCurrency(balance, account.currency)}</span>
        </div>
        <div className="mt-3 border-t border-hairline pt-3">
          <span className="font-geist text-body-sm text-mute">Account ID</span>
          <p className="mt-1 break-all font-geist text-body-sm text-ink">{account._id}</p>
        </div>
      </div>
    </div>
  );
}

export default AccountCard;
