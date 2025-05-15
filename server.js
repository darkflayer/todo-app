// Import the tools we need
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create our app
const app = express();

// Allow frontend to talk to backend
app.use(cors());
// Let our app understand JSON data
app.use(express.json());

// Connect to MongoDB (we'll use a free online database)
mongoose
  .connect(
    "mongodb+srv://rautanhemu:2ApoLkUVqwIWKZbU@cluster0.vqj3ysk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect", err));

// Define what a "Task" looks like
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  dueDate: Date, // Add this line
});

// Create a Task model (like a template for tasks)
const Task = mongoose.model("Task", taskSchema);

// Routes (paths to different parts of our app)

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
app.post("/tasks", async (req, res) => {
  const newTask = new Task({
    text: req.body.text,
    completed: false,
    dueDate: req.body.dueDate || null, // Add this line
  });
  await newTask.save();
  res.json(newTask);
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Toggle task completion (PUT request)
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed; // Toggle true/false
  await task.save();
  res.json(task);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
