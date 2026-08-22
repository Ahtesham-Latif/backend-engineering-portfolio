# Assignment 05 - First Background Job (Inngest)

This assignment connects an Express server to Inngest and runs a durable background function.

## What This Project Does

- Exposes a health endpoint: /health
- Exposes the Inngest serve endpoint: /api/hello
- Registers one function named say-hello
- Sleeps for 5 seconds durably, then returns a completion message

## Environment Variables (.env)

This project now loads environment values in code using dotenv.

In server.js:

- import 'dotenv/config';
- const PORT = Number(process.env.PORT) || 3000;

Add these values to .env:

INNGEST_DEV=1
PORT=3000

Why INNGEST_DEV is needed:

- In local development, this flag allows Inngest dev flow without production signing checks.

## Run Locally

Use two terminals.

Terminal 1 (API):

1. npm install
2. npm run dev

Terminal 2 (Inngest CLI):

1. npx inngest-cli@latest dev -u http://localhost:3000/api/hello

Open dashboard:

- http://localhost:8288

Then invoke function:

- Functions -> say-hello -> Invoke

## Important Note About package.json dev Script

- If your dev script still contains INNGEST_DEV=1 node server.js, it will still work.
- If you want .env to be the single source of truth, set dev script to:

node server.js

With dotenv loaded in code, INNGEST_DEV and PORT come from .env automatically.

## Current Endpoints

- GET /health
- GET/POST/PUT /api/hello (Inngest serve handler)

## Current Function

- id: say-hello
- event: test/hello
- behavior: waits 5 seconds using step.sleep, then returns a success message