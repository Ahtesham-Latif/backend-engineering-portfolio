# Learning Notes: Express CRUD API

This file is the personal learning walkthrough for the project.

It explains the build process and reasoning in plain language.

For the formal assignment reference, use `Documentation.md` inside the project folder.

## What this project is

This repo is a small Node.js + Express API for managing tasks.

It teaches the basics of:

- creating a backend server
- defining REST routes
- handling JSON input/output
- validating requests
- documenting APIs with Swagger
- writing a clean portfolio README

---

## Step 1: Start with `npm init`

```bash
npm init -y
```

This creates `package.json`.

That file is important because it stores:

- project name
- scripts
- dependencies
- runtime settings

A minimal example from this project:

```json
{
  "name": "assignment-01-build-your-first-crud-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^5.2.1",
    "swagger-ui-express": "^5.0.1"
  }
}
```

The important part here is `type: "module"`, which allows modern ES import syntax.

---

## Step 2: Install the dependencies

```bash
npm install express
npm install swagger-ui-express
```

### Why these packages?

- `express` handles the HTTP server and routes
- `swagger-ui-express` exposes the API docs in the browser

---

## Step 3: Create the Express app instance

```js
import express from "express";
import SwaggerUi from "swagger-ui-express";
import fs from "fs";

const app = express();
app.use(express.json());
```

### What this does

- creates the Express application instance with `const app = express()`
- adds JSON request parsing middleware with `app.use(express.json())`
- prepares the app for route registration and Swagger documentation

---

## Step 4: In-memory task storage

```js
let tasks = {
  1: { title: "Buy milk", done: false },
  2: { title: "Read Express docs", done: true },
  3: { title: "Complete Stage 4", done: false }
};
let t_id = 4;
```

This is a simple in-memory database for learning.

It means:

- no database setup is needed
- data is easy to inspect
- data resets when the server restarts

---

## Step 5: Reset function

```js
function resetTasks() {
  tasks = {
    1: { title: "Buy milk", done: false },
    2: { title: "Read Express docs", done: true },
    3: { title: "Complete Stage 4", done: false }
  };
  t_id = 4;
}
```

This function restores the initial sample tasks. It is useful for testing and keeping the app in a known state.

---

## Step 6: Add Swagger docs

```js
const swaggerDocument = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));
app.use("/docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
```

This loads the OpenAPI document from `openapi.json` and mounts Swagger UI on the `/docs` route.

So the interactive docs are available at:

```text
http://localhost:3000/docs
```

---

## Step 7: Main routes

### `GET /tasks`

```js
app.get("/tasks", (req, res) => {
  let list = Object.entries(tasks).map(([id, task]) => ({
    id: Number(id),
    ...task
  }));

  if (req.query.done !== undefined) {
    list = list.filter(task => task.done === (req.query.done === "true"));
  }

  if (req.query.search) {
    const searchTerm = String(req.query.search).toLowerCase();
    list = list.filter(task => task.title.toLowerCase().includes(searchTerm));
  }

  res.status(200).json(list);
});
```

This endpoint returns all tasks and supports filters like:

```http
GET /tasks?done=true
GET /tasks?done=false
GET /tasks?search=milk
```

### `GET /tasks/:id`

This returns one task by ID.

```js
const taskId = Number(req.params.id);
```

If the ID is invalid or missing, the API returns a `404`.

### `POST /tasks`

```js
app.post("/tasks", (req, res) => {
  let title = req.body.title ? String(req.body.title).trim() : "";

  if (!title) {
    return res.status(400).json({ error: "Title is required and cannot be empty" });
  }

  const id = t_id;
  tasks[id] = { title, done: false };
  t_id++;

  res.status(201).json({ id, title, done: false });
});
```

This creates a new task and validates the title.

### `PUT /tasks/:id`

Updates the task title and/or completion status.

This is not a full API reference; the formal endpoint behavior is documented in `Documentation.md`.

### `DELETE /tasks/:id`

Deletes the selected task.

---

## Step 8: How the whole flow works

A request goes through this path:

```text
client request -> Express route -> validation -> task update -> JSON response
```

Example:

```http
POST /tasks
Content-Type: application/json

{
  "title": "Write documentation"
}
```

The server creates a new task in memory and responds with:

```json
{
  "id": 4,
  "title": "Write documentation",
  "done": false
}
```

---

## Step 9: Run it locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
http://localhost:3000/docs
```

---

## Step 10: README improvement

The root `README.md` was updated to feel more mature and portfolio-ready.

This makes the repository look like a real engineering artifact instead of just a basic homework folder.

---

## Last 3 commits

```text
2d4eb25 docs: refresh project README and documentation for assignment 01
3b25650 feat: add Swagger docs and task filtering
bb580c9 Stage 4: refactor to tasks and complete full CRUD
```

### What they mean

- the docs were polished
- Swagger docs were added
- task filtering was added
- the CRUD flow was completed and refactored

---

## Final takeaway

This project is a good example of how a small backend API moves from:

- `npm init`
- Express setup
- route creation
- CRUD logic
- documentation
- polished portfolio presentation

It is simple, but it shows the real lifecycle of a backend learning project very clearly.
