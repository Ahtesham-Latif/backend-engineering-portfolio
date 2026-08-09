# Assignment 02 - Connecting to the Database

This document is the formal technical reference for the assignment.

For the step-by-step learning notes and implementation journey, see `Learning.md` in the project folder.

## Objective

This assignment continues the CRUD API work by replacing the in-memory task collection with a real **SQLite database**. The API remains the same from a client perspective:

- `GET /tasks` returns every task.
- `GET /tasks/:id` returns one task.
- `POST /tasks` creates a new task.
- `PUT /tasks/:id` updates an existing task.
- `DELETE /tasks/:id` removes a task.

The main change is not in the API design, but in the **data layer**. Tasks are no longer stored inside JavaScript variables. They are persisted in a database file called `tasks.db` on disk.

This assignment introduces the core backend engineering idea that:

- **API layer** describes what the application does.
- **Database layer** describes where the application stores its data.

That separation is a key architectural concept because the API contract can remain stable even when the storage mechanism changes.

---

# Technologies Used

- Node.js
- Express.js
- JavaScript (ES Modules)
- SQLite
- `sqlite3` driver
- JSON
- Swagger UI + OpenAPI
- curl (API Testing)

---

# Project Structure

```text
assignment-02-Connecting-to-the-database/
│
├── Documentation.md
├── Learning.md
├── index.js
├── openapi.json
├── package.json
├── package-lock.json
├── tasks.db
└── src/
    ├── app.js
    ├── controllers/
    │   └── taskController.js
    ├── database/
    │   └── db.js
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

- `src/app.js` - application setup, middleware, Swagger setup, and route registration.
- `src/routes/*.js` - route definitions for HTTP endpoints.
- `src/controllers/*.js` - request handling and response formatting.
- `src/services/*.js` - SQL-backed service logic and validation.
- `src/database/db.js` - SQLite connection, database initialization, and seed logic.
- `src/middleware/errorHandler.js` - centralized Express error middleware.
- `src/errors.js` - shared custom error classes.

This separation keeps the API routes stable even though persistence moves from in-memory state to a relational database.

---

# Database Design

The database file is named:

```text
tasks.db
```

On startup, the application creates the `tasks` table if it does not already exist. The table is defined as:

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  done TEXT NOT NULL CHECK (done IN ('true', 'false')) DEFAULT 'false'
);
```

The three example tasks are inserted only when the table is empty:

```text
Buy milk
Read Express docs
Started stage 0
```

This means that restarting the server does not delete task data. The sample tasks appear once on first creation of the database file.

---

# Error Handling

Errors are managed in a dedicated middleware layer. Controllers forward exceptions to the central `errorHandler`, and custom error classes are defined in `src/errors.js`.

Examples:

- `BadRequestError` for invalid input
- `NotFoundError` for missing tasks
- `AppError` as the base error class

This keeps route logic simple and ensures that database operations return consistent JSON error responses.

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

The database file is created in the project directory automatically when the server starts for the first time.

---

# API Endpoints

## GET /

Returns basic information about the API.

Example response:

```json
{
  "name": "Task API",
  "version": "1.0",
  "endpoints": ["/tasks"]
}
```

---

## GET /health

Returns server health information.

Example response:

```json
{
  "status": "ok"
}
```

---

## GET /tasks

Returns a list of all tasks from the database.

Example response:

```json
{
  "list": [
    {
      "id": 1,
      "title": "Buy milk",
      "done": false
    },
    {
      "id": 2,
      "title": "Read Express docs",
      "done": true
    }
  ]
}
```

The service accepts optional query parameters:

- `?done=true`
- `?done=false`
- `?search=milk`

The list endpoint translates those filters into SQL clauses.

---

## GET /tasks/:id

Fetches one task by ID from the database.

If a task cannot be found, the API returns:

```json
{
  "error": "Task not found"
}
```

The HTTP status is `404`.

---

## POST /tasks

Creates a new task in the database.

Request body:

```json
{
  "title": "Write SQL notes"
}
```

Validation still applies:

- Missing or empty title returns `400`.
- Successful creation returns `201`.

---

## PUT /tasks/:id

Updates an existing task.

Request body can contain:

```json
{
  "title": "Updated title",
  "done": true
}
```

The API keeps the same update rules as before, but now those updates execute SQL statements against the database.

---

## DELETE /tasks/:id

Deletes an existing task.

On success, the API returns `204 No Content`.

If the ID is unknown, it returns `404` and a JSON error.

---

## GET /stats

Returns a simple summary for the task collection.

Example response:

```json
{
  "total": 3,
  "done": 1,
  "open": 2
}
```

The business logic can still expose this endpoint, but the statistics are now backed by database state rather than an in-memory object.

---

# Assignment Stages

The assignment is organized in six stages.

## Stage 0 — Create your database (~30 min)

Create a database file called `tasks.db` and create a table named `tasks` with these columns:

- `id` (integer primary key)
- `title` (text)
- `done` (boolean)

On application startup:

1. Create the table if it does not already exist.
2. Insert three example tasks only if the table is empty.

Checkpoint:

- Restart the application several times.
- Confirm example tasks appear only once.

Commit:

- Stage 0: create SQLite database

---

## Stage 1 — Read from the database (~45 min)

Replace the code that reads from the in-memory array.

- `GET /tasks` should execute a SQL query returning every task.
- `GET /tasks/:id` should return one task from the database.
- Unknown IDs continue to return `404` with `{ "error": "Task not found" }`.

Checkpoint:

- `GET /tasks` returns the database contents.

Commit:

- Stage 1: database read endpoints

---

## Stage 2 — Create new tasks (~45 min)

`POST /tasks` inserts a new row into the database instead of pushing into an array.

Same validation rules still apply:

- Missing title returns `400`
- Successful request returns `201`

Checkpoint:

- Create several tasks.
- Restart the server.
- Run `GET /tasks` again.

The tasks should still exist. This is the first time your data survives a restart.

Commit:

- Stage 2: insert into database

---

## Stage 3 — Update and delete (~45 min)

Replace update and delete logic with SQL statements:

- `PUT` updates a row.
- `DELETE` removes a row.

The API behaviour stays identical to the original CRUD contract.

Checkpoint:

- Create a task.
- Update it.
- Delete it.
- Confirm each operation using `GET /tasks`.

Commit:

- Stage 3: update and delete with SQL

---

## Stage 4 — Learn your first SQL (~45 min)

Open the database with a SQLite viewer, such as DB Browser for SQLite or a VS Code SQLite extension.

Run these SQL queries manually:

```sql
SELECT * FROM tasks;
SELECT * FROM tasks WHERE done = 1;
SELECT COUNT(*) FROM tasks;
UPDATE tasks SET done = 1;
DELETE FROM tasks WHERE done = 1;
```

Notice how the API immediately reflects those database changes.

Checkpoint:

- Modify the database manually.
- Verify the changes through the API.

Commit:

- Stage 4: explored SQLite

---

## Stage 5 — Publish your database project (~30 min)

Update the README file and document:

- Why SQLite was chosen
- Where the database file is stored
- How to start the project
- A screenshot of the database viewer
- One example SQL query you executed

Checkpoint:

- Someone cloning the repository can run the project and automatically create the database.

Commit:

- Stage 5: database documentation

---

# Optional Extras

Choose any that sound interesting.

Possible extensions:

- Search using SQL: `GET /tasks?search=milk` using SQL `LIKE`
- Filter completed tasks: `GET /tasks?done=true` using a SQL `WHERE` clause
- Sort alphabetically by title
- Return statistics using SQL `COUNT()` instead of counting in JavaScript
- Store timestamps such as `created_at` and `updated_at`

---

# Requirements

Done means every box is ticked.

- The API still exposes the same CRUD endpoints as the original task API.
- Tasks are stored in SQLite instead of memory.
- Data survives server restarts.
- The database is automatically created if missing.
- The tasks table is automatically created if missing.
- Three example tasks are inserted only on the first run.
- CRUD operations use SQL queries.
- Unknown IDs return `404`.
- Invalid requests return `400`.
- Public GitHub repository updated with README and database screenshot.

---

# What You Should Notice

By the end of this assignment, the API should feel almost identical to the original API design.

The URLs didn't change.
The request bodies didn't change.
The responses didn't change.
Only the implementation changed.

This separation between the API layer and the data layer is one of the foundations of backend engineering. Once this concept is understood, moving from SQLite to PostgreSQL, MySQL, SQL Server, or another database later becomes much easier.

---

# Glossary

- **CRUD**: Create, Read, Update, and Delete operations.
- **SQLite**: A lightweight relational database that stores data in a local file.
- **API**: The interface that clients use to communicate with the server.
- **Database**: A persistent system that stores application data.
- **SQL**: Structured Query Language used to interact with relational databases.
- **Endpoint**: A specific route exposed by the API, such as `GET /tasks`.
- **Persistence**: The ability for data to survive server restarts.
- **Relational Database**: A database that organizes data in tables with relationships.

