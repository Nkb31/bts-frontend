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
    <div className="feature-card account-card cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-link-soft text-link" aria-hidden="true">↗</span><h3 className="font-geist font-medium text-base sm:text-heading-md text-ink">Bank Account</h3></div>
          <p className="font-geist text-body-sm text-mute mt-1">Account #{account._id?.slice(-8) || "N/A"}</p>
        </div>
        <span className={`font-geist text-label-sm px-2.5 py-1 rounded-sm whitespace-nowrap ${account.status?.toLowerCase() === "active" ? "bg-cyan-soft text-cyan" : account.status?.toLowerCase() === "pending" ? "bg-warning-soft text-warning-deep" : "bg-error-deep/10 text-error-deep"}`}>
          {account.status?.toLowerCase() || "unknown"}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between"><span className="font-geist text-body-sm text-mute">Currency</span><span className="font-geist text-body-sm text-ink font-medium">{account.currency}</span></div>
        <div className="flex items-center justify-between"><span className="font-geist text-body-sm text-mute">Balance</span><span className="font-geist text-body-sm text-ink font-medium">{formatCurrency(balance, account.currency)}</span></div>
        <div className="pt-3 mt-3 border-t border-hairline"><span className="font-geist text-body-sm text-mute">Account ID</span><p className="font-geist text-body-sm text-ink font-mono mt-1 break-all">{account._id}</p></div>
      </div>
    </div>
  );
}

export default AccountCard;
