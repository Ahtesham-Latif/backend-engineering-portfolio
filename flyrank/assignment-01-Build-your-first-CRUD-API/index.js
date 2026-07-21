// 1. Importing Express 
// Importing SwaggerUi
import express from "express";
import SwaggerUi from "swagger-ui-express";
import fs from "fs";

// 2. Creating express app instance
const app = express();

// 3. JSON middleware
app.use(express.json());

// 4. In-memory storage pre-filled with 3 example tasks
let tasks = {
  1: { title: "Buy milk", done: false },
  2: { title: "Read Express docs", done: true },
  3: { title: "Complete Stage 4", done: false }
};
let t_id = 4;

function resetTasks() {
  tasks = {
    1: { title: "Buy milk", done: false },
    2: { title: "Read Express docs", done: true },
    3: { title: "Complete Stage 4", done: false }
  };
  t_id = 4;
}

// Read the openapi.json file
const swaggerDocument = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

// Mount Swagger UI at /api-docs
app.use("/docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));


// 5. Health & Root Endpoints
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

// GET /tasks - List all tasks
app.get("/tasks", (req, res) => {
  let list = Object.entries(tasks).map(([id, task]) => ({
    id: Number(id),
    ...task
  }));
    // Filter by completed status: /tasks?done=true or /tasks?done=false
  if (req.query.done !== undefined) {
    const isDone = req.query.done === "true";
    list = list.filter(task => task.done === isDone);
  }

  // Filter by search keyword: /tasks?search=milk
  if (req.query.search) {
    const searchTerm = String(req.query.search).toLowerCase();
    list = list.filter(task => task.title.toLowerCase().includes(searchTerm));
  }
  res.status(200).json(list);
});

// GET /tasks/:id - Single task
app.get("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId) || !Object.prototype.hasOwnProperty.call(tasks, taskId)) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  const task = tasks[taskId];
  res.status(200).json({
    id: taskId,
    ...task
  });
});

// GET /stats & POST /reset
app.get("/stats", (req, res) => {
  const total = Object.keys(tasks).length;
  const doneCount = Object.values(tasks).filter(t => t.done === true).length;
  res.status(200).json({
    total,
    done: doneCount,
    open: total - doneCount
  });
});

app.post("/reset", (req, res) => {
  resetTasks();
  res.status(200).json({ message: "tasks reset", tasks: Object.entries(tasks).map(([id, t]) => ({ id: Number(id), ...t })) });
});

// 6. POST /tasks - Create a task
app.post("/tasks", (req, res) => {
  let title = req.body.title ? String(req.body.title).trim() : "";

  if (!title) {
    return res.status(400).json({ error: "Title is required and cannot be empty" });
  }

  const id = t_id;
  tasks[id] = {
    title,
    done: false
  };
  t_id++;

  res.status(201).json({
    id,
    ...tasks[id]
  });
});

// 7. PUT /tasks/:id - Update a task
app.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId) || !Object.prototype.hasOwnProperty.call(tasks, taskId)) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  if (req.body.title !== undefined) {
    let title = String(req.body.title).trim();
    if (!title) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    tasks[taskId].title = title;
  }

  if (req.body.done !== undefined) {
    tasks[taskId].done = Boolean(req.body.done);
  }

  res.status(200).json({
    id: taskId,
    ...tasks[taskId]
  });
});

// 8. DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId) || !Object.prototype.hasOwnProperty.call(tasks, taskId)) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  delete tasks[taskId];
  res.status(204).send();
});

// 9. Start server
const Port = 3000;
app.listen(Port, () => {
  console.log(`Server running on http://localhost:${Port}`);
});