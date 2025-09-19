"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../app/AuthProvider";

function App() {
  const { token, user } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetchTodos = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Fetch todos failed");
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTodos();
  }, [token]);

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch("http://localhost:4000/api/todos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: input.trim() }),
      });
      if (!res.ok) return;
      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isCompleted: !todo.isCompleted }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section>
      <div className="search-content flex gap-[10px] mb-8">
        <input
          className="content border-2 border-gray-300 rounded-md p-[15px] text-base flex-1 outline-0 transition-colors duration-300 ease focus:border-indigo-500 hover:bg-indigo-50"
          type="text"
          placeholder="Enter the new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="btn bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md text-white px-[25px] py-0 border-0 cursor-pointer text-base font-bold transition-transform duration-200 ease-in hover:-translate-y-1 hover:shadow-md"
          onClick={handleAdd}
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
            const isOwner = user?.userId === todo.createdBy;
            return (
              <li
                key={todo.id}
                className={`card flex list-none bg-gray-100 mb-2.5 p-4 rounded-md items-center transition-transform duration-300 ease-in-out border-l-4 border-indigo-500 hover:translate-x-1 shadow-md ${
                  todo.isCompleted ? "line-through text-gray-500" : ""
                }`}
              >
                <span className="flex-1">{todo.text}</span>
                {isOwner && (
                  <div className="action flex gap-4">
                    <button
                      className="complete-btn bg-green-600 text-white font-bold px-4 py-2 rounded hover:scale-105 hover:bg-green-700"
                      onClick={() => handleComplete(todo.id)}
                    >
                      {todo.isCompleted ? "Undo" : "Complete"}
                    </button>
                    <button
                      className="delete-btn bg-red-600 text-white font-bold px-4 py-2 rounded hover:scale-105 hover:bg-red-700"
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
