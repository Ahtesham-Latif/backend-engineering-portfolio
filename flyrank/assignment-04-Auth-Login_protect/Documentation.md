# Assignment 04 - Auth Login & Protect

## The Secret Recipe Vault: Restaurant Staff Portal

This assignment simulates a real restaurant security problem. The backend must serve both public information and protected internal staff data. The public side is open to everyone, but the internal kitchen staff area contains secret recipes, employee details, and sensitive operational information that must be protected behind authentication.

The restaurant story is simple:

- Public storefront data can be viewed by anyone
- Staff-only data must be locked behind a secure digital badge
- Login creates the badge, and protected routes require that badge to access sensitive information

For learning notes and reflection, see `Learning.md`.

---

## Real-World Problem

Imagine a famous restaurant chain called Luigi's Secret Kitchen.

The same backend serves two very different types of visitors:

- The dining public: needs the restaurant address and hours
- Internal staff: needs access to recipes, employee roles, and internal account information

If the API is not protected, a person could guess or manipulate URLs and access private staff information. That is why secure authentication is essential.

---

## Endpoint to Restaurant Mapping

| Endpoint | Method | Restaurant Analogy | Return Value | Access |
| --- | --- | --- | --- | --- |
| `/public/info` | GET | Storefront sign | address, hours, welcome notice | Public |
| `/auth/signup` | POST | HR onboarding desk | create new staff member | Public |
| `/auth/login` | POST | Clock-in station | returns access token after validation | Public |
| `/protected/profile` | GET | Staff locker room | user profile and identity data | Protected |
| `/protected/dashboard` | GET | Secret recipe vault | confidential recipe content | Protected |
| `/auth/logout` | POST | Clock-out station | ends session cleanly | Protected |

This reflects the security model behind the assignment: public access for general information and token-based protection for staff areas.

---

## Objective

This assignment focuses on:

- connecting the Express app to a Supabase Auth backend
- validating environment variables before the server starts
- creating signup and login flows for restaurant staff accounts
- preparing the application for protected routes that require a valid unsigned/validated token
- demonstrating a secure authentication model using a real backend service

---

## Technologies Used

- Node.js
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
    ├── app.js
    ├── config/
    │   └── supabase.js
    ├── controllers/
    │   └── auth.controller.js
    ├── routes/
    │   └── auth.routes.js
    └── services/
        └── auth.service.js
```

---

## Environment Configuration

The application reads Supabase connection values from `.env`:

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

The code in `src/config/supabase.js` reads:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- and also supports `SUPABASE_KEY` as a fallback

If either required value is missing, the application shuts down early instead of starting with invalid auth configuration.

---

## Supabase Client Setup

The Supabase client is initialized like this:

```js
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY in .env");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

This is the backend’s secure identity gateway. Without a valid Supabase project configuration, the app cannot begin its auth flow.

---

## Startup Flow

The app is created in `src/app.js` and mounted at `/auth`:

```js
import express from 'express';
import authRouter from './routes/auth.routes.js';

export function CreateApp() {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);
  return app;
}
```

Then `index.js` starts the server and does a basic health check with Supabase:

```js
app.listen(PORT, async () => {
  const { error } = await supabase.auth.getSession();

  if (error) {
    console.error('Supabase handshake failed:', error.message);
  } else {
    console.log(`Server running and connected to Supabase on http://localhost:${PORT}`);
  }
});
```

This confirms the backend is connected to the correct authentication service before handling staff requests.

---

## Authentication Flow in the Restaurant Story

### 1. Signup / HR onboarding

Endpoint: `POST /auth/signup`

Example request:

```json
{
  "email": "chef@luigis.com",
  "password": "Secret123",
  "full_name": "Maria Lopez",
  "staff_role": "Head Chef"
}
```

Behavior:

- validates `email` and `password`
- creates default profile metadata if optional fields are missing
- registers the staff account through Supabase Auth
- returns `201 Created` on success

### 2. Login / Clock-in

Endpoint: `POST /auth/login`

Example request:

```json
{
  "email": "chef@luigis.com",
  "password": "Secret123"
}
```

Behavior:

- validates the login request
- calls `supabase.auth.signInWithPassword()`
- returns an access token, refresh token, and user data
- returns `401 Unauthorized` when login fails

This represents the digital badge that unlocks the protected kitchen areas.

---

## Why This Matters Security-wise

The restaurant example maps directly to real authentication behavior:

- `400 Bad Request` means the staff member forgot important login information
- `401 Unauthorized` means a request arrived without a valid badge or with a broken token
- `201 Created` means a new employee record was successfully onboarded
- `200 OK` means the protected area was successfully accessed

This is the same logic used in real backend security: if the token is valid, the request is trusted; if not, the system denies access.

---

## Controller and Service Separation

The code is split cleanly between the transport layer and business logic:

- `src/controllers/auth.controller.js` handles HTTP validation and responses
- `src/services/auth.service.js` communicates with Supabase Auth
- `src/routes/auth.routes.js` maps routes to controller actions

This separation makes the app easier to understand, test, and extend as more protected routes are added.

---

## Current Status

This project currently implements the core authentication foundation:

- staff signup
- staff login
- token generation from Supabase
- startup validation

It does not yet include middleware-based token verification for protected endpoints, but the architecture is prepared for that next stage.

The next natural step is adding middleware that checks the bearer token before allowing access to private staff routes.

---

## How to Run

1. Copy the environment example file:

```bash
cp .env.example .env
```

2. Add your real Supabase authentication values.

3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm run dev
```

5. Test the auth endpoints using Postman, Insomnia, or curl.

---

## Final Note

The Secret Recipe Vault story is a strong mental model for this assignment because it makes the security boundary obvious. The public storefront is open, but the internal kitchen vault is protected. In backend terms, the public API is available to everyone while authenticated staff requests are accepted only when their token proves identity.
