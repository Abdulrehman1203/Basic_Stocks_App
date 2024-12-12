import React, { useState } from "react";
import axios from "axios";
import styles from "./Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "", balance: 0 });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/register", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          className={styles.input}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          className={styles.input}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <input
          type="number"
          placeholder="Balance"
          value={formData.balance}
          className={styles.input}
          onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
        />
        <button type="submit" className={styles.button}>Register</button>
      </form>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default Register;
