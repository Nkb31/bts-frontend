function AccountCard({ account, balance }) {
  return (
    <div
      style={{
        background: "#1e293b",
        color: "white",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "15px",
      }}
    >
      <h3>Bank Account</h3>
      <p>Status: {account.status}</p>
      <p>Currency: {account.currency}</p>
      <p>Balance: ₹{balance}</p>
      <p>ID: {account._id}</p>
    </div>
  );
}

export default AccountCard;
