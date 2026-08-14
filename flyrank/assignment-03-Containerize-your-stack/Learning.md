# Learning Notes: Containerizing the Task API & PostgreSQL Stack

This file is my personal learning log for Assignment 03. It breaks down how I containerized the stack, the challenges I hit, and what I learned along the way.

For official setup instructions and API specifications, see `Documentation.md`.

---

## Personal Introduction

In Assignment 02, I moved from saving tasks in temporary memory to writing them into a local SQLite file (`tasks.db`). That solved basic persistence, but in real-world production, apps usually run on separate database servers like **PostgreSQL** rather than single flat files.

For Assignment 03, I took on a bigger backend challenge: **containerization**.

Instead of running Node and Postgres directly on my local computer, I put them inside isolated **Docker containers** and linked them together over a private virtual network using **Docker Compose**.

The biggest takeaway: **"it works on my machine" is no longer an issue.** The application and database now run in the exact same environment everywhere.

---

## What Changed from Assignment 02

* **Assignment 02:** Node.js ran directly on my computer, reading and writing to a local `tasks.db` file.
* **Assignment 03:** Express and PostgreSQL run in separate containers (`express_app` and `postgres_db`). They talk to each other over Docker's internal network using service names (`DB_HOST=postgres`), and data is saved in a Docker volume (`pgdata`).

---

## Switching to PostgreSQL

I swapped out the old `sqlite3` driver for the standard Node PostgreSQL library (`pg`).

Switching to Postgres gives the API a real database server that handles multiple requests smoothly and uses connection pooling (`pg.Pool`) to keep database queries fast.

---

## What I Learned Building the Dockerfile

* **Lightweight Image:** Using `node:20-alpine` keeps the container size small (~170MB) so it builds and runs faster.
* **Faster Rebuilds:** Copying `package*.json` and running `npm ci` before copying my code lets Docker cache installed packages. Changing a line in `index.js` later won't force a full reinstall.
* **Security:** Running under `USER node` keeps the app off the `root` account inside the container.

---

## Key Concepts from Docker Compose

* **Internal Hostnames:** The Express app connects to host `postgres` instead of `localhost` because Docker automatically turns service names into network addresses.
* **Healthchecks:** Adding a healthcheck (`pg_isready`) stops Express from trying to connect before Postgres is actually ready to accept traffic.
* **Persistent Data:** Mapping the `pgdata` volume ensures my SQL tables and tasks don't get erased when containers are stopped or rebuilt.

---

## Troubleshooting & Key Takeaways

1. **Port Conflicts:** I hit a port `5432` error when an old Postgres container was already running. Using `docker ps` and `docker stop` freed up the port.
2. **Resetting Data:** Changing `.env` credentials didn't update Postgres because the volume remembered the old settings. Running `docker compose down -v` cleared the old volume for a fresh start.
3. **Case Sensitivity:** Linux environments are strict about file names—renaming `DOCKERFILE` to `Dockerfile` fixed my build errors immediately.
4. **Internal vs Host DB Port:** I hit `ECONNREFUSED` when the app tried `postgres:5433`. Inside Docker, containers must talk to Postgres on `5432` (the container port). `5433` is only for host-to-container access (`localhost:5433`).
5. **Untracked `.env` in Codespaces:** Because `.env` is ignored by Git, a fresh Codespace may not include it. The reliable fix is keeping a tracked `.env.example` and running `cp -n .env.example .env` before `docker compose up --build`.
6. **Mock vs Production Env Values:** The values in `.env`/`.env.example` for this assignment are mock local-dev defaults. In production-style setups, I should create a runtime `.env` file from GitHub environment/Codespaces secrets instead of committing real credentials.

---

## Repeatable Codespaces Startup Flow

Every time I open Codespaces for Assignment 03, I run this sequence:

1. `docker --version`
2. `cd /workspaces/backend-engineering-portfolio/flyrank/assignment-03-Containerize-your-stack`
3. `cp -n .env.example .env`
4. `docker compose up --build`

This avoids two common mistakes: missing `.env` files and wrong database port usage.

Note: For this portfolio assignment, env values are intentionally mock. For real deployments, the env file should be generated at runtime and populated from GitHub environment/Codespaces secrets.

---

## Commands

1. `docker --version` - confirms Docker is available.
2. `docker compose up --build` - builds images and starts app plus postgres.
3. `docker compose up -d --build` - builds and starts services in detached mode.
4. `docker compose ps` - shows service status and health state.
5. `docker compose logs -f app` - streams app logs for live debugging.
6. `docker compose exec -T postgres psql -U postgres -d task_db -c "SELECT id, title, done FROM tasks ORDER BY id;"` - checks persisted task rows.
7. `docker volume ls` - lists Docker volumes to verify persistence storage exists.
8. `docker compose down -v` - stops services and removes volumes for a full reset.

---

## Docker Hub Publish Story

I pushed this image to Docker Hub because I wanted my project to be usable beyond my own laptop and Codespace.

By publishing the container image, I turned my local build into a shareable artifact. Anyone can now pull the same image from my profile and run the API in a consistent environment without rebuilding everything from source.

This made the project feel more production-minded: instead of saying "it works on my machine," I now have a portable image that other developers can run, test, and reuse.

### Commands I Used

```bash
docker login
docker compose build app
docker tag assignment-03-containerize-your-stack-app:latest ahteshamlatif/task-api:latest
docker push ahteshamlatif/task-api:latest
```

---

## Final Thoughts

This assignment helped me move from running local scripts to building a proper multi-container backend stack. Now, running `docker compose up -d` brings up the whole app and database in seconds on any machine.