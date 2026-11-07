# Project Milestones

Course: **Internet Programming I (IP1)**  
Student: **SOK Vireak** (`e20231270`) — Group: `I4-GIC-B`  
Repository: `https://github.com/Viris168/ip1--e20231270-.git`  

---

## M0 Proposal (Week 3)

Git Tag: `m0`

### Checklist
- [x] PROPOSAL.md follows the template in Appendix A
- [x] Problem stated in two sentences; target users and at least 2 roles named
- [x] 6–10 user stories, with acceptance criteria for the 3 most important
- [x] MVP scope split into must-have and nice-to-have
- [x] Entity list with main attributes and relations; at least 3 entities
- [x] Chosen stretch feature named

### Explain your design
**Which story did you cut from the MVP, and why?**

I cut **Story 8 (Offer letter / internship agreement PDF upload)** from the MVP scope.

**Why:** Handling file uploads adds non-trivial infrastructure requirements early in the project lifecycle, such as multipart form handling, file size and MIME-type validation, secure local or object storage (e.g. AWS S3/MinIO), and security risks related to malicious file execution. For the core internship tracking workflow, structured textual and numeric data (company name, role, stipend, dates, and locations) are sufficient for students to document their progress and for academic advisors to evaluate whether the internship meets graduation criteria. By deferring file uploads to a post-MVP phase, I ensure that the primary focus stays on delivering clean relational data modeling, robust role-based access control (RBAC), IDOR security defenses, and end-to-end API and UI tests.

---

## M1 Frontend Prototype (Week 5)

Git Tag: `m1`

### Checklist
- [x] Wireframes (photo or tool) of the main screens in `docs/` — `docs/wireframes/*.png`
- [x] Vue 3 + TypeScript app created with Vite; strict mode on; ESLint passes — `"strict": true` in `tsconfig.json`, `npm run lint` (flat config in `eslint.config.js`)
- [x] At least 4 routes, including a detail page with a route parameter — `/login`, `/register`, `/dashboard`, `/applications/new`, `/applications/:id`, `/applications/:id/edit`, 404
- [x] At least one form with client-side validation — application form (per-field errors, end date after start date), review form, login/register
- [x] A Pinia store and a service layer calling a mock API (json-server or local JSON) — `stores/applications.ts` → `services/applications.service.ts` → `services/http.ts` → json-server (`mock/db.json`)
- [x] Loading, empty and error states visible — `LoadingState`, `EmptyState`, `ErrorState` (with retry) on dashboard, detail and edit pages; 404 page for unknown IDs

### Explain your design
**What state lives in the store and what stays inside a component? Why?**

**In the store (`stores/applications.ts`, `stores/auth.ts`):**
- The applications loaded from the API (`applications`, `current`) and the request status (`loading`, `error`, `errorStatus`). Several screens use the same data: the dashboard list and stats, the detail page and the edit form. Keeping one copy means a change on one screen (creating, editing or deleting an application, or posting a review) shows up everywhere, and no screen holds an out-of-date version.
- The dashboard filters (`searchQuery`, `statusFilter`). They live in the store so the user's search is still there after opening a detail page and pressing "Back".
- The logged-in user and role (`auth` store). The navbar, the dashboard, the detail page and later the route guards all need it.
- Derived values (`filteredApplications`, `stats`) are `computed` in the store, so every view gets the same counts.

**Inside the component:**
- Form fields and their validation errors (`ApplicationFormView`, review form, login/register). They are a draft. Until the user submits, the rest of the app should not see half-typed values, and leaving the page should discard them.
- UI-only flags such as `submitting`, success and error messages, and the dashboard's `currentPage`. Only that one screen needs them, and they should reset when the user comes back.

**Rule I followed:** if more than one screen needs the data, or it must outlive the component, it goes in the store. Otherwise it stays local. Components never call `fetch` directly; they call store actions, which use the service layer. When the NestJS API replaces json-server in M3, only `services/` changes.

---

## M2 Backend API (Week 7)

Git Tag: `m2`

### Checklist
- [ ] API contract (Appendix B) and ERD in `docs/`
- [ ] NestJS API with one module per resource (controller, service, DTOs)
- [ ] Prisma schema, migrations and a seed script; PostgreSQL runs in Docker
- [ ] CRUD endpoints for at least 3 entities, with server-side validation
- [ ] Correct status codes (200, 201, 204, 400, 404) and consistent error JSON

### Explain your design
**Why did you choose this relation (1-N or N-N) between two of your entities?**
*(To be completed during M2)*

---

## M3 Integrated App (Week 9)

Git Tag: `m3`

### Checklist
- [ ] Frontend calls the real API; the mock is gone
- [ ] Registration, login, logout; passwords hashed
- [ ] Guards on the API for authentication, roles and ownership
- [ ] Route guards in Vue; the UI hides what a role cannot do
- [ ] Security checklist from week 9 run on your app; findings fixed or listed
- [ ] 3-minute demo in the practice session

### Explain your design
**Where is the token stored in the browser, and what attack does that choice protect against or expose?**
*(To be completed during M3)*

---

## M4 Feature Complete (Week 12)

Git Tag: `m4`

### Checklist
- [ ] Every MVP user story works end to end
- [ ] Stretch feature implemented
- [ ] Unit tests for core services; e2e tests for the main endpoints; all green
- [ ] Swagger documentation available

### Explain your design
**Pick one test. What bug would it catch?**
*(To be completed during M4)*

---

## M5 Deployed (Week 14)

Git Tag: `m5`

### Checklist
- [ ] Dockerfiles for frontend and backend; `docker-compose.yml` for the whole stack
- [ ] Running on the school server with HTTPS, or starting locally with one `docker compose up`
- [ ] GitHub Actions workflow runs lint, tests and build on every push
- [ ] README complete (Appendix B); no secrets in the repository

### Explain your design
**What happens, step by step, between git push and your change being live?**
*(To be completed during M5)*
