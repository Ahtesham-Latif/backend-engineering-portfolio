# Assignment 04 - Auth Login & Protect

This document outlines the authentication flow and protection setup implemented for the Express API using Supabase Auth.

For the implementation notes and learning reflections, see `Learning.md`.

---

## Objective

This assignment introduces secure authentication and route protection into the backend project. The API is connected to Supabase so that user sessions can be validated, and future routes can be gated behind login requirements.

The main goals are:

- configure the Supabase client in a secure environment-based setup
- validate the app connection to Supabase at startup
- establish a clean app bootstrap pattern for protected backend service development
- prepare the foundation for route-level auth enforcement

---

## Technologies Used

- Node.js v22
- Express.js
- Supabase JavaScript SDK
- dotenv
- GitHub Codespaces

---

## Project Structure

```text
assignment-04-Auth-Login_protect/
├── .env
├── .env.example
├── Documentation.md
├── Learning.md
├── index.js
├── package.json
└── src/
    └── config/
        └── supabase.js
```

---

## Environment Configuration

The project uses environment variables for the Supabase connection.

Example values:

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

The app reads the values from `.env` at runtime and creates a Supabase client using the project URL and public key.

---

## Supabase Setup

The Supabase client is configured inside the file:

- `src/config/supabase.js`

It creates the client with:

```js
export const supabase = createClient(supabaseUrl, supabaseKey);
```

The code validates that both required values exist before the application continues running.

---

## Server Startup Flow

The application starts in `index.js` and creates the Express app from `CreateApp()`.

It performs a basic handshake with Supabase by calling:

```js
const { error } = await supabase.auth.getSession();
```

This verifies that the client can talk to Supabase and that the environment configuration is valid.

---

## Authentication Readiness

This assignment establishes the base for future protected API endpoints. The project is ready to evolve into flows such as:

- login via Supabase Auth
- session validation middleware
- route protection for private endpoints
- role-based or user-based authorization

---

## How to Run

1. Copy the sample env file:

```bash
cp .env.example .env
```

2. Add your actual Supabase values.

3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm run dev
```

5. Open the API in the browser or use a tool like Postman/Insomnia.

---

## Notes

This assignment focuses on the authentication foundation rather than a full production auth system. It prepares the project for protected endpoints and secure user access patterns in later backend tasks.
