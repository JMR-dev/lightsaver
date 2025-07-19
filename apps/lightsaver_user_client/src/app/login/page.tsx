"use client";
import styles from "./login.module.css";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      
  };

  return (
    <div>
      <h1 className={styles.heading}>Login</h1>
      <form>
        <label>
          Username:
          <input className={styles.loginInput} type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input
            className={styles.loginInput}
            type="password"
                      name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button className={styles.submitButton} type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
}
