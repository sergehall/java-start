# Java Start

A small fullstack learning lab where Next.js and Java work together instead of living in separate worlds.

The project is intentionally practical: registration, email verification, login, server-side session revocation, JWT authentication, a private dashboard, profile state, PostgreSQL, Docker, local scripts, tests, and a frontend that opens automatically when the dev server is ready.

## What Is Inside

- `frontend` - Next.js App Router application with TypeScript, React 19, route handlers, forms, email verification screens, and an httpOnly session cookie.
- `backend` - Spring Boot API with Spring Security, JWT, revocable server-side sessions, email verification, SMTP/log mail providers, validation, JPA repositories, PostgreSQL, and focused tests.
- `docker-compose.local.yml` - local PostgreSQL infrastructure with a reusable Docker volume.
- `scripts` - one-command local development, infrastructure, database checks, and stop helpers.
- `src/Main.java` - the original IntelliJ starter file, kept as the first Java step.

Database tables use the learning-project prefix `java-`, for example `"java-user-accounts"` and `"java-user-sessions"`. The account identity field is `username` across the frontend contract, backend DTOs, and database column names.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, Zod, React Hook Form, Vitest, Testing Library.
- Backend: Java 21, Spring Boot 3.5, Spring Web, Spring Security, Spring Data JPA, Spring Mail, Bean Validation.
- Database: PostgreSQL 17 in Docker for local development, H2 fallback for lightweight backend startup/tests.
- Tooling: pnpm, Maven Wrapper, Docker Compose, ESLint, TypeScript, Vitest, Spring Boot Test.

## Runtime Environments

- Local development: `.env.local`
- Local production-like run: `.env`
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- PostgreSQL local: `localhost:5432`
- PostgreSQL production-like local: `localhost:5433`

## Repository Layout

```text
java-start/
|-- backend/
|   |-- src/main/java/dev/serge/javastart/
|   |   |-- application/
|   |   |-- bootstrap/
|   |   |-- domain/
|   |   `-- infrastructure/
|   |-- src/main/resources/application.yml
|   |-- src/test/java/
|   |-- mvnw
|   `-- pom.xml
|-- frontend/
|   |-- app/
|   |-- features/
|   |-- shared/
|   |-- package.json
|   `-- pnpm-lock.yaml
|-- scripts/
|-- docker-compose.local.yml
|-- package.json
|-- .env.example
`-- .env.local.example
```

## Prerequisites

- Java 21
- Node.js 24.15.0
- pnpm 10
- Docker Desktop

Recommended setup:

```bash
nvm use
corepack enable
corepack prepare pnpm@10.33.0 --activate
java -version
node -v
pnpm -v
docker --version
```

Node is pinned with `.nvmrc`, `.node-version`, and `engines.node` in the root and frontend package manifests. The expected frontend runtime is:

```bash
node -v
# v24.15.0
```

For IntelliJ IDEA, import the backend as a Maven project from:

```text
backend/pom.xml
```

That lets the IDE mark `backend/src/main/java` as the backend source root.

## Install

Install frontend dependencies:

```bash
cd frontend
pnpm install
```

The backend uses Maven Wrapper, so no global Maven install is required:

```bash
cd backend
./mvnw test
```

## Local Development

Start PostgreSQL first:

```bash
pnpm infra:up
```

Start the full app:

```bash
pnpm dev
```

`pnpm dev` checks that PostgreSQL is reachable, starts Spring Boot and Next.js, then opens `FRONTEND_URL` in the browser after Next.js is ready.

Stop the app:

```bash
pnpm dev:stop
```

Short alias:

```bash
pnpm stop
```

Restart the app from a clean local process state:

```bash
pnpm dev:restart
```

You can also stop it with `Ctrl+C` or the IDE stop button.

Start without opening the browser:

```bash
pnpm dev:no-open
```

Run services separately:

```bash
pnpm dev:backend
pnpm dev:frontend
pnpm dev:frontend:no-open
```

## Database Lifecycle

Start or reuse the local PostgreSQL container:

```bash
pnpm infra:up
```

Stop PostgreSQL while keeping the container and data volume:

```bash
pnpm infra:down
```

Check database readiness:

```bash
pnpm db:check
```

Delete the local database volume and start fresh:

```bash
pnpm infra:reset
```

`infra:reset` removes data. Use it only when you want a clean database.

Docker does not rebuild the PostgreSQL image on every run. The first run pulls `postgres:17-alpine`; later runs reuse the same image, container, and named volume unless you reset them.

Current local tables:

```text
public."java-user-accounts"
public."java-user-profiles"
public."java-user-sessions"
public."java-email-verification-tokens"
```

The main account table stores `username`, `email`, password hash, role, email verification state, and timestamps. If you rename entity columns while learning, update the local database with a small SQL migration or reset the local volume with `pnpm infra:reset`.

pgAdmin 4 connection values:

```text
Host: 127.0.0.1
Port: 5432
Database: java_start_local
Username: java_start
Password: java_start_local_password
```

## Local Production-Like Run

Start the production-like PostgreSQL profile:

```bash
./scripts/infra-up.sh prod
```

Build and run the app with `.env`:

```bash
pnpm prod:local
```

This mode is useful for learning the difference between development startup and built application startup. It is not a real deployment profile yet.

## Common Scripts

<details>
<summary>Show scripts</summary>

```bash
# development
pnpm dev
pnpm dev:no-open
pnpm dev:backend
pnpm dev:frontend
pnpm dev:frontend:no-open
pnpm dev:stop
pnpm dev:restart
pnpm stop

# infrastructure
pnpm infra:up
pnpm infra:down
pnpm infra:reset
pnpm db:check

# production-like local run
pnpm prod:local

# validation
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm typecheck
pnpm check
```

</details>

## Validation

Format the code:

```bash
pnpm format
```

Check formatting without changing files:

```bash
pnpm format:check
```

Run linting:

```bash
pnpm lint
```

Run everything:

```bash
pnpm check
```

Backend only:

```bash
cd backend
./mvnw test
```

Frontend only:

```bash
cd frontend
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Learning Map

This project is built to make the fullstack flow visible:

1. The browser talks to Next.js pages and route handlers.
2. Registration sends `username`, `email`, and `password` to the Next.js BFF.
3. The backend creates a pending account and queues an email verification link.
4. The email link opens `/verify-email`, which confirms the token through the backend.
5. Next.js keeps the verified browser session in an httpOnly cookie.
6. The frontend BFF calls the Spring Boot API through `BACKEND_URL`.
7. Spring Security verifies JWT authentication and checks the session id against `"java-user-sessions"`.
8. Logout revokes the backend session before clearing the browser cookie.
9. Application services coordinate registration, verification, login, logout, profile updates, and dashboard data.
10. JPA repositories persist users, sessions, profiles, and email verification tokens in PostgreSQL.

The goal is not to hide complexity. The goal is to keep each layer small enough that you can learn it, change it, test it, and then make it stronger.

## Environment Files

- `.env.local` - local development values.
- `.env` - local production-like values.
- `.env.local.example` - shareable local development template.
- `.env.example` - shareable production-like template.

Important variables:

```bash
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/java_start_local
APP_SECURITY_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
MAIL_PROVIDER=log
MAIL_FROM=no-reply@java-start.local
MAIL_SUPPORT=support@java-start.local
AUTH_EMAIL_VERIFICATION_TTL_SECONDS=900
```

Registration and authenticated user responses use `username`:

```json
{
  "username": "serge",
  "email": "serge@example.com",
  "password": "strong-password"
}
```

For real email delivery, switch `MAIL_PROVIDER` to `smtp` and provide the SMTP variables:

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
SMTP_USERNAME=replace-with-smtp-user
SMTP_APP_PASSWORD=replace-with-smtp-app-password
SMTP_PASSWORD=replace-with-smtp-password
```

`SMTP_APP_PASSWORD` is preferred when it is set. Local development defaults to the log provider, so verification links appear in backend logs without sending real email.

Do not use the example secrets for real deployment.

## Troubleshooting

If the backend file is shown outside the source root in IntelliJ, import `backend/pom.xml` as a Maven project.

If the database is not running:

```bash
pnpm infra:up
pnpm db:check
```

If development processes keep running after closing a terminal:

```bash
pnpm stop
```

`pnpm stop` and `pnpm dev:stop` both stop Java and Next.js processes for this project. `pnpm dev:restart` stops them first, then starts a fresh local dev run.

If you want a clean local database:

```bash
pnpm infra:reset
pnpm infra:up
```
