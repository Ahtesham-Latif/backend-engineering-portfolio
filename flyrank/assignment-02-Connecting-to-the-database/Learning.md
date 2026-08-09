# Learning Notes: SQLite Persistence for the Task API

This file is the personal learning walkthrough for the project.

It explains the build process and reasoning in plain language.

For the formal assignment reference, use `Documentation.md` inside the project folder.

## Personal introduction

In Assignment 01, the API managed tasks from an in-memory JavaScript object. That was useful for learning request routing, validation, controllers, and services. However, the data disappeared every time the server restarted because the tasks were not stored anywhere persistent.

For Assignment 02, the project had to solve a bigger backend problem: persistence. A REST API can expose the same interface, but if its data is stored only inside an application variable, it is lost when the process exits. That is why the project needed a persistent database.

The main design decision in this assignment was to keep the API contract stable and move the data storage below the service layer. The clients still send the same requests to the same routes. The difference is that the service layer no longer reads and writes JavaScript variables. Instead, it talks to a SQLite database file.

This is an important backend concept: the API describes the contract, while the database describes where the application stores the data.

---

## What changed from Assignment 01

In Assignment 01, the task list lived in memory:

```js
let tasks = { ... };
```

That implementation worked for learning, but it had a serious limitation. Restarting the server reset the state.

In this assignment, the requirement changed. We needed a persistent database so the data would survive server restarts. The database had to be created automatically when the project starts and seeded only when the table is empty.

That is why we added a new persistence layer below the existing service layer.

---

## Choosing SQLite

A file-based database was the right fit for this project because the assignment is small and the learning goal is to understand the architecture of a database-backed API.

I used SQLite because:

- It is lightweight.
- It stores data in a single file on disk.
- It does not require a separate database server.
- It is easy to run locally in development.

The database file is named:

```text
tasks.db
```

The SQLite driver installed for this project is the Node.js `sqlite3` library.

```bash
npm install sqlite3
```

This gives the Express API access to a relational database engine without introducing infrastructure complexity.

---

## Project setup

The project keeps the same API entry point and Express structure as before, but now there is a database initialization step before the server starts listening for traffic.

In `index.js`, the app is created and then the database initializer is called:

```js
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
```

The important part is that the database layer is initialized before the HTTP server begins accepting requests.

---

## New database layer

I added a new layer below the service layer:

```text
Controller -> Service -> Database Layer
```

The new database layer is implemented in `src/database/db.js`.

That file is responsible for:

- opening the SQLite connection
- creating the database file on disk if it does not exist
- creating the `tasks` table if it does not exist
- inserting the initial sample tasks only when the table is empty
- exposing the database connection object for the service layer

The table is configured with the same logical structure required by the assignment:

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  done TEXT NOT NULL CHECK (done IN ('true', 'false')) DEFAULT 'false'
);
```

The `done` field is stored as text in the database, because that matches the existing API's boolean-style response representation and keeps the project close to the original behaviour.

---

## Database seeding logic

When the application starts, the database initializer is executed.

Inside `initializeDatabase()`, the application calls `CREATE TABLE IF NOT EXISTS` before making any API requests. If there are no rows in the table, it inserts the three example tasks.

This ensures a clean first-run experience:

```text
Buy milk
Read Express docs
Started stage 0
```

Those rows are inserted only once, because the table is checked for existing records before the seed operation runs.

This solves the persistence problem in a simple and predictable way. A restart of the server does not remove the data because the SQLite file stores it on disk.

---

## Service layer changes

The service layer `src/services/taskServices.js` no longer relies on an in-memory variable such as `tasks` and `nextTaskId`.

Instead, it sends SQL statements to the database layer and receives rows back from SQLite.

For example:

```js
listTasks({ done, search } = {})
```

builds a query using SQL clauses such as:

```sql
SELECT id, title, done FROM tasks
```

It may also append filters such as:

```sql
WHERE done = ?
```

or:

```sql
WHERE title LIKE ?
```

The service layer is therefore the place where the API's business rules are applied before SQL is executed.

The service functions are asynchronous because they interact with database operations that finish later. That is why the controllers are written with `async` and `await` to wait for database results before sending a response.

---

## Controller update

The API controllers have also become asynchronous.

In `src/controllers/taskController.js`, the request handlers call service functions through `await` instead of working with synchronous in-memory objects.

A good example is `listTasks()`:

```js
export async function listTasks(req, res, next) {
  try {
    const list = await taskService.listTasks({ done: req.query.done, search: req.query.search });
    res.status(200).json({ list });
  } catch (error) {
    next(error);
  }
}
```

This pattern is important because SQLite operations do not produce immediate results. They complete later, so the controller and the service must use asynchronous execution.

The `async` / `await` structure matches the database-driven architecture and keeps the code easier to read.

---

## Request flow after the database layer

The new request flow looks like this:

```text
client request -> route -> controller -> service -> sql query -> SQLite database -> response
```

That is different from the old in-memory flow where the API was reading from a JavaScript object in memory.

The route and controller layers are still responsible for HTTP concerns, but the service layer delegates data read and write operations to SQLite.

---

## CRUD flow

Each CRUD operation now maps to a SQL statement.

### Read

```sql
SELECT id, title, done FROM tasks;
SELECT id, title, done FROM tasks WHERE id = ?;
```

### Create

```sql
INSERT INTO tasks (title, done) VALUES (?, ?);
```

### Update

```sql
UPDATE tasks SET title = ?, done = ? WHERE id = ?;
```

### Delete

```sql
DELETE FROM tasks WHERE id = ?;
```

The request validation is still done in the service layer by checking the incoming title and done values. The response shape remains the same as a normal REST API response.

---

## Benefits of the new architecture

This project introduces a stronger architecture for backend applications:

- The route layer stays stable.
- The controller layer remains focused on HTTP concerns.
- The service layer keeps the business rules and validation logic.
- The database layer owns connection management and SQL execution details.

This is the foundation for moving from one database to another in the future. If the project later moves from SQLite to PostgreSQL or MySQL, the routes and controllers can stay almost unchanged because the API contract remains the same.

---

## What this project taught me

This assignment taught me that persistent storage is a backend design decision rather than an API design decision.

The clients do not need to know whether the server reads from memory or from SQLite. They only need the same endpoints and payloads.

The database layer helped the API solve a real-world backend requirement: keeping data alive across restarts.

That is why I now see a clean separation between interface and implementation:

- API endpoints describe the experience.
- SQL queries describe how the data is read and written.
- The database file explains where the system persists the information.

This was a very important learning step because it made the architecture much closer to a real-world application design.
