# Test Plan

## Topic: Student Internship Tracker
- **Student**: SOK Vireak (`e20231270`)
- **Frameworks**: Vitest (Frontend), Jest + Supertest (Backend)

---

## 1. Backend Testing Strategy (Jest + Supertest)

### 1.1 Authentication & Authorization (`auth.e2e-spec.ts`)
- [ ] **TC-AUTH-01**: Register new student account with valid fields → HTTP 201 Created (password excluded from response).
- [ ] **TC-AUTH-02**: Register duplicate email → HTTP 400 Bad Request ("Email already registered").
- [ ] **TC-AUTH-03**: Register with weak password (< 8 chars or missing digits/letters) → HTTP 400.
- [ ] **TC-AUTH-04**: Login with correct credentials → HTTP 200 with JWT accessToken and user object.
- [ ] **TC-AUTH-05**: Login with incorrect credentials → HTTP 401 with generic "Invalid credentials".

### 1.2 Internship Application Management (`application.e2e-spec.ts`)
- [ ] **TC-APP-01**: Student creates application with valid dates and company details → HTTP 201 Created.
- [ ] **TC-APP-02**: Student creates application where endDate < startDate → HTTP 400 ("End date must be after start date").
- [ ] **TC-APP-03**: Advisor attempts to create application → HTTP 403 Forbidden.
- [ ] **TC-APP-04**: Student fetches list → returns only their applications with pagination metadata.
- [ ] **TC-APP-05**: Advisor fetches list → returns department-wide applications.
- [ ] **TC-APP-06**: Search by company or position query (case-insensitive partial match).
- [ ] **TC-APP-07**: Filter by status query (`DRAFT`, `APPLIED`, `APPROVED`).
- [ ] **TC-APP-08**: IDOR Prevention: Student A queries Student B's application → HTTP 404 Not Found.
- [ ] **TC-APP-09**: Update application details while not approved → HTTP 200.
- [ ] **TC-APP-10**: Attempt to update approved application → HTTP 403 Forbidden ("Approved applications cannot be modified").
- [ ] **TC-APP-11**: Delete draft application without reviews → HTTP 204 No Content.
- [ ] **TC-APP-12**: Attempt to delete application with reviews → HTTP 403 Forbidden ("Cannot delete application with existing reviews").

### 1.3 Review Management (`review.e2e-spec.ts`)
- [ ] **TC-REV-01**: Advisor submits review with valid comment and APPROVED decision → HTTP 201, application atomically transitions to APPROVED.
- [ ] **TC-REV-02**: Advisor submits review with REJECTED decision → HTTP 201, application transitions to REJECTED.
- [ ] **TC-REV-03**: Student attempts to submit review → HTTP 403 Forbidden.
- [ ] **TC-REV-04**: Review comment < 10 characters → HTTP 400 Bad Request.

---

## 2. Frontend Unit Testing Strategy (Vitest)

### 2.1 Component & Validation Tests
- [ ] **TC-FE-01**: Registration form client-side email format regex and password policy validation.
- [ ] **TC-FE-02**: Create Application form date comparison validation (`endDate > startDate`).
- [ ] **TC-FE-03**: Conditional rendering of Advisor review form (visible only for Advisor role).
- [ ] **TC-FE-04**: Application status badge color rendering based on state.
- [ ] **TC-FE-05**: Pinia auth store login and logout state clearing.
