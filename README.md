# Student Internship Tracker

> Course: **Internet Programming I**  
> Institution: **Institute of Technology of Cambodia (ITC)**  
> Student: **SOK Vireak** (ID: `e20231270`) — Group: `I4-GIC-B`  
> Lecturer: **Mr. CHUN Thavorac**  
> Academic Year: **2025–2026**

A full-stack web application that enables university students to record, manage, and monitor internship applications, while academic advisors review, provide feedback, and officially approve or reject applications for academic credit.

---

## Run

### Prerequisites
- Node.js ≥ 18
- Docker & Docker Compose (or PostgreSQL ≥ 14 running locally)
- npm or pnpm

### 1. Database Setup
Start PostgreSQL via Docker:
```bash
docker compose up -d
```
*(Default connection: `postgresql://postgres:postgres@localhost:5433/internship_tracker`)*

### 2. Backend Setup (NestJS + Prisma)
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run start:dev
```
Backend runs at: `http://localhost:3000`

### 3. Frontend Setup (Vue 3 + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## Features

- **Authentication & RBAC**:
  - Secure registration and login with bcrypt password hashing (≥ 10 rounds).
  - Stateless JWT token authentication with expiration.
  - Role-Based Access Control distinguishing `STUDENT` and `ADVISOR` roles.
- **Student Internship Tracking**:
  - Full CRUD operations on internship applications (company, role, stipend, dates, location).
  - Application lifecycle state management (`DRAFT` → `APPLIED` → `INTERVIEWING` → `OFFERED` → `APPROVED` / `REJECTED`).
  - Search by company/position and filter by application status.
  - Pagination (default 5 items per page) with metadata.
- **Advisor Review & Approval**:
  - Department-wide student application overview.
  - Chronological review feedback thread on each application.
  - Formal decision actions (`APPROVED`, `REJECTED`, `NEEDS_CHANGES`) with atomic state transitions.
- **Security & Quality**:
  - Strict IDOR mitigation: returning HTTP 404 on cross-student resource access.
  - Input validation via class-validator DTOs and client-side reactive form validations.
  - Comprehensive automated unit tests (Vitest) and E2E integration tests (Jest + Supertest).

---

## Screenshots

Wireframes and screenshots are located in [`docs/wireframes/`](docs/wireframes/):
- **Login / Register**: `docs/wireframes/login-register.png`
- **Student Dashboard**: `docs/wireframes/student-dashboard.png`
- **Application Form**: `docs/wireframes/application-form.png`
- **Application Detail & Advisor Review**: `docs/wireframes/application-detail-review.png`
- **404 Not Found Fallback**: `docs/wireframes/404-page.png`
