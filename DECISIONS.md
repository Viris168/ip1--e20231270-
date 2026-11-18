# Decisions

One line per real design choice.

- 2026-10-20: Prisma instead of TypeORM: typed client, simpler migrations, and reliable atomic transactions
- 2026-10-24: Vue 3 Composition API with `<script setup lang="ts">`: stronger TypeScript inference and clean reactivity
- 2026-10-26: Pinia instead of Vuex: idiomatic TypeScript typing, zero mutation boilerplate, and lightweight store composition
- 2026-10-28: JWT stateless authentication: decoupled REST API communication with Bearer token authorization
- 2026-10-30: HTTP 404 instead of 403 on student cross-access: strict IDOR mitigation to prevent resource enumeration
- 2026-11-07: json-server mock behind a Vite `/api` proxy and a service layer: views/stores stay unchanged when the real API replaces the mock in M3
- 2026-11-18: One error JSON shape (`statusCode`, `error`, `message`, `errors[]`, `path`, `timestamp`) from a global exception filter: the frontend reads one format for every failure
- 2026-11-18: Review decision is `APPROVED | REJECTED | NEEDS_CHANGES` only (no `PENDING`) and always becomes the application status; the decision cannot be edited afterwards
- 2026-11-18: `ON DELETE RESTRICT` on every foreign key: the database itself refuses to delete an application that has reviews
