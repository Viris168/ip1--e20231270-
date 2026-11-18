# API Contract

Student Internship Tracker — NestJS REST API (Appendix B).  
Data model and relations: see [`ERD.md`](ERD.md).

| | |
|---|---|
| **Base URL (dev)** | `http://localhost:3000` (the Vue app calls it through the Vite proxy at `/api`) |
| **Format** | JSON in and out (`Content-Type: application/json`); dates are ISO 8601 strings in UTC |
| **Auth** | `Authorization: Bearer <accessToken>` on every endpoint except `/auth/*` |
| **IDs** | Auto-increment integers; a non-integer `:id` returns `400` |

> **Milestones.** M2 delivers every endpoint, the validation and the status codes below. JWT guards, role checks
> (`401`/`403` for the wrong role) and ownership checks are switched on in M3. Until then the API acts as the seeded
> student (`id = 1`) for student endpoints and the seeded advisor (`id = 2`) for advisor endpoints.

---

## 1. Endpoint summary

| # | Method | Path | Who | Success | Errors |
|---|---|---|---|---|---|
| 1.1 | `POST` | `/auth/register` | Public | `201` User | `400` |
| 1.2 | `POST` | `/auth/login` | Public | `200` Token + User | `400`, `401` |
| 2.1 | `GET` | `/users/me` | Any | `200` User | `401` |
| 2.2 | `PATCH` | `/users/me` | Any | `200` User | `400`, `401` |
| 3.1 | `GET` | `/applications` | Student (own), Advisor (all) | `200` Page of Application | `400`, `401` |
| 3.2 | `POST` | `/applications` | Student | `201` Application | `400`, `401`, `403` |
| 3.3 | `GET` | `/applications/:id` | Student (own), Advisor | `200` Application + reviews | `400`, `401`, `404` |
| 3.4 | `PATCH` | `/applications/:id` | Student (own) | `200` Application | `400`, `401`, `403`, `404` |
| 3.5 | `DELETE` | `/applications/:id` | Student (own) | `204` | `400`, `401`, `403`, `404` |
| 4.1 | `GET` | `/applications/:id/reviews` | Student (own), Advisor | `200` Review[] | `400`, `401`, `404` |
| 4.2 | `POST` | `/applications/:id/reviews` | Advisor | `201` Review | `400`, `401`, `403`, `404` |
| 4.3 | `PATCH` | `/reviews/:id` | Advisor (author) | `200` Review | `400`, `401`, `403`, `404` |

CRUD coverage: **User** (create, read, update), **Application** (create, read, update, delete), **Review** (create, read,
update). Reviews and accounts are not deleted through the API because the review thread is the academic audit trail.

---

## 2. Conventions

### 2.1 Error format

Every error, including validation errors, uses the same JSON shape (a global exception filter enforces it):

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    { "field": "companyName", "message": "companyName must be at least 2 characters" },
    { "field": "endDate", "message": "End date must be after start date" }
  ],
  "path": "/applications",
  "timestamp": "2026-11-18T03:00:00.000Z"
}
```

| Field | Type | Notes |
|---|---|---|
| `statusCode` | number | Same as the HTTP status |
| `error` | string | HTTP reason phrase (`Bad Request`, `Not Found`, …) |
| `message` | string | One human-readable sentence; safe to show in the UI |
| `errors` | `{ field, message }[]` | Only on `400` validation errors |
| `path` | string | Request path |
| `timestamp` | string | ISO 8601 |

### 2.2 Status codes

| Code | When |
|---|---|
| `200 OK` | Successful read or update |
| `201 Created` | Resource created (body = the new resource) |
| `204 No Content` | Successful delete (empty body) |
| `400 Bad Request` | Body or query fails validation, unknown fields sent, `:id` not an integer, duplicate email |
| `401 Unauthorized` | Missing, invalid or expired token; wrong login credentials |
| `403 Forbidden` | Wrong role, or the action breaks a business rule (locked application, has reviews, …) |
| `404 Not Found` | Resource does not exist **or belongs to another student** (IDOR: never reveal that it exists) |
| `500 Internal Server Error` | Unexpected; body uses the error format with a generic message, no stack trace |

### 2.3 Validation

`ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`: unknown fields return `400`, query
strings are converted to numbers, and fields the client must not set (`id`, `studentId`, `createdAt`, …) are rejected.

### 2.4 Enums

| Enum | Values |
|---|---|
| `Role` | `STUDENT`, `ADVISOR` |
| `ApplicationStatus` | `DRAFT`, `APPLIED`, `INTERVIEWING`, `OFFERED`, `NEEDS_CHANGES`, `APPROVED`, `REJECTED` |
| `ReviewDecision` | `NEEDS_CHANGES`, `APPROVED`, `REJECTED` |

### 2.5 Application status rules

| Status | Set by | Student can edit? | Student can delete? | Advisor can review? |
|---|---|---|---|---|
| `DRAFT` | Student | Yes | Yes (if 0 reviews) | No (not submitted) |
| `APPLIED` | Student | Yes | Yes (if 0 reviews) | Yes |
| `INTERVIEWING` | Student | Yes | No | Yes |
| `OFFERED` | Student | Yes | No | Yes |
| `NEEDS_CHANGES` | Advisor review | Yes; saving sets status back to `APPLIED` | No | No (waiting for student) |
| `APPROVED` | Advisor review | No (locked) | No | No (final) |
| `REJECTED` | Advisor review | No (locked) | No | No (final) |

A student may only write `DRAFT`, `APPLIED`, `INTERVIEWING` or `OFFERED` into `status`. The other three are set only by
a review.

---

## 3. Resource shapes

### User

```json
{
  "id": 1,
  "email": "vireak.sok@student.itc.edu.kh",
  "fullName": "SOK Vireak",
  "role": "STUDENT",
  "studentIdNumber": "e20231270",
  "createdAt": "2026-10-30T07:00:00.000Z"
}
```

`passwordHash` is never returned by any endpoint.

### Application

```json
{
  "id": 3,
  "studentId": 1,
  "companyName": "ABA Bank Digital Division",
  "positionTitle": "Mobile & Cloud Infrastructure Intern",
  "location": "Phnom Penh, Cambodia",
  "stipend": 400,
  "status": "APPLIED",
  "startDate": "2026-08-01T00:00:00.000Z",
  "endDate": "2026-11-01T00:00:00.000Z",
  "createdAt": "2026-05-15T16:20:00.000Z",
  "updatedAt": "2026-05-15T16:20:00.000Z",
  "student": { "id": 1, "fullName": "SOK Vireak", "studentIdNumber": "e20231270" },
  "reviewCount": 0
}
```

The detail endpoint (3.3) adds `reviews: Review[]`, oldest first.

### Review

```json
{
  "id": 7,
  "applicationId": 3,
  "advisorId": 2,
  "comment": "Please attach the supervisor's name and the weekly schedule.",
  "decision": "NEEDS_CHANGES",
  "createdAt": "2026-05-18T09:00:00.000Z",
  "updatedAt": "2026-05-18T09:00:00.000Z",
  "advisor": { "id": 2, "fullName": "Dr. CHAN Dara" }
}
```

---

## 4. Endpoints (numbers match the summary table)

### 1.1 `POST /auth/register`

Creates an account. Public.

| Field | Type | Rules |
|---|---|---|
| `email` | string | Required, valid email, unique (case-insensitive, stored lower-case) |
| `password` | string | Required, 8–72 characters, at least one letter and one digit |
| `fullName` | string | Required, 2–100 characters, trimmed |
| `role` | `Role` | Optional, default `STUDENT` |
| `studentIdNumber` | string | Required when `role = STUDENT`, ignored for `ADVISOR`; 1–20 characters |

```json
{
  "email": "vireak.sok@student.itc.edu.kh",
  "password": "Password123",
  "fullName": "SOK Vireak",
  "studentIdNumber": "e20231270"
}
```

- `201` → User
- `400` → validation errors, or `"message": "Email already registered"`

### 1.2 `POST /auth/login`

| Field | Type | Rules |
|---|---|---|
| `email` | string | Required, valid email |
| `password` | string | Required |

- `200`
  ```json
  { "accessToken": "eyJhbGciOiJIUzI1NiIs...", "expiresIn": 86400, "user": { "id": 1, "email": "...", "fullName": "SOK Vireak", "role": "STUDENT", "studentIdNumber": "e20231270", "createdAt": "..." } }
  ```
- `400` → missing or badly formed fields
- `401` → `"message": "Invalid credentials"` (same message for unknown email and wrong password)

### 2.1 `GET /users/me`

Returns the logged-in user.

- `200` → User
- `401`

### 2.2 `PATCH /users/me`

Updates the logged-in user's profile. All fields optional; at least one required.

| Field | Type | Rules |
|---|---|---|
| `fullName` | string | 2–100 characters |
| `studentIdNumber` | string | 1–20 characters; students only (`400` for advisors) |

`email`, `role` and `password` cannot be changed here (`400`, unknown field).

- `200` → User
- `400`, `401`

### 3.1 `GET /applications`

Paginated list. Students get only their own applications; advisors get all of them. Sorted by `updatedAt` descending.

| Query | Type | Default | Rules |
|---|---|---|---|
| `page` | integer | `1` | ≥ 1 |
| `limit` | integer | `5` | 1–50 |
| `search` | string | — | Case-insensitive partial match on `companyName` **or** `positionTitle`; max 100 chars |
| `status` | `ApplicationStatus` | — | Exact match |

`GET /applications?page=1&limit=5&search=bank&status=APPLIED`

- `200`
  ```json
  {
    "data": [ { "id": 3, "studentId": 1, "companyName": "ABA Bank Digital Division", "...": "...", "reviewCount": 0 } ],
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1,
    "pageSize": 5
  }
  ```
  A `page` past the last page returns `200` with `data: []`.
- `400` → invalid `page`, `limit` or `status`
- `401`

### 3.2 `POST /applications`

Student only. `studentId` is taken from the token, never from the body.

| Field | Type | Rules |
|---|---|---|
| `companyName` | string | Required, 2–120 characters, trimmed |
| `positionTitle` | string | Required, 2–120 characters, trimmed |
| `location` | string | Required, 2–120 characters (`"Remote"` allowed) |
| `stipend` | number \| null | Optional, ≥ 0, ≤ 100000 (USD per month) |
| `status` | `ApplicationStatus` | Optional, default `DRAFT`; only `DRAFT`, `APPLIED`, `INTERVIEWING`, `OFFERED` |
| `startDate` | string | Required, ISO date (`2026-12-01` or full ISO) |
| `endDate` | string | Required, ISO date, strictly after `startDate` |

```json
{
  "companyName": "Smart Axiata",
  "positionTitle": "Junior DevOps Intern",
  "location": "Phnom Penh, Cambodia",
  "stipend": 300,
  "startDate": "2026-12-01",
  "endDate": "2027-03-01"
}
```

- `201` → Application (`status: "DRAFT"`)
- `400` → validation errors; `endDate` ≤ `startDate` gives `{ "field": "endDate", "message": "End date must be after start date" }`
- `401`
- `403` → caller is an advisor

### 3.3 `GET /applications/:id`

- `200` → Application with `reviews` (oldest first, each with `advisor`)
- `400` → `:id` is not an integer
- `401`
- `404` → does not exist, or a student asks for another student's application

### 3.4 `PATCH /applications/:id`

Owning student only. Same fields as 3.2, all optional; at least one required. `startDate`/`endDate` are checked against
each other after merging with the stored values.

Rules, checked in this order:
1. Not found or not owner → `404`
2. Status `APPROVED` or `REJECTED` → `403` `"Approved or rejected applications cannot be modified"`
3. Body invalid → `400`
4. Current status `NEEDS_CHANGES` → saved with `status = APPLIED` (resubmitted), whatever `status` the body sent

- `200` → updated Application
- `400`, `401`, `403`, `404`

### 3.5 `DELETE /applications/:id`

Owning student only.

1. Not found or not owner → `404`
2. Status not `DRAFT`/`APPLIED` → `403` `"Only draft or applied applications can be deleted"`
3. Has at least one review → `403` `"Cannot delete application with existing reviews"`

- `204` (empty body)
- `400`, `401`, `403`, `404`

### 4.1 `GET /applications/:id/reviews`

Review thread for one application, oldest first. Same visibility as 3.3.

- `200` → Review[]
- `400`, `401`, `404`

### 4.2 `POST /applications/:id/reviews`

Advisor only. Creates the review **and** sets `application.status = decision` in one database transaction; if either
write fails, neither is saved.

| Field | Type | Rules |
|---|---|---|
| `comment` | string | Required, 10–2000 characters, trimmed |
| `decision` | `ReviewDecision` | Required: `APPROVED`, `REJECTED` or `NEEDS_CHANGES` |

```json
{ "comment": "Good company and project scope. Approved for 4 academic credits.", "decision": "APPROVED" }
```

- `201` → Review (with `advisor`)
- `400` → short comment, missing or unknown `decision`
- `401`
- `403` → caller is a student, or the application is not reviewable (`DRAFT`, `NEEDS_CHANGES`, `APPROVED`, `REJECTED`):
  `"Application is not awaiting review"`
- `404` → application does not exist

### 4.3 `PATCH /reviews/:id`

The advisor who wrote the review may fix its comment. The `decision` cannot be changed (it already changed the
application status); sending it returns `400`.

| Field | Type | Rules |
|---|---|---|
| `comment` | string | Required, 10–2000 characters |

- `200` → Review
- `400`, `401`
- `403` → caller is a student or not the author
- `404` → review does not exist

---

## 5. Changes from the M1 mock (json-server)

| M1 mock | M2 API |
|---|---|
| `GET /applications?_embed=reviews&_sort=…` returns an array | `GET /applications?page&limit&search&status` returns a page object; filtering moves to the server |
| `studentName` on Application | `student: { id, fullName, studentIdNumber }` |
| `POST /reviews` with `applicationId` in body | `POST /applications/:id/reviews` |
| `advisorName` on Review | `advisor: { id, fullName }` |
| Client sends `createdAt` / `updatedAt` | Server sets them; sending them returns `400` |
| Review decision `PENDING` | Removed; decisions are `APPROVED`, `REJECTED`, `NEEDS_CHANGES` |
