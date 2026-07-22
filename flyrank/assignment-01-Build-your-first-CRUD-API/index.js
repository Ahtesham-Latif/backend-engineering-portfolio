// 1. Importing Express 
// Importing SwaggerUi
import express from "express";
import SwaggerUi from "swagger-ui-express";
import fs from "fs";

const app = express();

app.use(express.json());

let tasks = {
  1: { title: "Buy milk", done: false },
  2: { title: "Read Express docs", done: true },
  3: { title: "Complete Stage 4", done: false }
};
let nextTaskId = 4;

function resetTasks() {
  tasks = {
    1: { title: "Buy milk", done: false },
    2: { title: "Read Express docs", done: true },
    3: { title: "Complete Stage 4", done: false }
  };
  nextTaskId = 4;
}

const swaggerDocument = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));
app.use("/docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));

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

app.get("/tasks", (req, res) => {
  let list = Object.entries(tasks).map(([id, task]) => ({
    id: Number(id),
    ...task
  }));

  if (req.query.done !== undefined) {
    const isDone = String(req.query.done)
      .trim()
      .replace(/["']/g, "")
      .toLowerCase() === "true";

    list = list.filter(task => task.done === isDone);
  }

  if (req.query.search !== undefined) {
    const searchTerm = String(req.query.search)
      .trim()
      .replace(/["']/g, "")
      .toLowerCase();

    list = list.filter(task => task.title.toLowerCase().includes(searchTerm));
  }

  res.status(200).json({ list });
});

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

app.get("/stats", (req, res) => {
  const total = Object.keys(tasks).length;
  const doneCount = Object.values(tasks).filter(task => task.done === true).length;

  res.status(200).json({
    total,
    done: doneCount,
    open: total - doneCount
  });
});

app.post("/reset", (req, res) => {
  resetTasks();
  res.status(200).json({
    message: "tasks reset",
    tasks: Object.entries(tasks).map(([id, task]) => ({ id: Number(id), ...task }))
  });
});

app.post("/tasks", (req, res) => {
  const title = String(req.body.title ?? "").trim();

  if (!title) {
    return res.status(400).json({ error: "Title is required and cannot be empty" });
  }

  const id = nextTaskId;
  tasks[id] = { title, done: false };
  nextTaskId++;

  res.status(201).json({
    id,
    ...tasks[id]
  });
});

app.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId) || !Object.prototype.hasOwnProperty.call(tasks, taskId)) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  if (req.body.title !== undefined) {
    const title = String(req.body.title).trim();

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

app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId) || !Object.prototype.hasOwnProperty.call(tasks, taskId)) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  delete tasks[taskId];
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});