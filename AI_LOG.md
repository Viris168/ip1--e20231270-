# AI log

One entry per meaningful AI use.

## 2026-10-25 · Specification and Data Model Design
Tool: Antigravity
Asked: convert SRS requirements into ER data model and Prisma schema definitions for User, Application, and Review
Kept: schema models, relations, field constraints, and status enums
Rejected: composite primary keys for reviews; used auto-increment integer IDs for cleaner REST URL routing
Checked by: verified schema against the course SRS PDF and ran prisma validate

## 2026-10-28 · Repository Structure & Wireframes Setup
Tool: Antigravity
Asked: structure repository according to course guidelines and generate SVG/PNG wireframes for required views
Kept: exact directory hierarchy (docs, frontend, backend, workflows) and screen flow designs
Rejected: heavy UI component library templates; opted for lightweight, semantic components with custom CSS
Checked by: compared folder layout against course template and inspected wireframes in browser

## 2026-10-30 · Full-Stack Architecture & Auth Scaffold
Tool: Antigravity
Asked: scaffold NestJS modular backend with JWT auth guard and Vue 3 Pinia auth store
Kept: NestJS modules (Auth, Application, Review, Prisma) and Vue Router beforeEach route guard logic
Rejected: storing JWT tokens directly in localStorage without expiration check; kept in reactive Pinia store with validated expiration
Checked by: verified route redirection for unauthenticated access and test requests with curl
