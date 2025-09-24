"use client";

import { useContext, useState } from "react";
import App from "@/components/App";
import Header from "@/components/Header";
import Login from "@/components/Login";
import SignUp from "@/components/Signup";
import { AuthContext } from "./AuthProvider";

export default function Home() {
  const { token, handleLogout, handleLogin } = useContext(AuthContext);
  const [showSignUp, setShowSignUp] = useState<boolean>(false);

  if (token) {
    return (
      <main className="main bg-white p-8 m-8 rounded-xl shadow-sm max-w-lg w-full">
        <Header token={token} onLogout={handleLogout} />
        <App />
      </main>
    );
  }

  return (
    <main className="main bg-white p-8 m-8 rounded-xl shadow-sm max-w-lg w-full">
      <Header token={token} onLogout={handleLogout} />
      {showSignUp ? (
        <SignUp onSignUpSuccess={() => setShowSignUp(false)} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
      <div className="mt-4 text-center">
        <button
          className="text-indigo-600 hover:underline"
          onClick={() => setShowSignUp(!showSignUp)}
        >
          {showSignUp ? "Back to Login" : "Create an account"}
        </button>
      </div>
    </main>
  );
}
