# Security Checklist

## Topic: Student Internship Tracker
- **Student**: SOK Vireak (`e20231270`)
- **Institution**: ITC - Department of Information and Communication Engineering (GIC)

---

## 1. Authentication & Session Management
- [x] Passwords hashed with bcrypt using a salt round of 10 (`NFR-SEC-01`).
- [x] Raw passwords never stored or logged.
- [x] Password field strictly excluded from all user JSON serializers (`NFR-SEC-03`).
- [x] JWT tokens signed using HS256 algorithm with strong key (`>= 32 chars`) loaded from `JWT_SECRET` (`NFR-SEC-02`).
- [x] Generic error message returned on bad login: "Invalid credentials" (`FR-AUTH-05`).

## 2. Authorization & Access Control (RBAC)
- [x] NestJS `RolesGuard` and `@Roles()` decorator implemented.
- [x] Vue Router `beforeEach` navigation guards enforcing authentication and role permissions.
- [x] Students restricted to managing only their own applications.
- [x] Only advisors permitted to submit application reviews (`FR-REV-05`).
- [x] Advisors prohibited from creating student applications (`AC-3.5`).

## 3. IDOR (Insecure Direct Object Reference) Mitigation
- [x] Cross-tenant isolation: When a student requests an application ID belonging to another student, the API responds with **HTTP 404 Not Found** (instead of 403) to prevent resource existence disclosure (`NFR-SEC-04`).
- [x] Ownership verification executed directly in the database queries or service checks before applying any update or delete.

## 4. Input Validation & Data Integrity
- [x] `class-validator` and `class-transformer` decorators applied to all incoming DTOs (`NFR-SEC-05`).
- [x] NestJS global `ValidationPipe` enabled with `whitelist: true` and `forbidNonWhitelisted: true` to prevent mass assignment vulnerabilities.
- [x] SQL injection mitigated by exclusively using Prisma ORM parameterized queries (`8.4`).
- [x] Atomic status updates on review submission wrapped in Prisma `$transaction` (`FR-REV-02`, `FR-REV-03`).
