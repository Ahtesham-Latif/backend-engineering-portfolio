# 🛠️ Backend Engineering Portfolio

A professional portfolio of backend engineering assignments and learning exercises, designed to showcase hands-on API development, system design thinking, and practical implementation workflows.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)](https://www.openapis.org/)
[![GitHub Codespaces](https://img.shields.io/badge/GitHub-Codespaces-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/features/codespaces)

---

## 🚀 Overview

This repository serves as a structured record of backend engineering practice, with a focus on building REST APIs, documenting services, and refining the fundamentals of clean server-side development.

The portfolio highlights a progression from foundational API concepts to more production-minded implementation patterns such as request validation, route organization, in-memory data handling, and OpenAPI/Swagger documentation.

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

---

## 🏗️ Repository Structure

```text
backend-engineering-portfolio/
│
├── README.md
├── flyrank/
│   ├── assignment-01-Build-your-first-CRUD-API/
│   │   ├── Documentation.md
│   │   ├── Learning.md
│   │   ├── index.js
│   │   ├── openapi.json
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── src/
│   │       ├── app.js
│   │       ├── errors.js
│   │       ├── controllers/
│   │       │   └── taskController.js
│   │       ├── middleware/
│   │       │   └── errorHandler.js
│   │       ├── routes/
│   │       │   ├── metaRoutes.js
│   │       │   └── taskRoutes.js
│   │       └── services/
│   │           └── taskServices.js
│   │
│   └── assignment-02-Connecting-to-the-database/
│       ├── Documentation.md
│       ├── Learning.md
│       ├── index.js
│       ├── openapi.json
│       ├── package.json
│       ├── package-lock.json
│       ├── tasks.db
│       └── src/
│           ├── app.js
│           ├── errors.js
│           ├── controllers/
│           │   └── taskController.js
│           ├── database/
│           │   └── db.js
│           ├── middleware/
│           │   └── errorHandler.js
│           ├── routes/
│           │   ├── metaRoutes.js
│           │   └── taskRoutes.js
│           └── services/
│               └── taskServices.js
```

---

## ✨ What This Portfolio Demonstrates

- Practical REST API design using Express.js
- Clean project organization across learning assignments
- Documentation-first development practices
- API exploration through Swagger/OpenAPI tooling
- Iterative backend development with focus on maintainability

---

## 🛠️ Development Environment

This portfolio is developed in a consistent cloud-based workflow using GitHub Codespaces, allowing for a reliable and repeatable environment across assignments.

Note: If you are using GitHub Codespaces, run `npm install` every time the container is started or rebuilt so the `node_modules` folder is available for the current assignment.

Typical workflow:

```bash
git clone https://github.com/Ahtesham-Latif/backend-engineering-portfolio.git
cd backend-engineering-portfolio
npm install
npm run dev
```

For each assignment folder, run `npm install` inside that project directory when using Codespaces so the dependency folder is restored locally.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the full text.

---

## 👨‍💻 Author

**Ahtesham Latif**

A backend-focused engineer building practical, production-minded API solutions through structured learning and hands-on implementation.