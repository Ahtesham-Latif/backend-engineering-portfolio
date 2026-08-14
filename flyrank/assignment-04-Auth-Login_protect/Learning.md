# Learning Notes: Auth Login & Protect

This file captures the learning journey for the authentication-focused assignment using Supabase.

For the implementation overview and setup details, see `Documentation.md`.

---

## Why This Assignment Matters

In the earlier assignments, the focus was on API development, database design, and containerization. This assignment adds a crucial backend concern: secure identity and access control.

Authentication is no longer optional in real applications. Whether an API serves a dashboard, task application, or private data service, the backend must validate who the user is before allowing sensitive operations.

---

## What I Learned About Supabase Auth

Supabase simplifies authentication by providing:

- a managed auth backend
- client-side and server-side session handling
- support for email/password and social login methods
- JWT-based session tokens that can be validated in backend services

The most important technical lesson in this task was understanding that the backend must always trust and validate the Supabase session configuration before exposing protected workflows.

---

## Key Concepts from This Assignment

### 1. Environment-based configuration

Sensitive values must not be hardcoded. The app reads values such as:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

from `.env` so the configuration can change across local, dev, and production environments.

### 2. Client initialization

The Supabase client is created only if both required values exist. This prevents the app from starting with invalid or incomplete runtime configuration.

### 3. Session validation

Calling `supabase.auth.getSession()` gives a direct handshake check that the Supabase project is reachable and the configuration is valid.

This is a simple but powerful health check for backend authentication setup.

### 4. App bootstrap separation

A clean backend structure separates:

- app creation
- configuration loading
- service initialization
- startup checks

That pattern keeps the app more maintainable and makes it easier to add protected routes later.

---

## Challenges and Fixes

### Node 22 compatibility

The earlier issue with Supabase Realtime and Node 20 showed that runtime compatibility matters. This project now uses a Node 22-compatible environment, which removes the earlier WebSocket compatibility issue and allows the project to run with a modern Node runtime.

### Missing environment values

If the `.env` file is missing or incomplete, the app will fail early with a clear configuration warning. This is a good practice because it prevents the backend from silently running with broken auth configuration.

---

## Next Logical Step

The next natural step is to add actual protected routes.

These endpoints can verify the session and return user data only if the request is authenticated.

A common pattern would be:

1. read the access token or session context from the request
2. validate it against Supabase
3. reject requests with `401 Unauthorized` when missing or invalid

---

## Final Takeaway

This assignment taught me that backend security starts with correct environment setup, valid client initialization, and a dependable session-checking pattern. Once the app can validate Supabase sessions reliably, the next stage is protecting routes and authorizing users appropriately.
