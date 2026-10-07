# QOVYEL Backend

A production REST API for the QOVYEL digital studio website — contact
inquiries, newsletter signups, project/service/testimonial content, and an
authenticated admin dashboard. Node.js + Express + PostgreSQL (via Prisma).

## Architecture

```
src/
  config/
    env.js          Loads and validates environment variables; fails fast
                     with a clear message if anything required is missing.
    prisma.js        Shared Prisma Client instance.
  controllers/       One file per resource — contact, newsletter, projects,
                      services, testimonials, auth, admin.
  middleware/
    validate.js       Validates req.body against a Zod schema.
    requireAdmin.js    Verifies the admin session cookie.
    rateLimiter.js     Per-endpoint rate limits (contact/newsletter/login
                        get tight limits; general reads get a looser one).
    errorHandler.js    Centralized error formatting + 404 handler.
  models/
    validationSchemas.js  Zod schemas for every request body the API
                           accepts. (Database *models* live in
                           prisma/schema.prisma — Prisma owns those.)
  routes/             One router per resource, mounted under /api in
                      routes/index.js.
  services/
    authService.js     Password hashing (bcrypt) + session JWT signing.
    emailService.js     Nodemailer transport + the two email templates.
  utils/
    apiResponse.js      sendSuccess/sendError — the one response shape.
    asyncHandler.js      Wraps async route handlers so errors reach
                         errorHandler instead of hanging the request.
    ApiError.js          A typed error carrying an HTTP status.
    logger.js            Request logging (method/route/status/timing only).
  server.js           Express app: security middleware, routes, error
                      handling, listen.
prisma/
  schema.prisma       Database models (PostgreSQL).
  seed.js             Seeds the real 5 projects, the 5 approved services,
                      and the existing demo testimonials. No fake data.
  createAdmin.js       CLI to create/update an admin user — credentials are
                       passed as arguments, never hardcoded anywhere.
```

## Local setup

```bash
cd backend
npm install
cp .env.example .env        # then fill in real values, see below
npx prisma generate
npx prisma migrate dev      # creates the database schema
npm run seed                # seeds real projects/services/demo testimonials
npm run create-admin -- "you@qovyel.com" "a-strong-password-16-chars"
npm run dev
```

The API is now running at `http://localhost:5000` (or whatever `PORT` you set).

### Required environment variables

See `.env.example` for the full list with explanations. The three the
server refuses to start without: `DATABASE_URL`, `SESSION_SECRET`,
`FRONTEND_URL`. Email (`EMAIL_HOST`/`EMAIL_USER`/`EMAIL_PASSWORD`) is
optional in development — if unset, contact submissions still save to the
database, the server just logs a warning and skips sending email.

Generate a strong `SESSION_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Database

PostgreSQL in production. Any managed Postgres works (Render, Railway,
Neon, Supabase, RDS) — just put its connection string in `DATABASE_URL`.

```bash
npx prisma migrate dev      # local development — creates + applies migrations
npx prisma migrate deploy   # production — applies existing migrations, no prompts
npx prisma studio           # visual database browser, handy while developing
```

## Authentication

Admin sessions are a JWT signed with `SESSION_SECRET`, stored in an
`httpOnly`, `sameSite=lax` cookie (`secure` in production) — never exposed
to frontend JavaScript, so it can't be read or exfiltrated by an XSS bug in
the frontend. `POST /api/auth/login` sets the cookie; `POST
/api/auth/logout` clears it; every `/api/admin/*` route requires it via the
`requireAdmin` middleware.

There is no signup endpoint — admin accounts are provisioned with
`npm run create-admin -- "email" "password"`, which hashes the password
with bcrypt (12 rounds) before it ever touches the database.

## Email

Uses Nodemailer against any standard SMTP provider (Resend, Postmark,
SendGrid's SMTP relay, Gmail with an app password, etc.) — set
`EMAIL_HOST`/`EMAIL_PORT`/`EMAIL_USER`/`EMAIL_PASSWORD` in `.env`. Two
templates are sent on a successful contact submission: an admin
notification to `ADMIN_EMAIL` and a confirmation to the submitter. Both are
best-effort — if email fails or isn't configured, the inquiry is still
saved and the visitor still gets a success response; email failures are
logged, not thrown, since a full mailbox shouldn't be able to turn a
working contact form into a 500.

## API reference

All responses share one shape:

```json
// success
{ "success": true, "data": ... }
// error
{ "success": false, "message": "...", "errors": [] }
```

### Public

| Method | Route | Notes |
|---|---|---|
| GET | `/api/health` | `{ success: true, status: "healthy" }` |
| POST | `/api/contact` | Rate-limited (5 / 15 min per IP). Body: `name, email, phone?, company?, service?, budget?, projectType?, message` |
| POST | `/api/newsletter/subscribe` | Rate-limited (5 / 15 min per IP). Body: `email`. Re-subscribing an existing email returns success, not an error. |
| GET | `/api/projects` | All seeded projects, ordered |
| GET | `/api/projects/:id` | 404 if not found |
| GET | `/api/services` | All 5 approved services |
| GET | `/api/testimonials` | Includes `isDemo` so the frontend's "Demo Testimonial" badge stays accurate |

### Auth

| Method | Route | Notes |
|---|---|---|
| POST | `/api/auth/login` | Rate-limited (10 / 15 min per IP). Sets the session cookie. |
| POST | `/api/auth/logout` | Clears the session cookie. |
| GET | `/api/auth/me` | Requires session cookie. |

### Admin (all require the session cookie)

| Method | Route |
|---|---|
| GET | `/api/admin/dashboard` — live counts, nothing hardcoded |
| GET | `/api/admin/inquiries` (optional `?status=NEW` filter) |
| GET | `/api/admin/inquiries/:id` |
| PATCH | `/api/admin/inquiries/:id` — body: `{ status }`, one of `NEW/CONTACTED/IN_PROGRESS/COMPLETED/CLOSED` |
| DELETE | `/api/admin/inquiries/:id` |
| GET / POST | `/api/admin/projects` |
| PATCH / DELETE | `/api/admin/projects/:id` |
| GET / POST | `/api/admin/testimonials` |
| PATCH / DELETE | `/api/admin/testimonials/:id` |
| GET | `/api/admin/subscribers` |

## Security

- `helmet` for standard security headers
- `cors` locked to exactly `FRONTEND_URL` — never `*`
- **Known upstream advisory:** `npm audit` currently flags a
  `deepmerge-ts` vulnerability pulled in transitively by Prisma's own CLI
  tooling (`@prisma/config`), present even in the latest stable Prisma
  release at the time of writing. It's in a dev-time config loader, not in
  the request-handling code path, but run `npm audit` before deploying and
  upgrade Prisma if a patched release is available by then.
- Per-endpoint rate limiting (tightest on `/auth/login`)
- All input validated with Zod; invalid requests get 400 with per-field messages
- Passwords hashed with bcrypt (12 rounds), never stored or logged in plaintext
- Session tokens in `httpOnly` cookies, not accessible to frontend JS
- Centralized error handler: 500s return a generic message in production
  (no stack traces, no SQL errors, no internal paths); the exact message
  and cause are still logged server-side for debugging
- Request body size capped at 10kb

## Frontend connection

The frontend reads `import.meta.env.VITE_API_URL` (see the frontend's own
`.env.example`) — set it to this backend's URL. Only the contact form was
wired up, per the instruction to change nothing else about the approved
frontend:

```
frontend .env:  VITE_API_URL=http://localhost:5000      (dev)
                VITE_API_URL=https://api.yourdomain.com  (prod)
```

The Projects/Services/Testimonials read APIs exist and work, but the
frontend was deliberately **not** rewired to fetch from them this pass —
it still renders from its existing static data files
(`src/data/projects.js` etc). Swapping those three components to fetch
from the API is a small, low-risk follow-up if you want a single source of
truth, but doing it in the same pass as "don't touch the approved UI" felt
like the wrong tradeoff: it would add loading states and failure modes to
a frontend that currently has none of either.

## Deployment (Render / Railway / any Node host)

1. Provision a PostgreSQL database; copy its connection string into `DATABASE_URL`.
2. Set all variables from `.env.example` in your host's environment config — never commit `.env`.
3. Build/start commands:
   ```
   Build:  npm install && npx prisma generate && npx prisma migrate deploy
   Start:  npm start
   ```
4. Set `FRONTEND_URL` to your deployed frontend's exact origin (no trailing slash).
5. After first deploy, create the admin user once via `npm run create-admin -- "you@qovyel.com" "password"` (run it as a one-off command on the host, or locally against the production `DATABASE_URL`).
6. Point the frontend's `VITE_API_URL` at this backend's deployed URL and rebuild the frontend.

## Health check

`GET /api/health` → `{ "success": true, "status": "healthy" }`. Point your
host's health check at this route.

## Troubleshooting

- **Server exits immediately on start** — check the console message; it
  names exactly which required env var is missing.
- **"Email is not fully configured" warning** — expected until
  `EMAIL_HOST`/`EMAIL_USER`/`EMAIL_PASSWORD` are set; the API still works,
  it just won't send emails.
- **CORS errors in the browser console** — `FRONTEND_URL` must match the
  frontend's origin exactly, including protocol and port.
- **`npx prisma generate` fails to download an engine** — this happens in
  network-restricted environments (it needs `binaries.prisma.sh`); it will
  work normally on a standard machine or CI runner with full internet
  access.
