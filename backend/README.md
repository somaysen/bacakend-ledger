# Backend Ledger

Lean Express + MongoDB service for job postings with JWT auth, role-based access control, request validation, and structured logging.

## Tech Stack
- Node.js (ESM), Express 4
- MongoDB with Mongoose 8
- JWT auth (access + refresh) via jsonwebtoken
- Validation via Joi and a reusable validate middleware
- Logging via Winston (console + files under logs/)
- Testing: Jest, Supertest, mongodb-memory-server

## Project Structure
- src/app.js – Express app wiring, routes, error handler
- src/server.js – bootstrap, DB connect, server start
- src/config/ – environment loader and Mongo connection
- src/controllers/ – auth and job handlers
- src/services/ – auth/token logic
- src/middleware/ – auth guard, validation, error handler
- src/models/ – Mongoose models (User, Job)
- src/routes/ – route registrars for auth and jobs
- src/validators/ – Joi schemas for jobs
- logs/ – winston output (error.log, combined.log)

## Environment
Create a .env with:
PORT=4000
MONGO_URI=mongodb://localhost:27017/backend-ledger
JWT_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
LOG_LEVEL=info

JWT_SECRET and JWT_REFRESH_SECRET are required; others have defaults.

## Getting Started
1) Install deps: npm install
2) Run dev server with hot reload: npm run dev
3) Production start: npm start
4) Tests: npm test

## Authentication & Roles
- Access tokens carry sub (user id) and roles array.
- authGuard() protects routes; authGuard(['admin']) enforces role membership.
- Passwords are bcrypt-hashed (10 rounds).

## API Endpoints
POST /api/auth/signup – { name, email, password } → creates user, returns tokens
POST /api/auth/login – { email, password } → returns tokens
POST /api/auth/refresh – { refreshToken } → new access/refresh tokens

GET /api/jobs – list jobs (auth)
GET /api/jobs/stats – per-company totals and salary stats (admin)
POST /api/jobs – create job (auth, Joi-validated body)
GET /api/jobs/:id – fetch job (auth)
PUT /api/jobs/:id – update job (admin, Joi-validated body/params)
DELETE /api/jobs/:id – delete job (owner or admin)

### Job Payloads
- Create: { title: string, description: string, company: string, salary?: number }
- Update: any of the above (at least one), id path param must be 24-char hex.

## Error Handling & Logging
- Centralized errorHandler logs with Winston and returns normalized JSON.
- Validation errors return 400 with segment-specific Joi details.
- Auth failures return 401; forbidden role access returns 403.

## Notes for Development
- Controllers are async; errors bubble to errorHandler via express-async-errors.
- Mongo connection aborts process on failure to avoid a half-started server.
- Logs are written to console and logs/combined.log; errors also to logs/error.log.
