import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./LiveStocks.module.css"; // Correct import for CSS Modules

const BASE_URL = "http://localhost:8000/api/crypto/top20";

function CryptoList() {
  const [cryptoData, setCryptoData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch top 20 cryptocurrencies
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}?vs_currency=usd`);
        setCryptoData(response.data.top_20_cryptocurrencies);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.cryptoTableContainer}>
      <h1>Top 20 Cryptocurrencies</h1>
      <table className={styles.cryptoTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Ticker</th>
            <th>Price</th>
            <th>24hr %</th>
            <th>Market Cap</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {cryptoData.map((crypto) => (
            <tr key={crypto.id}>
              <td>
                <div className={styles.cryptoName}>
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className={styles.cryptoLogo} // Correctly apply the CSS module class
                  />
                  {crypto.name}
                </div>
              </td>
              <td>{crypto.symbol.toUpperCase()}</td>
              <td>${crypto.current_price.toLocaleString()}</td>
              <td
                className={
                  crypto.price_change_percentage_24h > 0
                    ? styles.positiveChange
                    : styles.negativeChange
                }
              >
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>${crypto.market_cap.toLocaleString()}</td>
              <td>{crypto.total_volume.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CryptoList;
