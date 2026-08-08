# Learning Notes: Express CRUD API

This file is the personal learning walkthrough for the project.

It explains the build process and reasoning in plain language.

For the formal assignment reference, use `Documentation.md` inside the project folder.

## Personal introduction

Hi, my name is Ahtesham, and I'd like to walk you through one of my backend projects.

This is a RESTful CRUD API built with Express.js using a layered architecture. I chose this architecture because it separates responsibilities into different layers, making the application easier to maintain, test, debug, and scale.

The application starts from `index.js`, which is the entry point. It imports the Express application from `app.js`, configures the port, and starts the server.

The main application configuration is inside `app.js`. Here I create the Express application, register middleware like `express.json()`, mount all the route modules, configure Swagger UI, and register the global error-handling middleware.

For API documentation, I use `openapi.json`, which contains the OpenAPI specification. Swagger UI reads this file and automatically generates interactive API documentation, allowing developers to explore and test every endpoint directly from the browser.

The application follows a layered architecture:

- **Routes** define the API endpoints and map incoming HTTP requests to the appropriate controller.
- **Controllers** receive the request, extract route parameters, query parameters, and the request body, perform basic request-level validation, and delegate the request to the service layer.
- **Services** contain the application's business logic, such as creating, reading, updating, deleting, searching, and filtering task data stored in the in-memory database.
- **Middleware** provides centralized error handling, ensuring that all errors return consistent HTTP responses.

The request flow is simple: a client sends a request to a route, the route forwards it to the controller, the controller calls the service layer, the service executes the business logic and returns the result, and finally the controller sends the HTTP response back to the client.

Currently, the project uses an in-memory data store. If I wanted to make it production-ready, I could add a model and database layer using MongoDB, PostgreSQL, or SQLite without making major changes to the routes or controllers because the responsibilities are already well separated.

Building this project helped me understand how production-grade backend applications are structured and why separation of concerns is important for writing clean, maintainable, and scalable software.
## What this project is

This repo is a small Node.js + Express API for managing tasks.

It teaches the basics of backend server setup, REST routes, JSON handling, validation, Swagger documentation, and portfolio presentation.

---

## Project setup

- `npm init -y` creates `package.json`
- `npm install express swagger-ui-express` adds the required packages
- `type: "module"` enables ES module imports

---

## App structure

In `src/app.js` the app:

- creates the Express instance
- registers `express.json()`
- serves Swagger UI at `/docs`
- mounts `metaRoutes` and `taskRoutes`
- registers centralized error handling

---

## In-memory storage

Tasks live in a simple in-memory object with auto-incrementing IDs. This avoids database setup and keeps the focus on API design.

---

## Reset behavior

A reset function restores the initial sample tasks so the app can return to a known state for testing.

---

## Swagger documentation

`openapi.json` provides the API specification and is served by Swagger UI at `/docs`.

---

## API routes

The project supports:

- `GET /tasks` with optional `done` and `search` filters
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

Routes are defined in `src/routes/taskRoutes.js` and controllers delegate business logic to services.

---

## Request flow

```text
client request -> route -> controller -> service -> response
```

Controllers validate requests and forward logic to services, while centralized middleware handles errors consistently.

---

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/docs
```

---

## Project polish

The root `README.md` was improved for a portfolio-style presentation.

---

## Final takeaway

This project shows the backend learning path from setup to Express routing, CRUD logic, Swagger docs, and polished project presentation.
