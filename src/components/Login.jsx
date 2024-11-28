import React, { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `http://localhost:8000/login?username=${credentials.username}&password=${credentials.password}`
    );
    setMessage(response.data.message || "Login successful");
  } catch (error) {
    const errorMsg = error.response?.data?.detail || "Login failed";
    setMessage(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
  }
};



  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          className={styles.input}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          className={styles.input}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default Login;
