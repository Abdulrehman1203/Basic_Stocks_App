import React, { useState } from "react";
import axios from "axios";
import styles from "./TransactionForm.module.css";

const TransactionForm = () => {
  const [transaction, setTransaction] = useState({
    username: "",
    ticker: "",
    transaction_type: "",
    transaction_volume: 0,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction({
      ...transaction,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/transactions", transaction);
      setMessage(`Transaction created successfully: ${response.data.transaction_type}`);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Transaction</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={transaction.username}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="ticker"
          placeholder="Stock Ticker"
          value={transaction.ticker}
          onChange={handleChange}
          className={styles.input}
        />
        <select
          name="transaction_type"
          value={transaction.transaction_type}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select Type</option>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>
        <input
          type="number"
          name="transaction_volume"
          placeholder="Volume"
          value={transaction.transaction_volume}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default TransactionForm;
