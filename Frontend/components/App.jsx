"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../app/AuthProvider";

function App() {
  const { token, user } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:4000/api/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Session expired. Please login again.");
          } else {
            throw new Error("Fetch todos failed");
          }
          return;
        }

        const data = await res.json();
        setTodos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch todos error:", err);
        setError("Failed to load todos. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [token]);

  const handleAdd = async () => {
    if (!input.trim()) {
      setError("Please enter a task");
      return;
    }

    try {
      setError("");

      const res = await fetch("http://localhost:4000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: input.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Failed to add todo");
        return;
      }

      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      setInput("");
    } catch (err) {
      console.error("Add todo error:", err);
      setError("Failed to add todo. Please try again.");
    }
  };

  const handleComplete = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      setError("");
      const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCompleted: !todo.isCompleted }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setError("You don't have permission to edit this todo");
        } else if (res.status === 404) {
          setError("Todo not found");

          setTodos((prev) => prev.filter((t) => t.id !== id));
        } else {
          setError(errorData.message || "Failed to update todo");
        }
        return;
      }

      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("Update todo error:", err);
      setError("Failed to update todo. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setError("You don't have permission to delete this todo");
        } else if (res.status === 404) {
          setError("Todo not found");
          setTodos((prev) => prev.filter((t) => t.id !== id));
        } else {
          setError(errorData.message || "Failed to delete todo");
        }
        return;
      }

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete todo error:", err);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  if (loading && todos.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-gray-600">Loading todos...</p>
      </div>
    );
  }

  return (
    <section>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            className="float-right font-bold text-red-700 hover:text-red-900"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      <div className="search-content flex gap-[10px] mb-8">
        <input
          className="content border-2 border-gray-300 rounded-md p-[15px] text-base flex-1 outline-0 transition-colors duration-300 ease focus:border-indigo-500 hover:bg-indigo-50"
          type="text"
          placeholder="Enter the new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="btn bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md text-white px-[25px] py-0 border-0 cursor-pointer text-base font-bold transition-transform duration-200 ease-in hover:-translate-y-1 hover:shadow-md disabled:opacity-50"
          onClick={handleAdd}
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>

      {todos.length === 0 ? (
        <div className="empty-background text-center text-gray-500 italic py-10 px-5 text-base">
          <p>Add new tasks!</p>
        </div>
      ) : (
        <ul className="todolist">
          {todos.map((todo) => {
            const isOwner = user?.id === todo.createdBy;
            return (
              <li
                key={todo.id}
                className={`card flex list-none bg-gray-100 mb-2.5 p-4 rounded-md items-center transition-transform duration-300 ease-in-out border-l-4 border-indigo-500 hover:translate-x-1 shadow-md ${
                  todo.isCompleted ? "line-through text-gray-500" : ""
                }`}
              >
                <span className="flex-1">{todo.text}</span>

                <span className="text-sm text-gray-500 mr-4">
                  by{" "}
                  <strong>
                    {todo.createdByUsername || `User${todo.createdBy}`}
                  </strong>
                  {isOwner && <span className="text-indigo-600"> (You)</span>}
                </span>

                {isOwner && (
                  <div className="action flex gap-4">
                    <button
                      className="complete-btn bg-green-600 text-white font-bold px-4 py-2 rounded hover:scale-105 hover:bg-green-700 transition-all"
                      onClick={() => handleComplete(todo.id)}
                    >
                      {todo.isCompleted ? "Undo" : "Complete"}
                    </button>
                    <button
                      className="delete-btn bg-red-600 text-white font-bold px-4 py-2 rounded hover:scale-105 hover:bg-red-700 transition-all"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default App;
