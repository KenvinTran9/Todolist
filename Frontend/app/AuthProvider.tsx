"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: number;
  username: string;
  role: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  handleLogin: (token: string, user: User) => void;
  handleLogout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || null;
    const savedUser = localStorage.getItem("user");
    try {
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser) as User);
      }
    } catch {
      console.warn("Failed to parse user from localStorage");
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogin = (tk: string, u: User) => {
    setToken(tk);
    setUser(u);
    localStorage.setItem("token", tk);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
