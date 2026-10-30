<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useApplicationStore } from '@/stores/applications';
import StatusBadge from '@/components/StatusBadge.vue';
import type { InternshipApplication } from '@/types';

const authStore = useAuthStore();
const appStore = useApplicationStore();

// Pagination state
const currentPage = ref(1);
const pageSize = 5;

// Filtered list based on role
const roleFilteredList = computed(() => {
  if (authStore.isStudent && authStore.currentUser) {
    return appStore.filteredApplications.filter(
      (app) => app.studentId === authStore.currentUser?.id
    );
  }
  return appStore.filteredApplications;
});

const totalPages = computed(() => {
  return Math.ceil(roleFilteredList.value.length / pageSize) || 1;
});

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return roleFilteredList.value.slice(start, start + pageSize);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function canDelete(app: InternshipApplication) {
  return (
    authStore.isStudent &&
    (app.status === 'DRAFT' || app.status === 'APPLIED') &&
    (!app.reviews || app.reviews.length === 0)
  );
}

function canEdit(app: InternshipApplication) {
  return authStore.isStudent && app.status !== 'APPROVED';
}

function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this application?')) {
    appStore.deleteApplication(id);
  }
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          {{ authStore.isStudent ? 'My Internship Applications' : 'Student Applications Overview' }}
        </h1>
        <p class="page-subtitle">
          {{ authStore.isStudent
            ? 'Track, submit, and review the academic accreditation status of your internships'
            : 'Review, comment on, and approve student internship submissions' }}
        </p>
      </div>
      <div v-if="authStore.isStudent">
        <router-link to="/applications/new" class="btn btn-primary">
          + New Application
        </router-link>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Total</span>
        <span class="stat-value">{{ appStore.stats.total }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Draft</span>
        <span class="stat-value" style="color: #64748b;">{{ appStore.stats.draft }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Applied</span>
        <span class="stat-value" style="color: #0284c7;">{{ appStore.stats.applied }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Interviewing</span>
        <span class="stat-value" style="color: #d97706;">{{ appStore.stats.interviewing }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Offered</span>
        <span class="stat-value" style="color: #7c3aed;">{{ appStore.stats.offered }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Approved</span>
        <span class="stat-value" style="color: #16a34a;">{{ appStore.stats.approved }}</span>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="card" style="margin-bottom: 1.5rem; padding: 1rem 1.25rem;">
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <div style="flex: 2; min-width: 240px;">
          <input
            v-model="appStore.searchQuery"
            type="text"
            class="form-input"
            placeholder="Search by company or position..."
          />
        </div>
        <div style="flex: 1; min-width: 180px;">
          <select v-model="appStore.statusFilter" class="form-select">
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFERED">Offered</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th v-if="authStore.isAdvisor">Student</th>
            <th>Location</th>
            <th>Stipend</th>
            <th>Status</th>
            <th>Dates</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedList.length === 0">
            <td :colspan="authStore.isAdvisor ? 8 : 7" style="text-align: center; padding: 3rem; color: var(--text-muted);">
              No applications found matching your criteria.
            </td>
          </tr>
          <tr v-for="app in paginatedList" :key="app.id">
            <td style="font-weight: 600;">{{ app.companyName }}</td>
            <td>{{ app.positionTitle }}</td>
            <td v-if="authStore.isAdvisor">{{ app.studentName || 'Student #' + app.studentId }}</td>
            <td>{{ app.location }}</td>
            <td>{{ app.stipend ? '$' + app.stipend + '/mo' : 'Unpaid' }}</td>
            <td>
              <StatusBadge :status="app.status" />
            </td>
            <td style="font-size: 0.825rem; color: var(--text-muted);">
              {{ app.startDate }} → {{ app.endDate }}
            </td>
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 0.4rem; justify-content: flex-end;">
                <router-link
                  :to="'/applications/' + app.id"
                  class="btn btn-secondary btn-sm"
                >
                  View
                </router-link>
                <router-link
                  v-if="canEdit(app)"
                  :to="'/applications/' + app.id + '/edit'"
                  class="btn btn-secondary btn-sm"
                >
                  Edit
                </router-link>
                <button
                  v-if="canDelete(app)"
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="handleDelete(app.id)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination">
      <span>
        Showing {{ paginatedList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0 }} to
        {{ Math.min(currentPage * pageSize, roleFilteredList.length) }} of
        {{ roleFilteredList.length }} entries
      </span>
      <div class="pagination-controls">
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          Previous
        </button>
        <span style="display: flex; align-items: center; padding: 0 0.5rem; font-weight: 600;">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
