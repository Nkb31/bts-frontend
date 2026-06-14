import { useEffect, useState } from "react";
import axios from "axios";
import AccountCard from "../components/AccountCard";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  useEffect(() => {
    fetchAccounts();
  }, []);
  const fetchBalance = async (accountId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `https://bank-transaction-system-4938.onrender.com/api/accounts/balance/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBalances((prev) => ({
        ...prev,
        [accountId]: res.data.balance,
      }));
    } catch (err) {
      console.log(err);
    }
  };
  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://bank-transaction-system-4938.onrender.com/api/accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);

      const accountsData = Array.isArray(res.data)
        ? res.data
        : res.data.accounts || [];

      setAccounts(accountsData);

      accountsData.forEach((account) => {
        fetchBalance(account._id);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Bank Dashboard</h1>
      <button
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={logout}
      >
        Logout
      </button>
      <button
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={createAccount}
      >
        Create Account
      </button>
      <h3>Total Accounts: {accounts.length}</h3>
      <h2>Your Accounts</h2>

      {accounts.map((account) => (
        <AccountCard
          key={account._id}
          account={account}
          balance={balances[account._id] ?? 0}
        />
      ))}
    </div>
  );
}
const createAccount = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "https://bank-transaction-system-4938.onrender.com/api/accounts",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(res.data);
    alert("Account Created");

    fetchAccounts();
  } catch (err) {
    console.log(err);
  }
};

export default Dashboard;
