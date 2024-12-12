import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./StockList.module.css";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getstocks/");
        setStocks(response.data);
      } catch (error) {
        setMessage(`Error: ${error.response?.data?.detail || error.message}`);
      }
    };
    fetchStocks();
  }, []);

  return (
    <div className={styles.container}>
      <h2>All Stocks</h2>
      {message && <p className={styles.message}>{message}</p>}
      <ul className={styles.stockList}>
        {stocks.map((stock) => (
          <li key={stock.ticker} className={styles.stockItem}>
            <a href={`/stock/${stock.ticker}`}>{stock.stock_name} ({stock.ticker})</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockList;
