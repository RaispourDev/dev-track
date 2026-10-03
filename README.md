# DevTrack

A full-stack personal development workspace for tracking projects, tasks, and learning progress.

DevTrack is built as a small monorepo with a **NestJS REST API** and a **React + TypeScript web application**. The project is designed to keep development and learning goals organized while providing project-level task management and progress summaries.

> **Status:** Personal project / portfolio project

## ✨ Features

### Project management
- Create, read, update, and delete projects
- Track project status: `ACTIVE` or `COMPLETED`
- Reorder projects in the web interface
- View project details and statistics

### Task management
- Create tasks inside projects
- Edit task titles
- Mark tasks as completed
- Delete tasks
- Filter tasks by status
- Search tasks from the workspace

### Learning tracking
The API also supports learning sessions associated with projects:
- Record learning duration in minutes
- Add optional notes
- View learning sessions
- Update or delete sessions
- Generate weekly learning summaries

### Dashboard
The web application provides an at-a-glance overview of:
- Total projects
- Active projects
- Completed projects
- Overall task completion progress

### API
- RESTful API
- API versioning with `/api/v1`
- Request validation with NestJS `ValidationPipe`
- Swagger/OpenAPI documentation
- Prisma ORM
- SQLite database
- CORS configuration for the local React client
- Automated unit and end-to-end test setup

---

## 🧱 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Hooks
- Native Fetch API
- ESLint

### Backend

- NestJS 11
- TypeScript
- Fastify
- Prisma 7
- SQLite
- Swagger
- class-validator
- class-transformer
- Jest
- Supertest

### Tooling

- pnpm
- concurrently

---

## 📁 Project Structure

```text
dev-track/
├── devtrack-api/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── generated/
│   │   ├── learning-sessions/
│   │   ├── prisma/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   └── package.json
│
├── devtrack-web/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── package.json
└── pnpm-lock.yaml
```

---

## 🗃️ Data Model

DevTrack currently uses three main entities:

```text
Project
├── Task[]
└── LearningSession[]
```

### Project

| Field | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `name` | String | Project name |
| `status` | Enum | `ACTIVE` or `COMPLETED` |
| `createdAt` | DateTime | Creation timestamp |

### Task

| Field | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `title` | String | Task title |
| `completed` | Boolean | Completion state |
| `createdAt` | DateTime | Creation timestamp |
| `projectId` | Integer | Related project |

### LearningSession

| Field | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `durationMinutes` | Integer | Session duration |
| `note` | String? | Optional session note |
| `createdAt` | DateTime | Creation timestamp |
| `projectId` | Integer | Related project |

Deleting a project cascades to its related tasks and learning sessions.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- pnpm 11+

The repository declares pnpm `11.5.0` as its package manager version.

### 1. Clone the repository

```bash
git clone https://github.com/RaispourDev/dev-track.git
cd dev-track
```

### 2. Install dependencies

From the repository root:

```bash
pnpm install
```

### 3. Configure the API

Create a `.env` file inside `devtrack-api/`:

```env
PORT=3000
DATABASE_URL="file:./dev.db"
```

The API uses SQLite through Prisma.

### 4. Prepare the database

From the API directory:

```bash
cd devtrack-api
pnpm exec prisma migrate dev
pnpm exec prisma generate
cd ..
```

### 5. Start the application

From the repository root:

```bash
pnpm dev
```

The root development command starts both applications concurrently.

### Local URLs

| Service | URL |
|---|---|
| Web app | http://localhost:5173 |
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/api/docs |
| API base URL | http://localhost:3000/api/v1 |

---

## 🔌 API Endpoints

All application endpoints are prefixed with:

```text
/api/v1
```

### Projects

```http
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
```

### Project summaries

```http
GET /api/v1/projects/:projectId/summary
GET /api/v1/projects/:projectId/weekly-summary
GET /api/v1/projects/:projectId/details
```

### Tasks

```http
POST   /api/v1/projects/:projectId/tasks
GET    /api/v1/projects/:projectId/tasks
GET    /api/v1/projects/:projectId/tasks/:taskId
PATCH  /api/v1/projects/:projectId/tasks/:taskId
DELETE /api/v1/projects/:projectId/tasks/:taskId
```

### Learning sessions

```http
POST   /api/v1/projects/:projectId/learning-sessions
GET    /api/v1/projects/:projectId/learning-sessions
GET    /api/v1/projects/:projectId/learning-sessions/:learningSessionId
PATCH  /api/v1/projects/:projectId/learning-sessions/:learningSessionId
DELETE /api/v1/projects/:projectId/learning-sessions/:learningSessionId
```

---

## 🧪 Validation & Error Handling

The API uses NestJS validation with:

```ts
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
})
```

This provides:
- DTO-based request validation
- Removal/rejection of unexpected properties
- Automatic transformation of request parameters
- `400 Bad Request` responses for invalid input
- `404 Not Found` responses for missing resources

---

## 📚 Swagger Documentation

Once the API is running, interactive API documentation is available at:

**http://localhost:3000/api/docs**

Swagger can be used to inspect the available endpoints, request schemas, and responses directly from the browser.

---

## 🧑‍💻 Development Commands

### Root

Start frontend and backend together:

```bash
pnpm dev
```

### Backend

```bash
cd devtrack-api

pnpm start:dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:cov
```

### Frontend

```bash
cd devtrack-web

pnpm dev
pnpm build
pnpm lint
pnpm preview
```

### Prisma

From `devtrack-api/`:

```bash
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

---

## 🔄 Application Flow

At a high level, the application follows this structure:

```text
React Web App
      │
      │ HTTP / REST
      ▼
NestJS API
      │
      │ Prisma
      ▼
SQLite Database
```

The frontend communicates with the backend through the REST API. The backend handles validation, business logic, and persistence through Prisma.

---

## 🎯 Project Goals

DevTrack was created as a practical development and learning tracker rather than a large project-management platform.

The main goals are:

1. Keep personal development projects organized.
2. Break projects into manageable tasks.
3. Track progress over time.
4. Record focused learning sessions.
5. Practice building a complete full-stack application.
6. Keep the architecture simple enough to evolve without unnecessary complexity.

---

## 🛣️ Possible Future Improvements

Potential improvements include:

- Authentication and user accounts
- Multi-user project support
- Persistent task ordering
- Richer analytics and charts
- Calendar-based learning history
- Better learning-session dashboard in the web client
- Environment-based API configuration
- Production deployment configuration
- Automated CI/CD
- More comprehensive test coverage
- PostgreSQL support for production environments

These are potential directions rather than guaranteed features.

---

## 👤 Author

**Mahmood Raispour**

Frontend / Full-Stack Developer

- GitHub: https://github.com/RaispourDev
- LinkedIn: https://www.linkedin.com/in/mahmood-raispour-633abb2a9

---

## 📄 License

This project currently uses the license configuration defined in the repository's package metadata.

---

## ⭐ About the Project

DevTrack is part of my full-stack development portfolio and is focused on demonstrating practical skills in:

- React application development
- TypeScript
- REST API design
- NestJS architecture
- Prisma ORM
- Database modeling
- DTO validation
- API documentation
- Frontend/backend integration
- Testing and maintainable project structure
