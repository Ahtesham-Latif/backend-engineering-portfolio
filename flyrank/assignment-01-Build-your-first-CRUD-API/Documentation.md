# Assignment 01 - Build your first CRUD API

## Objective

Build a simple Express server that performs full CRUD operations (Create, Read, Update, Delete) on an in-memory user store using GET, POST, PUT, and DELETE endpoints.

---

## Challenges

### Import Syntax

Incorrect:
```js
import express from express;
```

Correct:
```js
import express from "express";
```
The package name must be a string.

---

### ES Modules

Enable ES Modules in `package.json` to allow using the `import` syntax instead of the older `require()`.

```json
"type": "module"
```

---

### JSON Middleware

```js
app.use(express.json());
```
Without this middleware, `req.body` is `undefined` when reading payload data on POST and PUT requests.

---

### Variable Shadowing

Incorrect inside route handlers:
```js
let id = req.params.id; // Shadows the global 'let id = 1;'
```

Correct:
```js
const userid = req.params.id; // Safe and distinct
```

---

### Testing Endpoints

The web browser can only natively test GET requests. 

To test **POST**, **PUT**, and **DELETE** requests, use `curl` in your terminal or an API client like Postman, Bruno, or VS Code's Thunder Client.

---

## Process

- Create project folder.
- Initialize npm using `npm init -y`.
- Install Express using `npm install express`.
- Configure ES Modules in `package.json`.
- Create your `index.js` Express app.
- Add the `express.json()` middleware.
- Create the **GET** (`/` and `/users`) endpoints.
- Create the **POST** (`/user`) endpoint to dynamically store users using sequential IDs.
- Create the **PUT** (`/user/:id`) endpoint to update a user by their ID.
- Create the **DELETE** (`/user/:id`) endpoint to remove a user by their ID.
- Start the server using `node index.js`.
- Test all your endpoints.

---

## curl Notes

`curl` is a command-line tool for making HTTP requests, perfect for testing your API endpoints directly from your terminal.

### 1. GET Root
```bash
curl http://localhost:3000/
```

### 2. GET All Users
```bash
curl http://localhost:3000/users
```

### 3. POST (Create User)
```bash
curl -X POST http://localhost:3000/user -H "Content-Type: application/json" -d '{"name":"Ahtesham"}'
```

### 4. PUT (Update User)
*Replace `1` with the actual target ID returned from your POST request.*
```bash
curl -X PUT http://localhost:3000/user/1 -H "Content-Type: application/json" -d '{"name":"Ahtesham Latif"}'
```

### 5. DELETE (Remove User)
*Replace `1` with the actual target ID you want to delete.*
```bash
curl -X DELETE http://localhost:3000/user/1
```

### Syntax Breakdown

- `-X` → Specifies the HTTP request method (GET, POST, PUT, DELETE).
- `-H` → Sets custom request headers (e.g., specifying that we are sending JSON data).
- `-d` → Contains the request body/payload data.