# Learning Notes: Auth Login & Protect

This assignment introduced the core idea behind secure backend access: not every endpoint should be public. In a real-world system like a restaurant, some information is meant for everyone, while other information must be restricted to the staff who are allowed inside the kitchen.

The restaurant analogy is useful because it turns an abstract authentication lesson into a clear business problem: the public sees the storefront, but the internal recipe vault must stay locked.

For the implementation summary and setup details, see Documentation.md.

---

## Why This Assignment Matters

Earlier assignments focused on CRUD APIs and database setup. This one adds the missing layer of trust and identity.

Without authentication, anyone can guess URLs or inspect traffic and gain access to private data. In a business context, this could mean leaking family recipes, employee records, or internal operational details. This assignment teaches how to build an identity gate before protected backend data is exposed.

---

## The Secret Recipe Vault Mental Model

The best way to understand this assignment is to imagine a restaurant backend with two groups of users:

- Public visitors: allowed to see business hours and address
- Staff members: allowed to access private employee and recipe information

The critical point is this:

- public routes are open
- protected routes are blocked unless a valid token is presented

This is the same pattern used in real backend systems, where a valid user session proves identity before sensitive data is shared.

---

## What I Learned from the Current Implementation

### 1. Authentication is about trust, not just login

A login endpoint is not enough by itself. It is the start of a trust chain. Once a user logs in, the backend needs a way to verify future requests. In a real app, that verification happens through a token attached to the request and checked before protected data is returned.

### 2. Supabase Auth gives a clean auth backbone

The current project uses Supabase for signup and login. This is useful because it handles the hard parts of auth infrastructure while the app remains simple to understand.

The workflow is:

- a user sends email and password
- the backend calls Supabase Auth
- Supabase validates credentials
- session data is returned
- future protected requests should require that session token

### 3. Project structure matters in real backend work

The current app is divided into clear responsibilities:

- routes/auth.routes.js for auth endpoints
- controllers/auth.controller.js for request handling
- services/auth.service.js for auth logic
- config/supabase.js for infrastructure setup
- routes/public.routes.js and controllers/public.controller.js for storefront data
- routes/protected.routes.js and controllers/protected.controller.js for staff-only access checks

This is the correct architecture for a scalable API. It keeps code readable and makes it easier to layer in reusable middleware and protected route logic later.

### 4. Security should fail fast

The project exits early if important environment values are missing. This is an excellent backend habit because it prevents a broken configuration from running silently.

---

## Key Back-End Patterns Used

### Environment validation

The app checks for required values before startup:

```js
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
  process.exit(1);
}
```

This prevents the API from running in an insecure or invalid state.

### App bootstrap and route mounting

The Express app is created in a modular way and route groups are mounted separately for public and protected access:

```js
app.use('/', statsRouter);
app.use('/auth', authRouter);
app.use('/stats', statsRouter);
app.use('/public', publicRouter);
app.use('/protected', protectedRouter);
```

This keeps the project easier to grow into a larger backend system.

### Remote preview caveat

A GitHub.dev or Codespaces preview URL can redirect requests before they reach the local Express server. This is often seen as an HTTP 302 to a GitHub sign-in page. It is not the API rejecting the request; it is the tunnel infrastructure redirecting traffic first.

For accurate testing of route behavior, always prefer the local server URL, such as http://localhost:3000/protected/profile, and include the Authorization header there.

### Token-based identity model

The login flow returns session information such as:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "...",
    "email": "user@example.com"
  }
}
```

This is the digital badge a user presents later to access protected restaurant data.

### Protected route guard pattern

The protected profile route now does two checks:

1. it verifies a bearer token exists in the Authorization header
2. it validates that token with Supabase by calling `supabase.auth.getUser(accessToken)` through `AuthService.verifyToken(token)`

```js
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ error: 'Access token required' });
}

const token = authHeader.split(' ')[1];
const user = await AuthService.verifyToken(token);
```

This is the real route-protection flow for the assignment. The server no longer only checks that a token exists; it validates the token against Supabase before returning staff identity data.

---

## The Security Flow in Plain English

The mental model is:

1. staff sign up or are onboarded
2. staff log in at the clock-in desk
3. the server verifies credentials with Supabase
4. a valid session token is returned
5. the token is used to prove identity on later requests
6. unauthorized users are rejected with 401 Unauthorized
7. the public routes remain available without authentication

This is the exact idea behind real auth flows in production-grade backend systems.

---

## Challenges and Observations

### Public vs protected data

The biggest concept in this assignment is understanding that APIs can have two layers of security:

- public endpoints for storefront info
- protected endpoints for private staff data

If this separation is not implemented correctly, the backend becomes unsafe.

### Verified token protection

The current project has already separated the public and protected route groups, and the protected profile endpoint now validates the bearer token with Supabase via `getUser(accessToken)`. This moves the route from a placeholder check to real identity verification.

---

## Next Logical Step

The next step is to extract this verification into reusable middleware so each protected route can share the same logic instead of repeating it per controller.

A proper protected route flow would be:

1. read the Authorization header
2. extract the bearer token
3. validate using Supabase or the backend auth layer
4. attach the user identity to the request
5. allow or deny access based on that validation

---

## Final Takeaway

The Secret Recipe Vault story makes the assignment immediately understandable. The public side of the restaurant is open, but the recipe vault is locked behind a digital credential. The same is true in backend security: public information can be accessed freely, while private information is allowed only when the request proves valid user identity.
