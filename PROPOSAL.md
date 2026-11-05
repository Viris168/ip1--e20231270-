# Student Internship Tracker

## Problem
University students struggle to organize their internship search and track academic approval deadlines across scattered emails and spreadsheets. Academic advisors lack a centralized dashboard to review student applications, verify internship criteria, and provide traceable feedback for academic credit.

## Users and roles
- **Student**: Registers an account, creates and manages internship application records (company, position, dates, stipend, location), updates application progress stages, and views advisor feedback.
- **Advisor**: Browses all student applications, filters and searches submissions, reviews application details, and issues official decisions (`APPROVED`, `REJECTED`, `NEEDS_CHANGES`) with written feedback.

## User stories
1. **As a student**, I want to register an account with my email, password, full name, and student ID, so that I can access the internship tracker and manage my applications.  
   *Accepted when*: email is a valid format and unique (duplicate returns HTTP 400); password is at least 8 characters with at least one letter and digit; role defaults to `STUDENT`; response returns HTTP 201 without `passwordHash`.
2. **As a registered user**, I want to log in with my email and password, so that I receive a secure JWT token to access protected features.  
   *Accepted when*: valid credentials return HTTP 200 with JWT access token and user info; invalid credentials return HTTP 401 with generic message; token is automatically sent in Bearer Authorization header for subsequent API calls.
3. **As a student**, I want to create a new internship application record with company, position, dates, location, and stipend, so that I can submit it for academic tracking and approval.  
   *Accepted when*: `companyName` and `positionTitle` are required (≥ 2 characters); `startDate` is strictly before `endDate`; status defaults to `DRAFT`; returns HTTP 201 on success; only `STUDENT` role can create (advisor attempts return HTTP 403).
4. **As a student or advisor**, I want to browse a paginated list of applications with keyword search and status filters, so that I can quickly find relevant applications.  
   *Accepted when*: students see only their own applications; advisors see all students' applications; status filter dropdown immediately updates results; search queries match `companyName` or `positionTitle` case-insensitively; pagination metadata returns `totalItems`, `totalPages`, and `currentPage` (default 5 items per page).
5. **As a student**, I want to edit my draft or active internship application, so that my submitted information remains accurate.  
   *Accepted when*: only the owning student can edit (cross-student access returns HTTP 404 for IDOR mitigation); applications with status `APPROVED` or `REJECTED` are locked against modification (HTTP 403); editing an application in `NEEDS_CHANGES` and resubmitting it sets its status back to `APPLIED`; valid updates return HTTP 200.
6. **As a student**, I want to delete an unreviewed draft application, so that I can keep my tracker clean.  
   *Accepted when*: only applications in `DRAFT` or `APPLIED` status with zero advisor reviews can be deleted; deleting applications with existing reviews or approval returns HTTP 403; successful deletion returns HTTP 204.
7. **As an academic advisor**, I want to submit a review with feedback comments and a formal decision (`APPROVED`, `REJECTED`, `NEEDS_CHANGES`), so that the student receives academic feedback and their application status is updated.  
   *Accepted when*: only `ADVISOR` role can post reviews (`STUDENT` attempts return HTTP 403); comment is required (≥ 10 characters); decision is required and must be one of `APPROVED`, `REJECTED`, `NEEDS_CHANGES` (anything else returns HTTP 400); the review is saved and the parent application status is set to the same value in one database transaction; returns HTTP 201.
8. **As a student**, I want to upload a PDF of my official internship offer letter or contract, so that my academic advisor can verify employer signatures before granting final approval. *(Cut from MVP)*

## MVP scope
- **Must have**: Story 1 (User Registration), Story 2 (User Login), Story 3 (Create Internship Application), Story 4 (View Applications with Search, Filter & Pagination), Story 5 (Update Application Details), Story 6 (Delete Draft Application), Story 7 (Advisor Review & Decision).
- **Nice to have**: Story 8 (Offer Letter PDF Upload), Real-time WebSocket notifications when an advisor reviews an application, automated email reminders before internship report deadlines.

## Entities
| Entity | Main attributes | Relations |
|---|---|---|
| **User** | `id`, `email`, `passwordHash`, `fullName`, `role` (`STUDENT`, `ADVISOR`), `studentIdNumber`, `createdAt` | Has many `Application` records (as student); has many `Review` records (as advisor) |
| **Application** | `id`, `studentId`, `companyName`, `positionTitle`, `location`, `stipend`, `status` (`DRAFT`, `APPLIED`, `INTERVIEWING`, `OFFERED`, `NEEDS_CHANGES`, `APPROVED`, `REJECTED`; default `DRAFT`), `startDate`, `endDate`, `createdAt`, `updatedAt` | Belongs to `User` (`studentId` → `User.id`); has many `Review` records |
| **Review** | `id`, `applicationId`, `advisorId`, `comment`, `decision` (`APPROVED`, `REJECTED`, `NEEDS_CHANGES`), `createdAt` | Belongs to `Application` (`applicationId` → `Application.id`); belongs to `User` (`advisorId` → `User.id`) |

## Stretch feature
- **Chosen stretch feature**: Search, filter and pagination.
- **What it does in this app**: Both students and advisors can search applications by company name or position title (case-insensitive partial match), filter results by application status (`DRAFT`, `APPLIED`, `INTERVIEWING`, `OFFERED`, `NEEDS_CHANGES`, `APPROVED`, `REJECTED`), and navigate large result sets using paginated API queries with page size controls and page numbers.

## Repository
https://github.com/Viris168/ip1--e20231270-.git
