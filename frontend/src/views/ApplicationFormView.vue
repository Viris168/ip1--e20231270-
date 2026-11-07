<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useApplicationStore } from '@/stores/applications';
import LoadingState from '@/components/LoadingState.vue';
import ErrorState from '@/components/ErrorState.vue';
import type { ApplicationStatus } from '@/types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const appStore = useApplicationStore();

const isEditMode = computed(() => !!route.params.id);
const applicationId = computed(() => Number(route.params.id));

// Form fields live in the component: they are a draft until the user submits,
// and nothing else in the app should see half-typed values.
const form = reactive({
  companyName: '',
  positionTitle: '',
  location: '',
  stipend: null as number | null,
  startDate: '',
  endDate: '',
  status: 'DRAFT' as ApplicationStatus
});

type Field = 'companyName' | 'positionTitle' | 'location' | 'stipend' | 'startDate' | 'endDate';
const errors = reactive<Partial<Record<Field, string>>>({});
const submitted = ref(false);
const submitting = ref(false);
const submitError = ref('');

function validate(): boolean {
  for (const key of Object.keys(errors) as Field[]) delete errors[key];

  if (form.companyName.trim().length < 2) errors.companyName = 'Company name must be at least 2 characters.';
  if (form.positionTitle.trim().length < 2) errors.positionTitle = 'Position title must be at least 2 characters.';
  if (!form.location.trim()) errors.location = 'Location is required.';
  if (form.stipend !== null && (Number.isNaN(form.stipend) || form.stipend < 0)) {
    errors.stipend = 'Stipend must be a positive number.';
  }
  if (!form.startDate) errors.startDate = 'Start date is required.';
  if (!form.endDate) errors.endDate = 'End date is required.';
  else if (form.startDate && form.startDate >= form.endDate) errors.endDate = 'End date must be after start date.';

  return Object.keys(errors).length === 0;
}

// After the first submit attempt, re-validate as the user types
function onInput() {
  if (submitted.value) validate();
}

onMounted(async () => {
  if (!isEditMode.value) return;
  await appStore.fetchById(applicationId.value);
  const existing = appStore.current;
  if (!existing) return;
  form.companyName = existing.companyName;
  form.positionTitle = existing.positionTitle;
  form.location = existing.location;
  form.stipend = existing.stipend ?? null;
  form.startDate = existing.startDate;
  form.endDate = existing.endDate;
  form.status = existing.status;
});

async function handleSubmit() {
  submitted.value = true;
  submitError.value = '';
  if (!validate()) return;

  const payload = {
    companyName: form.companyName.trim(),
    positionTitle: form.positionTitle.trim(),
    location: form.location.trim(),
    stipend: form.stipend === null || Number.isNaN(form.stipend) ? null : form.stipend,
    startDate: form.startDate,
    endDate: form.endDate,
    status: form.status
  };

  submitting.value = true;
  try {
    if (isEditMode.value) {
      await appStore.updateApplication(applicationId.value, payload);
      router.push(`/applications/${applicationId.value}`);
    } else {
      const created = await appStore.addApplication({
        ...payload,
        studentId: authStore.currentUser?.id ?? 1,
        studentName: authStore.currentUser?.fullName ?? 'SOK Vireak'
      });
      router.push(`/applications/${created.id}`);
    }
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Could not save the application.';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div style="max-width: 680px; margin: 1.5rem auto;">
    <LoadingState v-if="isEditMode && appStore.loading" message="Loading application..." />

    <ErrorState
      v-else-if="isEditMode && appStore.error"
      :message="appStore.error"
      @retry="appStore.fetchById(applicationId)"
    />

    <div v-else class="card">
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

      <div v-if="submitError" class="alert-error" role="alert">
        {{ submitError }}
      </div>

      <form novalidate @submit.prevent="handleSubmit" @input="onInput">
        <div class="form-group">
          <label class="form-label" for="app-company">Company Name *</label>
          <input
            id="app-company"
            v-model="form.companyName"
            type="text"
            :class="['form-input', { 'is-invalid': errors.companyName }]"
            placeholder="e.g. Smart Axiata Co., Ltd."
          />
          <div v-if="errors.companyName" class="form-error">{{ errors.companyName }}</div>
        </div>

        <div class="form-group">
          <label class="form-label" for="app-position">Position Title *</label>
          <input
            id="app-position"
            v-model="form.positionTitle"
            type="text"
            :class="['form-input', { 'is-invalid': errors.positionTitle }]"
            placeholder="e.g. Backend Software Engineering Intern"
          />
          <div v-if="errors.positionTitle" class="form-error">{{ errors.positionTitle }}</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="app-location">Location *</label>
            <input
              id="app-location"
              v-model="form.location"
              type="text"
              :class="['form-input', { 'is-invalid': errors.location }]"
              placeholder="e.g. Phnom Penh or Remote"
            />
            <div v-if="errors.location" class="form-error">{{ errors.location }}</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="app-stipend">Monthly Stipend (USD)</label>
            <input
              id="app-stipend"
              v-model.number="form.stipend"
              type="number"
              min="0"
              step="10"
              :class="['form-input', { 'is-invalid': errors.stipend }]"
              placeholder="e.g. 350"
            />
            <div v-if="errors.stipend" class="form-error">{{ errors.stipend }}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="app-start-date">Start Date *</label>
            <input
              id="app-start-date"
              v-model="form.startDate"
              type="date"
              :class="['form-input', { 'is-invalid': errors.startDate }]"
            />
            <div v-if="errors.startDate" class="form-error">{{ errors.startDate }}</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="app-end-date">End Date *</label>
            <input
              id="app-end-date"
              v-model="form.endDate"
              type="date"
              :class="['form-input', { 'is-invalid': errors.endDate }]"
            />
            <div v-if="errors.endDate" class="form-error">{{ errors.endDate }}</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="app-status">Application Status</label>
          <select id="app-status" v-model="form.status" class="form-select">
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
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
