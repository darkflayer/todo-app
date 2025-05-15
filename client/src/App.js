import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'active'

  // Load tasks when the app starts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Get tasks from backend
  const fetchTasks = async () => {
    const response = await axios.get("https://todo-app-2n0h.onrender.com/tasks");
    setTasks(response.data);
  };

  // Add a new task
  const addTask = async () => {
    if (newTask.trim()) {
      const response = await axios.post("https://todo-app-2n0h.onrender.com/tasks", {
        text: newTask,
        dueDate: dueDate || null, // Send the date
      });
      setTasks([...tasks, response.data]);
      setNewTask("");
      setDueDate(""); // Clear the date input
    }
  };

  // Toggle task completion status
  const toggleTask = async (id) => {
    const response = await axios.put(`https://todo-app-2n0h.onrender.com/tasks/${id}`);
    setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
  };

  // Delete a task
  const deleteTask = async (id) => {
    await axios.delete(`https://todo-app-2n0h.onrender.com/tasks/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true; // Show all if filter is 'all'
  });

  // Then use `filteredTasks` instead of `tasks` in the map:
  // (This line is not needed in the code, as the actual rendering is done below)

  return (
  <div className="App">
    <h1>My To-Do List</h1>
    
    {/* Add Task Form */}
    <div className="add-task">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="What needs to be done?"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
    </div>
    
    {/* Filter Buttons */}
    <div className="filters">
      <button 
        className={filter === 'all' ? 'active' : ''}
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button 
        className={filter === 'active' ? 'active' : ''}
        onClick={() => setFilter('active')}
      >
        Active
      </button>
      <button 
        className={filter === 'completed' ? 'active' : ''}
        onClick={() => setFilter('completed')}
      >
        Completed
      </button>
    </div>
    
    {/* Task List */}
    <ul className="task-list">
      {filteredTasks.map(task => (
        <li key={task._id} className="task-item">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task._id)}
          />
          <span className={`task-text ${task.completed ? 'completed' : ''}`}>
            {task.text}
            {task.dueDate && (
              <span className="task-due">
                (Due: {new Date(task.dueDate).toLocaleDateString()})
              </span>
            )}
          </span>
          <button 
            className="task-delete"
            onClick={() => deleteTask(task._id)}
          >
            🗑️
          </button>
        </li>
      ))}
    </ul>
  </div>
);
}

export default App;
