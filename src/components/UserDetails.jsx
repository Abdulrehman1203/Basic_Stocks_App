import React, { useState } from "react";
import axios from "axios";
import styles from "./UserDetails.module.css";

const UserDetails = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const handleFetchUser = async () => {
    if (!username.trim()) {
      setMessage("Please enter a valid username.");
      setUser(null);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/users/${username}`);
      setUser(response.data);
      setMessage("");
    } catch (error) {
      setUser(null);
      setMessage(error.response?.data?.detail || "Failed to fetch user details");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Fetch User Details</h2>

      {/* Input for Username */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleFetchUser} className={styles.button}>
          Fetch Details
        </button>
      </div>

      {/* Display User Details or Message */}
      {user ? (
        <div className={styles.userInfo}>
          <p>Username: {user.username}</p>
          <p>Balance: {user.balance}</p>
        </div>
      ) : (
        <p className={styles.message}>{message}</p>
      )}
    </div>
  );
};

export default UserDetails;
