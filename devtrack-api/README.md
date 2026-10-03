بریم مرحله آخر: **README + cleanup نهایی**.

برای README هدف اینه که هر کسی پروژه رو باز کرد، بدون خوندن کل کد بفهمه پروژه چیه، چطور اجرا می‌شه و چه APIهایی داره.

یک `README.md` در ریشه پروژه بساز و این نسخه رو بذار داخلش:

````md
# DevTrack API

DevTrack is a simple backend API for tracking developer projects, tasks, and learning sessions.

## Features

- Project CRUD
- Task CRUD
- Learning Session CRUD
- Project summary
- Weekly learning summary
- Project details with relations
- DTO validation
- Error handling
- Swagger API documentation
- API versioning with `/api/v1`
- SQLite database with Prisma

## Tech Stack

- NestJS
- TypeScript
- Fastify
- Prisma
- SQLite
- class-validator
- Swagger
- Jest

## Installation

Install dependencies:

```bash
pnpm install
```
````

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL="file:./dev.db"
```

## Database

Apply Prisma migrations:

```bash
pnpm exec prisma migrate dev
```

Generate Prisma Client:

```bash
pnpm exec prisma generate
```

## Run the Project

Development mode:

```bash
pnpm run start:dev
```

The API will be available at:

```text
http://localhost:3000/api/v1
```

Swagger documentation:

```text
http://localhost:3000/api/docs
```

## Main API Routes

### Projects

```text
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:projectId
PATCH  /api/v1/projects/:projectId
DELETE /api/v1/projects/:projectId
```

### Tasks

```text
POST   /api/v1/projects/:projectId/tasks
GET    /api/v1/projects/:projectId/tasks
GET    /api/v1/projects/:projectId/tasks/:taskId
PATCH  /api/v1/projects/:projectId/tasks/:taskId
DELETE /api/v1/projects/:projectId/tasks/:taskId
```

### Learning Sessions

```text
POST   /api/v1/projects/:projectId/learning-sessions
GET    /api/v1/projects/:projectId/learning-sessions
GET    /api/v1/projects/:projectId/learning-sessions/:learningSessionId
PATCH  /api/v1/projects/:projectId/learning-sessions/:learningSessionId
DELETE /api/v1/projects/:projectId/learning-sessions/:learningSessionId
```

### Project Statistics

```text
GET /api/v1/projects/:projectId/summary
GET /api/v1/projects/:projectId/weekly-summary
GET /api/v1/projects/:projectId/details
```

## Validation

The application uses NestJS `ValidationPipe` with:

```text
whitelist: true
forbidNonWhitelisted: true
transform: true
```

Invalid requests return appropriate `400 Bad Request` responses.

Resources that do not exist return `404 Not Found`.

## Tests

Run tests:

```bash
pnpm test
```

TypeScript check:

```bash
pnpm exec tsc --noEmit
```

Lint:

```bash
pnpm run lint
```

## Project Structure

```text
src/
├── projects/
├── tasks/
├── learning-sessions/
├── prisma/
├── generated/
├── app.module.ts
└── main.ts
```

## API Documentation

Interactive API documentation is available through Swagger at:

```text
http://localhost:3000/api/docs
```

Swagger can also be used to test the API directly from the browser.

```

```
