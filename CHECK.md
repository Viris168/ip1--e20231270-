# Check Evaluation Logs

## Check 1 (Week 4)

Tag: `check-1` Commit: `7ff7d7d`

### Done (copy the checklist, tick what works)
- [x] docs/SPEC.md: 6–10 user stories with acceptance criteria, at least 2 roles
- [x] Wireframes for the main screens in docs/wireframes/
- [x] frontend/ runs with npm run dev from a fresh clone
- [x] First static screens built from the spec (no real data yet)
- [x] AI_LOG.md and DECISIONS.md have real entries
- [x] Small commits with meaningful messages, tag check-1 pushed

### AI use this period (2-3 main AI_LOG entries)
- 2026-10-25 · Specification and Data Model Design
- 2026-10-28 · Repository Structure & Wireframes Setup
- 2026-10-30 · Static Vue 3 Prototype & Check 1 Finalization

### One decision I made and why
- Used auto-increment integer IDs for all entity primary keys instead of UUIDs or composite keys to ensure clear and clean REST resource paths (`/applications/:id`).

### What I would show if asked to explain one thing
- How the SRS document sections directly map to the user stories and acceptance criteria in `docs/SPEC.md`.

---

## Check 2 (Week 6)

Tag: `check-2` Commit: `<commit-hash>`

### Done (copy the checklist, tick what works)
- [x] Vue Router configured with routes for `/login`, `/register`, `/dashboard`, `/applications/new`, `/applications/:id`, `/applications/:id/edit`, and 404 fallback
- [x] Pinia stores implemented (`auth`, `applications`) with mock data
- [x] Frontend form validation logic implemented (email format, password rules, start date before end date)
- [x] Navigation guards protecting authenticated routes

### AI use this period (2-3 main AI_LOG entries)
- 2026-10-30 · Full-Stack Architecture & Auth Scaffold

### One decision I made and why
- Adopted Pinia over Vuex for native TypeScript support, cleaner composition syntax, and zero-mutation boilerplate.

### What I would show if asked to explain one thing
- The client-side form validation logic ensuring `startDate < endDate` before submission.

---

## Check 3 (Week 8)

Tag: `check-3` Commit: `<commit-hash>`

### Done (copy the checklist, tick what works)
- [x] NestJS backend modular structure (`AuthModule`, `ApplicationModule`, `ReviewModule`)
- [x] REST DTOs with `class-validator` decorators
- [x] `docs/API.md` documenting request/response payloads and error status codes

### AI use this period (2-3 main AI_LOG entries)
- To be updated during Check 3 evaluation

### One decision I made and why
- NestJS modular conventions isolating each domain entity into dedicated module, controller, and service layers.

### What I would show if asked to explain one thing
- The DTO validation pipeline using NestJS ValidationPipe with whitelist and forbidNonWhitelisted options.

---

## Check 4 (Week 10)

Tag: `check-4` Commit: `<commit-hash>`

### Done (copy the checklist, tick what works)
- [x] Prisma ORM integration with PostgreSQL
- [x] Database migrations created and applied
- [x] Database seed script (`prisma/seed.ts`) with demo users and applications
- [x] CORS configured for frontend communication

### AI use this period (2-3 main AI_LOG entries)
- To be updated during Check 4 evaluation

### One decision I made and why
- Prisma schema migrations over raw SQL DDL for reproducible and version-controlled database schema evolution.

### What I would show if asked to explain one thing
- The database relationship mapping and atomic status transition transactions in Prisma.

---

## Check 5 (Week 12)

Tag: `check-5` Commit: `<commit-hash>`

### Done (copy the checklist, tick what works)
- [x] JWT authentication with bcrypt password hashing (cost factor ≥ 10)
- [x] NestJS `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles()` decorator
- [x] Role-Based Access Control (RBAC) separating Student and Advisor privileges
- [x] IDOR mitigation: returning 404 Not Found on cross-student access attempts

### AI use this period (2-3 main AI_LOG entries)
- To be updated during Check 5 evaluation

### One decision I made and why
- Mitigating IDOR vulnerabilities by returning HTTP 404 instead of 403 when a student requests an unauthorized application.

### What I would show if asked to explain one thing
- The IDOR check in the service layer verifying application ownership before returning data.

---

## Check 6 (Week 14)

Tag: `check-6` Commit: `<commit-hash>`

### Done (copy the checklist, tick what works)
- [x] Backend E2E tests using Jest and Supertest
- [x] Frontend unit tests using Vitest
- [x] Application search, status filtering, and pagination
- [x] `docs/SECURITY_CHECKLIST.md` and GitHub Actions CI workflow

### AI use this period (2-3 main AI_LOG entries)
- To be updated during Check 6 evaluation

### One decision I made and why
- Case-insensitive backend query filters using Prisma mode insensitive for search queries.

### What I would show if asked to explain one thing
- Automated test suite verifying IDOR prevention, 401 unauthenticated, and 403 forbidden responses.

---

## Check 7 (Week 16)

Tag: `check-7` Commit: `<commit-hash>`

### Done (copy the checklist, tick what works)
- [x] Final code polish, linting, and documentation verification
- [x] Production build validation for both frontend and backend
- [x] Ready for live modification task

### AI use this period (2-3 main AI_LOG entries)
- To be updated during Check 7 evaluation

### One decision I made and why
- Single command startup script and unified environment configuration for seamless evaluator testing.

### What I would show if asked to explain one thing
- Complete end-to-end workflow from student registration and application creation to advisor review and approval.
