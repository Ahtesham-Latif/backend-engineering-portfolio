# Assignment 01 - Build Your First API Endpoint

## Objective

Build a simple Express server with one GET endpoint and one POST endpoint.

---

## Challenges

### Import Syntax

Incorrect

```js
import express from express;
```

Correct

```js
import express from "express";
```

The package name must be a string.

---

### ES Modules

Enable ES Modules in `package.json`.

```json
"type": "module"
```

This allows using the `import` syntax.

---

### JSON Middleware

```js
app.use(express.json());
```

Without this middleware, `req.body` is `undefined`.

---

### Testing Endpoints

The browser can only test GET requests.

For POST requests, use `curl` or an API client such as Postman.

---

## Process

- Create project folder.
- Initialize npm.
- Install Express.
- Configure ES Modules.
- Create Express app.
- Add JSON middleware.
- Create GET endpoint.
- Create POST endpoint.
- Run the server.
- Test both endpoints.

---

## curl Notes

`curl` is a command-line tool for making HTTP requests.

Useful for testing APIs without building a frontend.

### GET

```bash
curl http://localhost:3000/
```

### POST

```bash
curl -X POST http://localhost:3000/user \
-H "Content-Type: application/json" \
-d '{"name":"Ahtesham"}'
```

### Syntax

- `-X POST` → HTTP method.
- `-H` → Request header.
- `Content-Type: application/json` → Send JSON.
- `-d` → Request body (data).

---