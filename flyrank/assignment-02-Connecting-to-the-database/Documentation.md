# Assignment 01 - Build Your First CRUD API

This document is the formal technical reference for the assignment.

For the step-by-step learning notes and implementation journey, see `Learning.md` in the project folder.

## Objective

This assignment focuses on building a complete RESTful API with **Express.js** that manages an in-memory collection of tasks.

The API supports full **CRUD (Create, Read, Update, Delete)** functionality and also includes:

- Health monitoring
- Server statistics
- Resetting the sample data
- Input validation
- Input sanitization
- Dynamic route parameters
- Proper HTTP status codes
- JSON request/response handling
- Swagger/OpenAPI documentation via Swagger UI
- Query-based filtering for listing tasks

Unlike a database-backed application, this project stores all tasks in a JavaScript object, making it ideal for learning how REST APIs work before introducing persistent databases such as MongoDB or PostgreSQL.

---

# Technologies Used

- Node.js
- Express.js
- JavaScript (ES Modules)
- JSON
- Swagger UI + OpenAPI
- curl (API Testing)

---

# Project Structure

```text
assignment-01-Build-your-first-CRUD-API/
│
├── Documentation.md
├── Learning.md
├── index.js
├── openapi.json
├── package.json
├── package-lock.json
└── src/
    ├── app.js
    ├── controllers/
    │   └── taskController.js
    ├── middleware/
    │   └── errorHandler.js
    ├── routes/
    │   ├── metaRoutes.js
    │   └── taskRoutes.js
    ├── services/
    │   └── taskServices.js
    └── errors.js
```

---

# Layered Architecture

The code is structured in clear application layers:

- `src/app.js` - application setup, middleware, and route registration
- `src/routes/*.js` - route definitions for HTTP endpoints
- `src/controllers/*.js` - request handling and response formatting
- `src/services/*.js` - task business logic and validation
- `src/middleware/errorHandler.js` - centralized Express error middleware
- `src/errors.js` - shared error classes used across controllers and services

This separation makes the project easier to extend later, for example by adding a SQLite repository layer without changing routes or controllers.

---

# Error Handling

Errors are managed in a dedicated middleware layer. Controllers forward exceptions to `errorHandler`, and custom error classes are defined in `src/errors.js`.

Example:

- `BadRequestError` for invalid input
- `NotFoundError` for missing tasks
- `AppError` as the base error class

This keeps route logic simple and allows consistent JSON error responses.

---

# Run the API

From the project folder, install dependencies and start the server:

```bash
npm install
npm run dev
```

The server will run on:

```text
http://localhost:3000
```

The API documentation is available through Swagger UI at:

```text
http://localhost:3000/docs
```

---

# Key Concepts & Lessons Learned

## 1. Express Application

The Express framework allows developers to quickly create web servers and REST APIs.

```js
import express from "express";

const app = express();
```

The `app` object is responsible for defining routes, middleware, and starting the server.

---

## 2. JSON Middleware

```js
app.use(express.json());
```

This middleware parses incoming JSON requests.

Without it,

```js
req.body
```

would be

```text
undefined
```

for every POST and PUT request.

This middleware should always be added before routes that receive JSON data.

---

## 3. In-Memory Storage

Instead of using a database, tasks are stored inside a JavaScript object.

```js
let tasks = {
    1: { title: "Buy milk", done: false },
    2: { title: "Read Express docs", done: true },
    3: { title: "Complete Stage 4", done: false }
};
```

Advantages:

- Fast
- Simple
- Great for learning REST APIs

Disadvantages:

- Data disappears when the server restarts.
- Not suitable for production applications.

---

## 4. Auto Increment IDs

```js
let t_id = 4;
```

Every new task receives a unique ID.

Example:

```
Task 4
Task 5
Task 6
```

This mimics how databases automatically generate primary keys.

---

## 5. Reset Function

```js
function resetTasks() {
    ...
}
```

The reset function restores the original sample tasks.

This allows developers to quickly restore a clean testing environment.

---

## 6. GET Endpoints

### GET /

Returns information about the API.

Example Response

```json
{
    "name": "Task API",
    "version": "1.0",
    "endpoints": ["/tasks"]
}
```

---

### GET /health

Checks whether the server is running.

Example Response

```json
{
    "status": "ok"
}
```

---

### GET /tasks

Returns every task as a wrapped response object:

```json
{
    "list": [
        {
            "id": 1,
            "title": "Buy milk",
            "done": false
        }
    ]
}
```

Internally, tasks are still stored as an object.

The array is produced with:

```js
Object.entries(tasks)
```

and then mapped into the API response format.

The endpoint also supports optional query filters:

- `GET /tasks?done=true` → returns only completed tasks
- `GET /tasks?done=false` → returns only open tasks
- `GET /tasks?search=milk` → returns tasks whose titles contain the search term

The latest implementation uses a small regex cleanup pattern before filtering:

```js
const isDone = String(req.query.done)
    .trim()
    .replace(/["']/g, "")
    .toLowerCase() === "true";
```

This is a common defensive pattern used in real APIs to normalize user input before comparisons.

---

## 7. Object.entries() Transformation

Original Storage

```js
{
    1: { title: "Buy milk", done: false }
}
```

After transformation

```js
[
    {
        id: 1,
        title: "Buy milk",
        done: false
    }
]
```

Implementation

```js
const list = Object.entries(tasks).map(([id, task]) => ({
    id: Number(id),
    ...task
}));
```

This is one of the most common techniques used in REST APIs.

---

## 8. Route Parameters

Dynamic URLs allow clients to request specific resources.

Example

```
GET /tasks/3
```

The route parameter is accessed using

```js
req.params.id
```

---

## 9. Defensive Validation

The API validates every ID.

```js
const taskId = Number(req.params.id);

if (
    !Number.isInteger(taskId) ||
    !Object.prototype.hasOwnProperty.call(tasks, taskId)
) {
    return res.status(404).json({
        error: `Task ${req.params.id} not found`
    });
}
```

This prevents invalid requests such as

```
/tasks/abc
/tasks/4.5
/tasks/999
```

from crashing the application.

---

## 10. POST Request

Creates a new task.

Example

```json
{
    "title": "Learn Express"
}
```

The server automatically generates

- ID
- done = false

Response

```json
{
    "id": 4,
    "title": "Learn Express",
    "done": false
}
```

---

## 11. Input Sanitization and Regular Expression Cleanup

Whitespace is removed before storing data, and query strings are normalized with a lightweight regex cleanup step before comparison.

```js
const title = String(req.body.title ?? "").trim();

const isDone = String(req.query.done)
    .trim()
    .replace(/["']/g, "")
    .toLowerCase() === "true";
```

This practice improves robustness because it handles small input inconsistencies such as:

- extra spaces
- stray quotes around values
- case differences like `TRUE` or `True`

Example

Input

```
"     Learn Express      "
```

Stored value

```
Learn Express
```

---

## 12. Validation

The API rejects empty titles.

```js
if (!title) {
    return res.status(400).json({
        error: "Title is required and cannot be empty"
    });
}
```

This ensures clean and meaningful data.

---

## 13. PUT Request

Updates an existing task.

The API supports partial updates.

Example

```json
{
    "done": true
}
```

or

```json
{
    "title": "Learn Node.js"
}
```

or both.

---

## 14. Boolean Conversion

```js
tasks[taskId].done = Boolean(req.body.done);
```

Converts incoming values into true or false.

---

## 15. DELETE Request

Deletes a task.

```js
delete tasks[taskId];
```

Returns

```
204 No Content
```

which is the standard HTTP response for successful deletion.

---

## 16. Statistics Endpoint

```
GET /stats
```

Calculates

- Total Tasks
- Completed Tasks
- Open Tasks

Implementation

```js
const total = Object.keys(tasks).length;

const doneCount = Object.values(tasks)
    .filter(t => t.done === true)
    .length;
```

Example Response

```json
{
    "total": 5,
    "done": 2,
    "open": 3
}
```

---

# API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Server health |
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get task by ID |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/stats` | Task statistics |
| POST | `/reset` | Restore sample tasks |

---

# Development Process

1. Initialize project using `npm init -y`.
2. Install Express.
3. Configure ES Modules.
4. Create Express application.
5. Add JSON middleware.
6. Create in-memory storage.
7. Build health endpoint.
8. Build root endpoint.
9. Build GET endpoints.
10. Build POST endpoint.
11. Implement PUT endpoint.
12. Implement DELETE endpoint.
13. Add statistics endpoint.
14. Add reset endpoint.
15. Start server.
16. Test every endpoint using curl.

---

# curl Examples

## Health Check

```bash
curl http://localhost:3000/health
```

---

## API Information

```bash
curl http://localhost:3000/
```

---

## List All Tasks

```bash
curl http://localhost:3000/tasks
```

---

## Get Single Task

```bash
curl http://localhost:3000/tasks/1
```

---

## Create Task

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Learn Express"}'
```

---

## Update Task

```bash
curl -X PUT http://localhost:3000/tasks/1 \
-H "Content-Type: application/json" \
-d '{"title":"Learn Express.js","done":true}'
```

---

## Delete Task

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

---

## Server Statistics

```bash
curl http://localhost:3000/stats
```

---

## Reset Tasks

```bash
curl -X POST http://localhost:3000/reset
```

---

# curl Flag Reference

| Flag | Purpose |
|------|---------|
| `-X` | Specifies the HTTP method (GET, POST, PUT, DELETE) |
| `-H` | Adds HTTP request headers |
| `-d` | Sends JSON data in the request body |

---

# HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | Request successful |
| 201 | Resource created |
| 204 | Resource deleted successfully |
| 400 | Invalid input |
| 404 | Resource not found |

---

# Expected Learning Outcomes

After completing this assignment, students should be able to:

- Understand RESTful API architecture.
- Build APIs using Express.js.
- Use middleware effectively.
- Perform CRUD operations.
- Validate user input.
- Sanitize incoming data.
- Handle route parameters safely.
- Return appropriate HTTP status codes.
- Transform JavaScript objects into API-friendly arrays.
- Test REST APIs using curl.
- Design maintainable server-side applications.

---

# Conclusion

This assignment demonstrates the complete lifecycle of a RESTful API using Express.js. It covers routing, middleware, request validation, CRUD operations, error handling, JSON responses, and API testing. These concepts provide a strong foundation for building more advanced applications using databases such as MongoDB, PostgreSQL, or MySQL in future projects.