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
      setToken(savedToken);
    }
  }, []);

  return (
    <main className="main bg-white p-8 m-8 rounded-xl shadow-sm max-w-lg w-full">
      <Header />
      {!token ? (
        <Login onLogin={(tk: string) => setToken(tk)} />
      ) : (
        <App token={token} />
      )}
    </main>
  );
}
