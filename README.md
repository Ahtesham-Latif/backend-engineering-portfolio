# 🛠️ Backend Engineering Portfolio

A professional portfolio of backend engineering assignments and learning exercises, designed to showcase hands-on API development, system design thinking, and practical implementation workflows.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)](https://www.openapis.org/)
[![Swagger UI](https://img.shields.io/badge/Swagger-UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=white)](https://swagger.io/tools/swagger-ui/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Codespaces](https://img.shields.io/badge/GitHub-Codespaces-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/features/codespaces)

---

## 🚀 Overview

This repository is a backend engineering portfolio that documents the work completed so far across multiple API and data-access assignments. It captures the practical learning and implementation milestones that have already been delivered, rather than describing an in-progress or future-facing roadmap.

So far, the portfolio covers a complete Express-based task management API, a SQLite-backed database implementation, a Dockerized PostgreSQL deployment stack, and an authentication-focused Supabase integration. The work includes REST endpoints, service/controller layering, input handling, OpenAPI/Swagger documentation, database initialization, SQL CRUD operations, Dockerfile and Docker Compose setup, and environment-driven configuration for production-style workflows and protected API access.

---

## 📚 Current Work

### Assignment 01 — Build Your First CRUD API

The first major project in this portfolio demonstrates a complete Express-based task management API with:

- CRUD operations for task resources
- In-memory task storage
- Health and stats endpoints
- Input validation and sanitization
- Swagger UI documentation integration
- Layered route/controller/service architecture
- Centralized middleware and error handling
- Query-based filtering on task listing

Explore the project here:

- [flyrank/assignment-01-Build-your-first-CRUD-API](flyrank/assignment-01-Build-your-first-CRUD-API)
- [Documentation](flyrank/assignment-01-Build-your-first-CRUD-API/Documentation.md)

### Assignment 02 — Connecting to the Database

The second major project extends the same task API with a persistent SQLite-backed storage layer:

- SQLite database file creation through `tasks.db`
- Automatic `tasks` table creation when the app starts
- SQL-based CRUD operations that replace the in-memory store
- Seed-task insertion only when the database is empty
- Database initialisation through a dedicated data-access layer
- Service/controller flow that uses asynchronous database calls

For database inspection, you can open the SQLite file with DB Browser for SQLite or with the VS Code SQLite Viewer extension. If you use the VS Code extension, it is read-only, so you can inspect the database but you cannot edit the DB content from that extension.

Explore the project here:

- [flyrank/assignment-02-Connecting-to-the-database](flyrank/assignment-02-Connecting-to-the-database)
- [Documentation](flyrank/assignment-02-Connecting-to-the-database/Documentation.md)

### Assignment 03 — Containerize Your Stack

The third major project moves the API from a single-process local runtime to a containerized service-oriented architecture:

- Express API served from a Node.js-based Docker container
- PostgreSQL database served from a dedicated container
- Docker Compose orchestration for the application and database services
- `pg.Pool`-driven asynchronous database access through the PostgreSQL driver
- Health checks, shared Docker networking, and a named `pgdata` volume for persistence
- Environment-driven configuration using `.env` files for host, user, password, and database settings
- Seed and schema initialization performed inside the database bootstrap flow

Explore the project here:

- [flyrank/assignment-03-Containerize-your-stack](flyrank/assignment-03-Containerize-your-stack)
- [Documentation](flyrank/assignment-03-Containerize-your-stack/Documentation.md)

### Assignment 04 — Auth Login & Protect

The fourth major project introduces authentication and access protection using Supabase Auth and Express.js:

- Supabase client configuration for environment-based auth setup
- Session handshake validation using `supabase.auth.getSession()`
- Express app bootstrap with secure runtime configuration
- Separation of app setup and environment configuration concerns
- Foundation for protected route logic and authenticated user flows

Explore the project here:

- [flyrank/assignment-04-Auth-Login_protect](flyrank/assignment-04-Auth-Login_protect)
- [Documentation](flyrank/assignment-04-Auth-Login_protect/Documentation.md)

---

## 🏗️ Repository Structure

```text
backend-engineering-portfolio/
├── README.md
└── flyrank/
    ├── assignment-01-Build-your-first-CRUD-API/
    │   ├── Documentation.md
    │   ├── Learning.md
    │   ├── index.js
    │   ├── openapi.json
    │   ├── package.json
    │   └── src/
    │       ├── app.js
    │       ├── errors.js
    │       ├── controllers/
    │       ├── middleware/
    │       ├── routes/
    │       └── services/
    ├── assignment-02-Connecting-to-the-database/
    │   ├── Documentation.md
    │   ├── Learning.md
    │   ├── package.json
    │   └── src/
    │       ├── database/
    │       └── ...
    ├── assignment-03-Containerize-your-stack/
    │   ├── Documentation.md
    │   ├── Learning.md
    │   ├── Dockerfile
    │   ├── docker-compose.yml
    │   ├── package.json
    │   └── src/
    │       └── database/
    └── assignment-04-Auth-Login_protect/
        ├── Documentation.md
        ├── Learning.md
        ├── .env.example
        ├── index.js
        ├── package.json
        └── src/
            └── config/
```

The repository is organized as a portfolio of independent assignment folders. Assignment 02 extends the API with database access files and Assignment 03 adds containerization assets such as Docker configuration and Compose orchestration.

---

## ✨ What This Portfolio Demonstrates

- Practical REST API design using Express.js
- Clean project organization across learning assignments
- Documentation-first development practices
- API exploration through Swagger/OpenAPI tooling
- Containerization patterns using Docker and Docker Compose
- PostgreSQL integration with a protected database layer and connection pooling
- Authentication flows using Supabase and session-based validation
- Iterative backend development with focus on maintainability

---

## 🛠️ Development Environment

This portfolio is developed in a consistent cloud-based workflow using GitHub Codespaces, allowing for a reliable and repeatable environment across assignments.

Important: The repository root does not define a root-level Node.js project or `package.json`. Each assignment inside the `flyrank/` directory is a separate project with its own `package.json`, so dependency installation and development commands must be executed inside the relevant assignment directory, not from the repository root.

Typical workflow for Assignment 01:

```bash
git clone https://github.com/Ahtesham-Latif/backend-engineering-portfolio.git
cd backend-engineering-portfolio
cd flyrank/assignment-01-Build-your-first-CRUD-API
npm install
npm run dev
```

For Assignment 02:

```bash
cd ../assignment-02-Connecting-to-the-database
npm install
npm run dev
```

For Assignment 03:

```bash
cd ../assignment-03-Containerize-your-stack
docker compose up -d --build
docker compose logs -f app
```

When using GitHub Codespaces, run `npm install` within the specific assignment folder you want to work on so the `node_modules` directory is restored there.

Note: For Assignment 03, you do not need to run npm install or npm run dev locally.Docker automatically handles dependency installation and application execution inside the container environment.

For Assignment 04:

```bash
cd ../assignment-04-Auth-Login_protect
npm install
npm run dev
```

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the full text.

---

## 👨‍💻 Author

**Ahtesham Latif**

A backend-focused engineer building practical, production-minded API solutions through structured learning and hands-on implementation.