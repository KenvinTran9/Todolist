"use client";
import { useState } from "react";

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username & password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          setError("Invalid username or password");
        } else {
          setError(errorData.message || "Server error, please try again later");
        }
        return;
      }

      const { accessToken, user } = await response.json();

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin(accessToken, user);

      setUsername("");
      setPassword("");
      setError("");
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error, please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login flex flex-col gap-4 max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-bold text-center">Login</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={handleKeyPress}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={loading}
      />
      <button
        className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
