"use client";
import { useContext } from "react";
import App from "@/components/App";
import Header from "@/components/Header";
import Login from "@/components/Login";
import { AuthContext } from "./AuthProvider"; 
export default function Home() {
  const { token, handleLogout, handleLogin } = useContext(AuthContext);

  return (
    <main className="main bg-white p-8 m-8 rounded-xl shadow-sm max-w-lg w-full">
      <Header token={token} onLogout={handleLogout} />
      {!token ? <Login onLogin={handleLogin} /> : <App />}
    </main>
  );
}
