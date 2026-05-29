# Java Start

A small fullstack learning lab where Next.js and Java work together instead of living in separate worlds.

The project is intentionally practical: registration, login, JWT authentication, a private dashboard, profile state, PostgreSQL, Docker, local scripts, tests, and a frontend that opens automatically when the dev server is ready.

## What Is Inside

- `frontend` - Next.js App Router application with TypeScript, React 19, route handlers, forms, and an httpOnly session cookie.
- `backend` - Spring Boot API with Spring Security, JWT, validation, JPA repositories, PostgreSQL, and focused tests.
- `docker-compose.local.yml` - local PostgreSQL infrastructure with a reusable Docker volume.
- `scripts` - one-command local development, infrastructure, database checks, and stop helpers.
- `src/Main.java` - the original IntelliJ starter file, kept as the first Java step.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Zod, React Hook Form, Vitest, Testing Library.
- Backend: Java 21, Spring Boot 3.5, Spring Web, Spring Security, Spring Data JPA, Bean Validation.
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
- Node.js 22 or newer
- pnpm 10
- Docker Desktop

Recommended setup:

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
java -version
node -v
pnpm -v
docker --version
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

# infrastructure
pnpm infra:up
pnpm infra:down
pnpm infra:reset
pnpm db:check

# production-like local run
pnpm prod:local

# validation
pnpm check
```

</details>

## Validation

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
2. Next.js keeps the browser session in an httpOnly cookie.
3. The frontend BFF calls the Spring Boot API through `BACKEND_URL`.
4. Spring Security verifies JWT authentication.
5. Application services coordinate registration, login, profile updates, and dashboard data.
6. JPA repositories persist users and profiles in PostgreSQL.

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
```

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
pnpm dev:stop
```

If you want a clean local database:

```bash
pnpm infra:reset
pnpm infra:up
```
