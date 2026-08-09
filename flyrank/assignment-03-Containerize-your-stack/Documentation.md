# Assignment 03 - Containerize Your Stack

This document serves as the formal technical reference for the containerization of the Task API and PostgreSQL database infrastructure.

For step-by-step implementation notes, container debugging, and learning logs, see `Learning.md`.

---

## Objective

This assignment expands the backend architecture by transitioning from a local SQLite setup to a containerized **PostgreSQL** database managed alongside the **Express.js API** using **Docker** and **Docker Compose**. 

The external API contract remains identical to previous assignments:
- `GET /tasks` returns all tasks (supports `?search=` and `?done=`).
- `GET /tasks/:id` returns a single task.
- `POST /tasks` creates a task.
- `PUT /tasks/:id` updates a task.
- `DELETE /tasks/:id` removes a task.
- `GET /stats` returns aggregate task statistics.

The key shift lies in infrastructure and environment isolation:
- **Application Layer:** Express API runs inside an isolated Node.js Docker container.
- **Database Layer:** Production-grade PostgreSQL database runs in its own container.
- **Networking:** Multi-container orchestration handled over an isolated Docker virtual bridge network.
- **Persistence:** Relational data survives container lifecycle restarts via Docker Named Volumes.

---

## Technologies Used

- **Runtime:** Node.js (v20 Alpine)
- **Framework:** Express.js (ES Modules)
- **Database:** PostgreSQL (v15 Alpine)
- **Database Driver:** `pg` (node-postgres with Connection Pooling)
- **Containerization:** Docker & Docker Compose
- **Development Environment:** GitHub Codespaces (Docker-in-Docker enabled)
- **Documentation:** Swagger UI + OpenAPI 3.0

---

## Project Structure

```text
assignment-03-containerize-your-stack/
├── .dockerignore
├── .env
├── .env.example
├── Dockerfile
├── docker-compose.yml
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

## Containerized Layered Architecture

The application is structured into decoupled infrastructure layers:

1. **Orchestration Layer (`docker-compose.yml`):** Defines multi-container services (`express_app` and `postgres_db`), internal DNS network resolution, volume mounts, and healthcheck dependencies.
2. **Build Specification (`Dockerfile`):** Multi-stage production container build for the Node.js application utilizing lightweight Linux distribution (`node:20-alpine`) and non-root execution (`USER node`).
3. **Database Connection Pooling (`src/database/db.js`):** Utilizes `pg.Pool` to maintain persistent, non-blocking asynchronous connections to the PostgreSQL container.
4. **Service & Controller Layers (`src/services/`, `src/controllers/`):** Asynchronous SQL query execution (`async/await`) operating against PostgreSQL standard syntax.

---

## Database Design & Seeding

PostgreSQL runs inside the `postgres_db` container instance.

### Schema Definition

Upon service initialization, the connection pool automatically bootstraps the database schema:

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);

```

### Seed Logic

Default seed records are inserted automatically if the table count is zero:

* `Buy milk` (`done: false`)
* `Read Express docs` (`done: true`)
* `Complete Stage 4` (`done: false`)

Data persists across container rebuilds and shutdowns via the named volume `pgdata` mapped to `/var/lib/postgresql/data`.

---

## Environment Configuration

Secrets and instance variables are managed via root-level `.env` configuration.

```text
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=your_user_name
DB_PASSWORD=your_password
DB_NAME=task_db

```

*Note: Inside `docker-compose.yml`, `DB_HOST` is explicitly bound to `postgres` to utilize Docker's internal DNS routing.*

---

## How to Run the Application

### Prerequisites

* Docker Engine (v20.10+)
* Docker Compose (v2.0+)

### 1. Build and Launch Containers

Start the full stack (PostgreSQL database + Express app) in detached background mode:

```bash
docker compose up -d --build

```

### 2. Verify Container Health and Logs

Stream combined container logs in real-time to monitor database connection and server boot state:

```bash
docker compose logs -f

```

### 3. Accessing Endpoints

* **REST API:** `http://localhost:3000`
* **Swagger Documentation:** `http://localhost:3000/docs`

### 4. Direct Database Interrogation

To run interactive SQL queries against the running PostgreSQL container:

```bash
docker exec -it postgres_db psql -U user_name -d task_db -c "SELECT * FROM tasks;"

```

### 5. Tear Down Stack

Stop and remove running containers:

```bash
docker compose down

```

Stop containers and purge persistent database volumes (Clean State Reset):

```bash
docker compose down -v

```

---

## Assignment Stages

### Stage 0 — Devcontainer & Docker-in-Docker Environment

* Configured `.devcontainer/devcontainer.json` with `ghcr.io/devcontainers/features/docker-in-docker:1`.
* Resolved recovery mode container issues by pointing to a valid base distribution (`javascript-node:20-bookworm`).

### Stage 1 — Dockerfile Blueprint

* Created optimized single-container build instructions utilizing `node:20-alpine`.
* Integrated `.dockerignore` to exclude local `node_modules` and sensitive `.env` files from build contexts.

### Stage 2 — PostgreSQL Migration

* Replaced `sqlite3` driver with `pg` (node-postgres).
* Refactored synchronous SQLite queries to `async/await` SQL queries using `pg.Pool`.

### Stage 3 — Multi-Container Orchestration (`docker-compose.yml`)

* Orchestrated `postgres:15-alpine` and Express API containers under unified internal bridge network.
* Configured `healthcheck` on `postgres` container combined with `depends_on: service_healthy` on `app` container to prevent race conditions during boot up.

### Stage 4 — Persistence & End-to-End Verification

* Configured Docker named volume `pgdata` for host-level persistence.
* Tested container state reboots using `docker compose restart` to confirm state retention.
