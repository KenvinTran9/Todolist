"use client";
import { useState, KeyboardEvent } from "react";

interface SignUpProps {
  onSignUpSuccess: () => void;
  onLogin?: (token: string, user: { userId: number; username: string; role: string }) => void;
}

function SignUp({ onSignUpSuccess, onLogin }: SignUpProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!username || !password) {
      setError("Please enter username & password");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setError(errData.message || "Sign Up failed");
        return;
      }

      const { accessToken, user } = await response.json();

      if (onLogin) {
        onLogin(accessToken, user);
      }


      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError("");

      onSignUpSuccess(); 
    } catch (err) {
      console.error("Sign Up error:", err);
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSignUp();
  };

  return (
    <div className="signup flex flex-col gap-4 max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-bold text-center">Sign Up</h2>

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
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={loading}
      />

      <button
        onClick={handleSignUp}
        disabled={loading}
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </div>
  );
}

export default SignUp;
