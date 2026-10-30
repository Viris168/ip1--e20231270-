<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useApplicationStore } from '@/stores/applications';
import type { ApplicationStatus } from '@/types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const appStore = useApplicationStore();

const isEditMode = computed(() => !!route.params.id);
const applicationId = computed(() => Number(route.params.id));

const companyName = ref('');
const positionTitle = ref('');
const location = ref('');
const stipend = ref<number | null>(null);
const startDate = ref('');
const endDate = ref('');
const status = ref<ApplicationStatus>('DRAFT');

const errorMessage = ref('');

onMounted(() => {
  if (isEditMode.value) {
    const existing = appStore.getById(applicationId.value);
    if (!existing) {
      router.push('/dashboard');
      return;
    }
    companyName.value = existing.companyName;
    positionTitle.value = existing.positionTitle;
    location.value = existing.location;
    stipend.value = existing.stipend ?? null;
    startDate.value = existing.startDate;
    endDate.value = existing.endDate;
    status.value = existing.status;
  }
});

function handleSubmit() {
  errorMessage.value = '';

  if (!companyName.value.trim() || companyName.value.trim().length < 2) {
    errorMessage.value = 'Company name must be at least 2 characters.';
    return;
  }

  if (!positionTitle.value.trim() || positionTitle.value.trim().length < 2) {
    errorMessage.value = 'Position title must be at least 2 characters.';
    return;
  }

  if (!location.value.trim()) {
    errorMessage.value = 'Location is required.';
    return;
  }

  if (!startDate.value || !endDate.value) {
    errorMessage.value = 'Both start date and end date are required.';
    return;
  }

  if (new Date(startDate.value) >= new Date(endDate.value)) {
    errorMessage.value = 'End date must be after start date.';
    return;
  }

  if (isEditMode.value) {
    appStore.updateApplication(applicationId.value, {
      companyName: companyName.value,
      positionTitle: positionTitle.value,
      location: location.value,
      stipend: stipend.value,
      startDate: startDate.value,
      endDate: endDate.value,
      status: status.value
    });
    router.push(`/applications/${applicationId.value}`);
  } else {
    const created = appStore.addApplication({
      studentId: authStore.currentUser?.id ?? 1,
      studentName: authStore.currentUser?.fullName ?? 'SOK Vireak',
      companyName: companyName.value,
      positionTitle: positionTitle.value,
      location: location.value,
      stipend: stipend.value,
      startDate: startDate.value,
      endDate: endDate.value,
      status: status.value
    });
    router.push(`/applications/${created.id}`);
  }
}
</script>

<template>
  <div style="max-width: 680px; margin: 1.5rem auto;">
    <div class="card">
      <div class="page-header" style="margin-bottom: 1.25rem;">
        <div>
          <h1 class="page-title">{{ isEditMode ? 'Edit Internship Application' : 'New Internship Application' }}</h1>
          <p class="page-subtitle">
            {{ isEditMode
              ? 'Update the internship details and status'
              : 'Enter internship details for academic accreditation tracking' }}
          </p>
        </div>
      </div>

      <div
        v-if="errorMessage"
        style="background: #fee2e2; color: #b91c1c; padding: 0.75rem 1rem; border-radius: var(--radius); margin-bottom: 1.25rem; font-size: 0.875rem;"
      >
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label" for="app-company">Company Name *</label>
          <input
            id="app-company"
            v-model="companyName"
            type="text"
            class="form-input"
            placeholder="e.g. Smart Axiata Co., Ltd."
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="app-position">Position Title *</label>
          <input
            id="app-position"
            v-model="positionTitle"
            type="text"
            class="form-input"
            placeholder="e.g. Backend Software Engineering Intern"
            required
          />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="app-location">Location *</label>
            <input
              id="app-location"
              v-model="location"
              type="text"
              class="form-input"
              placeholder="e.g. Phnom Penh or Remote"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="app-stipend">Monthly Stipend (USD)</label>
            <input
              id="app-stipend"
              v-model.number="stipend"
              type="number"
              min="0"
              step="10"
              class="form-input"
              placeholder="e.g. 350"
            />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="app-start-date">Start Date *</label>
            <input
              id="app-start-date"
              v-model="startDate"
              type="date"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="app-end-date">End Date *</label>
            <input
              id="app-end-date"
              v-model="endDate"
              type="date"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="app-status">Application Status</label>
          <select id="app-status" v-model="status" class="form-select">
            <option value="DRAFT">DRAFT (Initial preparation)</option>
            <option value="APPLIED">APPLIED (Submitted to employer)</option>
            <option value="INTERVIEWING">INTERVIEWING (In interview rounds)</option>
            <option value="OFFERED">OFFERED (Received internship offer)</option>
            <option v-if="isEditMode" value="APPROVED">APPROVED (Faculty approved)</option>
            <option v-if="isEditMode" value="REJECTED">REJECTED (Declined / Disqualified)</option>
          </select>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
          <router-link to="/dashboard" class="btn btn-secondary">
            Cancel
          </router-link>
          <button type="submit" class="btn btn-primary">
            {{ isEditMode ? 'Save Changes' : 'Create Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
