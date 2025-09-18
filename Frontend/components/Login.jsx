"use client";
import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter username & password");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        alert("Invalid username or password");
        return;
      }

      const { accessToken } = await response.json();
      localStorage.setItem("token", accessToken);
      onLogin(accessToken);
      localStorage.setItem("token", accessToken);
      onLogin(accessToken);

      // Clear input
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login flex flex-col gap-4 max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-bold">Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="border p-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
