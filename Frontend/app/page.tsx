"use client";
import { useState, useEffect } from "react";
import App from "@/components/App";
import Header from "@/components/Header";
import Login from "@/components/Login";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      fetch("http://localhost:4000/auth/verify", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          setToken(savedToken);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        });
    }
  }, []);

  const handleLogin = (tk: string) => {
    setToken(tk);
    localStorage.setItem("token", tk);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <main className="main bg-white p-8 m-8 rounded-xl shadow-sm max-w-lg w-full">
      <Header onLogout={handleLogout} token={token} />
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <App token={token} />
      )}
    </main>
  );
}
