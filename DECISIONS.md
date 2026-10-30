# Decisions

One line per real design choice.

- 2026-10-20: Prisma instead of TypeORM: typed client, simpler migrations, and reliable atomic transactions
- 2026-10-24: Vue 3 Composition API with `<script setup lang="ts">`: stronger TypeScript inference and clean reactivity
- 2026-10-26: Pinia instead of Vuex: idiomatic TypeScript typing, zero mutation boilerplate, and lightweight store composition
- 2026-10-28: JWT stateless authentication: decoupled REST API communication with Bearer token authorization
- 2026-10-30: HTTP 404 instead of 403 on student cross-access: strict IDOR mitigation to prevent resource enumeration
