import React, { useState } from "react";
import axios from "axios";
import styles from "./TransactionByDate.module.css";

const TransactionFilter = ({ username, onFilterResult }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  const handleFilter = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/transactions/${username}/by-date?start_time=${startTime}&end_time=${endTime}`
      );
      onFilterResult(response.data);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Error fetching filtered transactions");
    }
  };

  return (
    <div className={styles.container}>
      <h3>Filter Transactions by Date</h3>
      <input
        type="text"
        placeholder="Start Time (YYYY-MM-DD HH:MM:SS)"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="End Time (YYYY-MM-DD HH:MM:SS)"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleFilter} className={styles.button}>
        Filter
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default TransactionFilter;
