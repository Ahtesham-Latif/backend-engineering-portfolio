# Learning Notes: First Background Job

This assignment starts from a very simple API and then introduces one background function. The focus is to understand the difference between regular request handling and asynchronous job execution.

For implementation and setup commands, see Documnetation.md.

---

## Why This Assignment Matters

Earlier stages focused on CRUD and direct HTTP responses. This stage adds a core backend concept: some work should run outside the request-response path.

A background job system helps keep API responses fast while long or delayed tasks run safely in a separate workflow runtime.

---

## Stage 0: Hello, Server

The base requirement is a normal API service with one health route:

- `GET /health` returns `{ "status": "ok" }`

In this project (Express), the server runs on port 3000. The checkpoint is a 200 response from:

- `curl -i http://localhost:3000/health`

This stage confirms the API is healthy before adding background processing.

---

## Stage 1: Connect Inngest

After the server is running, Inngest is added as the background worker system.

The required setup is:

- create Inngest client with id `report-api`
- create function `say-hello`
- trigger event `test/hello`
- add `step.sleep` for 5 seconds
- return `"Hello from the background!"`
- serve the handler at `/api/inngest`

Two processes must run in parallel:

1. API server
2. Inngest Dev Server

Example CLI command:

```bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Dashboard:

- `http://localhost:8288`

Checkpoint: the `say-hello` run appears and finishes with `Completed` after the sleep step.

---

## What I Learned from the Current Implementation

### 1. Health endpoints are still important

Even in a background-job assignment, the `/health` route is the first readiness check. If this fails, everything else is harder to debug.

### 2. Background functions should be small and explicit first

A minimal function with one sleep step is enough to verify:

- event registration
- function execution
- durable waiting behavior
- successful completion state

### 3. Running two terminals is part of local workflow

This assignment depends on both the API process and Inngest Dev Server process being active. If one is stopped, invocation and runs will not behave correctly.

### 4. Endpoint path consistency matters

The serve path used in code and the CLI URL must match exactly. A path mismatch is a common reason functions do not appear or execute as expected.

---

## Key Technical Patterns Used

### Baseline health route

```js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
```

### Inngest function shape

```js
const sayHello = inngest.createFunction(
  { id: 'say-hello', event: 'test/hello' },
  async ({ step }) => {
    await step.sleep('wait-a-bit', '5s');
    return 'Hello from the background!';
  }
);
```

### Express + Inngest handler mount

```js
app.use('/api/inngest', serve({ client: inngest, functions: [sayHello] }));
```

---

## Execution Flow in Plain English

1. Start API server.
2. Start Inngest Dev Server with the API URL.
3. Open Inngest dashboard.
4. Invoke `say-hello`.
5. Observe 5-second sleep step.
6. Confirm run completes successfully.

---

## Final Takeaway

This stage proves the full baseline for background jobs: a healthy API, a connected Inngest client, a working function, and successful local execution through the dev server and dashboard.
