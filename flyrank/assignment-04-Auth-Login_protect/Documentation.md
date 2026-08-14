# Assignment 04 - Auth Login & Protect

## The Secret Recipe Vault: Restaurant Staff Portal

This assignment simulates a real restaurant security problem. The backend serves both public information and protected staff-only data. The public storefront is open to everyone, while the internal kitchen area contains sensitive employee and operational information that should only be accessed by authenticated staff.

The restaurant story is simple:

- Public storefront data can be viewed by anyone
- Staff-only data must be locked behind a secure digital badge
- Signup and login create the badge that identifies a staff member
- Protected routes require a valid Authorization header before access is granted

For learning notes and reflection, see Learning.md.

---

## Real-World Problem

Imagine a famous restaurant chain called Luigi's Secret Kitchen.

The same backend serves two very different types of visitors:

- The dining public: needs the restaurant address and hours
- Internal staff: needs access to private employee and operational information

If the API is not protected, a person could guess or manipulate URLs and access private staff data. This assignment demonstrates the importance of public vs. protected access boundaries and the first step toward enforcing them.

---

## Endpoint to Restaurant Mapping

| Endpoint | Method | Restaurant Analogy | Return Value | Access |
| --- | --- | --- | --- | --- |
| `/public/info` | GET | Storefront sign | address, hours, welcome notice | Public |
| `/auth/signup` | POST | HR onboarding desk | create new staff member | Public |
| `/auth/login` | POST | Clock-in station | returns access token after validation | Public |
| `/protected/profile` | GET | Staff locker room | user profile and identity data | Protected |
| `/stats` | GET | Manager check-in | app status and available API routes | Public |
| `/protected/dashboard` | GET | Secret recipe vault | confidential recipe content | Planned protected route |

This reflects the current security model in the project: public information is openly available, while protected staff endpoints are designed to require a valid bearer token before access is allowed.

---

## Objective

This assignment focuses on:

- connecting the Express app to a Supabase Auth backend
- validating environment variables before the server starts
- creating signup and login flows for restaurant staff accounts
- separating public and protected routes in the Express app
- checking for a bearer token before access is allowed to private staff endpoints
- demonstrating the first layers of secure authentication in a real backend service

---

## Technologies Used

- Node.js
- Express.js
- Supabase JavaScript SDK
- dotenv
- Swagger UI
- GitHub Codespaces

---

## Project Structure

```text
assignment-04-Auth-Login_protect/
├── Documentation.md
├── Learning.md
├── index.js
├── openapi.json
├── package.json
├── src/
│   ├── app.js
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── protected.controller.js
│   │   └── public.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── protected.routes.js
│   │   ├── public.routes.js
│   │   └── stats.routes.js
│   └── services/
│       └── auth.service.js
└── image.png
```

---

## Environment Configuration

The application reads Supabase connection values from a local .env file:

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

The code in src/config/supabase.js reads:

- SUPABASE_URL
- SUPABASE_PUBLISHABLE_KEY
- and supports SUPABASE_KEY as a fallback value

If either required value is missing, the application exits early instead of starting with invalid auth configuration.

---

## Supabase Client Setup

The Supabase client is initialized like this:

```js
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

This is the backend identity gateway. Without a valid Supabase project configuration, the app cannot begin its auth flow.

---

## Startup Flow

The app is created in src/app.js and mounted with the public and protected route groups:

```js
import express from 'express';
import authRouter from './routes/auth.routes.js';
import statsRouter from './routes/stats.routes.js';
import publicRouter from './routes/public.routes.js';
import protectedRouter from './routes/protected.routes.js';

export function CreateApp() {
  const app = express();
  app.use(express.json());
  app.use('/', statsRouter);
  app.use('/auth', authRouter);
  app.use('/stats', statsRouter);
  app.use('/public', publicRouter);
  app.use('/protected', protectedRouter);
  return app;
}
```

This confirms the backend is exposing both public storefront endpoints and staff-only protected endpoints in a modular structure.

### Remote preview caveat: GitHub.dev tunnel redirects

When testing through a GitHub.dev or Codespaces preview URL, the tunnel may intercept the request before it reaches the Node server. In that case, the browser or curl sees an HTTP 302 redirect to a GitHub sign-in page instead of the API response. This is a hosting-layer redirect, not an application-level auth failure.

For real API testing of the Express app, use the local development URL instead:

```bash
curl -i -X GET http://localhost:3000/protected/profile \
  -H "Authorization: Bearer test_token_123"
```

This is the correct way to validate the route logic, because it bypasses the tunnel's authentication redirect and reaches the backend directly.

---

## Authentication Flow in the Restaurant Story

### 1. Signup / HR onboarding

Endpoint: POST /auth/signup

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

- validates email and password
- creates a new Supabase Auth user for a restaurant staff member
- returns a 201 Created response on success
- returns validation errors when required values are missing

### 2. Login / Clock-in

Endpoint: POST /auth/login

Example request:

```json
{
  "email": "chef@luigis.com",
  "password": "Secret123"
}
```

Behavior:

- validates the request body
- calls Supabase Auth to sign in the user
- returns session tokens for authenticated requests
- returns 401 Unauthorized when credentials are invalid

This represents the digital badge that unlocks the protected kitchen areas.

### 3. Public storefront route

Endpoint: GET /public/info

Behavior:

- returns generic information such as restaurant name, address, and hours
- does not require authentication
- is available to any visitor

### 4. Protected staff route

Endpoint: GET /protected/profile

Behavior:

- checks for an Authorization header beginning with Bearer
- rejects the request with 401 if the header is missing or malformed
- is the current example of a protected route gate before deeper token validation is added

---

## Why This Matters Security-wise

The restaurant example maps directly to real authentication behavior:

- 400 Bad Request means the request is incomplete or missing required fields
- 401 Unauthorized means the request arrived without a valid badge or with a broken token
- 201 Created means a new user or staff record was successfully onboarded
- 200 OK means the protected or public route was accessed successfully

This is the same logic used in real backend security: if the token is valid, the request is trusted; if not, the system denies access.

---

## Controller and Service Separation

The code is split cleanly between the transport layer and business logic:

- src/controllers/auth.controller.js handles HTTP validation and responses
- src/services/auth.service.js communicates with Supabase Auth
- src/routes/auth.routes.js maps routes to controller actions
- src/controllers/public.controller.js handles storefront access
- src/controllers/protected.controller.js handles the staff-only access gate
- src/routes/public.routes.js and src/routes/protected.routes.js mount the public and protected endpoints

This separation keeps the app readable and makes it easier to add authentication middleware later.

---

## Current Status

This project currently implements the core authentication foundation and route separation:

- staff signup
- staff login
- token generation from Supabase
- public storefront access
- protected route guard for Authorization header validation
- startup validation for required environment values

The next step is to replace the current placeholder protection with real middleware that verifies the bearer token against Supabase or a custom auth layer before allowing access to private staff routes.

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
