"use client";
import { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("http://localhost:4000/todos"); 
      const data = await response.json();
      setTodos(data);
      console.log("Fetched todos:", data);
    };

    fetchTodos();
  }, []);

  const handleAdd = async () => {
    if (input.trim() === "") {
      alert("Please enter something");
      return;
    }
    const response = await fetch("http://localhost:4000/todos/create", { // ✅ sửa endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: input.trim() }),
    });
    const { todo } = await response.json();
    setTodos([...todos, todo]);
    setInput("");
  };

  const handleComplete = async (id) => {
    const response = await fetch(`http://localhost:4000/todos/${id}`, { // ✅ sửa endpoint
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.error("Failed to update todo");
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:4000/todos/${id}`, {  // ✅ sửa endpoint
      method: "DELETE",
    });
    if (!response.ok) {
      console.error("Failed to delete todo");
      return;
    }
    setTodos(todos.filter((todo) => todo.id !== id));
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
          {todos.map((todo) => (
            <li
              className={`card flex list-none bg-gray-100 mb-2.5 p-4 rounded-md items-center transition-transform duration-300 ease-in-out border-l-4 border-indigo-500 hover:translate-x-1 shadow-md ${
                todo.isCompleted ? "complete" : ""
              }`}
              key={todo.id}
            >
              <span className="flex-1">{todo.text}</span>
              <div className="action flex gap-4">
                <button
                  className="complete-btn bg-green-600 text-white font-bold px-4 py-2 rounded hover:scale-105 hover:bg-green-700"
                  onClick={() => handleComplete(todo.id)}
                >
                  Complete
                </button>
                <button
                  className="delete-btn bg-red-600 text-white font-bold px-4 py-2 rounded hover:scale-105 hover:bg-red-700"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
export default App;
