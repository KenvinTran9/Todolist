"use client";
import React from "react";

export default function Header({ token, onLogout }) {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Todo App</h1>
      {token && (
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      )}
    </header>
  );
}
