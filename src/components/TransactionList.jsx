import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TransactionList.module.css";

const TransactionList = ({ username }) => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [inputUsername, setInputUsername] = useState(username || "");
  const [submittedUsername, setSubmittedUsername] = useState(username);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (submittedUsername) {
          const response = await axios.get(`http://localhost:8000/transactions/${submittedUsername}`);
          setTransactions(response.data);
          setMessage("");
        }
      } catch (error) {
        setTransactions([]);
        setMessage(error.response?.data?.detail || "Error fetching transactions");
      }
    };

    fetchTransactions();
  }, [submittedUsername]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedUsername(inputUsername);
  };

  return (
    <div className={styles.container}>
      <h2>Transaction History</h2>

      {/* Username Input Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="username">Enter Username:</label>
        <input
          type="text"
          id="username"
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          placeholder="Enter username" // Ensuring no default text here
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Fetch Transactions
        </button>
      </form>

      {/* Display Error Message */}
      {message && <p className={styles.message}>{message}</p>}

      {/* Display Transactions */}
      <ul className={styles.transactionList}>
        {transactions.map((transaction) => (
          <li key={transaction.id} className={styles.transactionItem}>
            <p>
              <strong>{transaction.transaction_type.toUpperCase()}</strong> {transaction.transaction_volume} of{" "}
              <strong>{transaction.ticker}</strong>
            </p>
            <p>Price: ${transaction.transaction_price}</p>
            <p>Time: {new Date(transaction.created_time).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
