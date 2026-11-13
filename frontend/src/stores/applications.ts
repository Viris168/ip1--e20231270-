import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { InternshipApplication, ApplicationStatus, Review } from '@/types';
import { applicationsService, type ApplicationInput } from '@/services/applications.service';
import { ApiError } from '@/services/http';

export const useApplicationStore = defineStore('applications', () => {
  // Server data, cached so the dashboard and detail page share one source of truth
  const applications = ref<InternshipApplication[]>([]);
  const current = ref<InternshipApplication | null>(null);

  // Request status for the views (loading / error states)
  const loading = ref(false);
  const error = ref<string | null>(null);
  const errorStatus = ref<number | null>(null);

  // Dashboard filters survive navigating to a detail page and back
  const searchQuery = ref('');
  const statusFilter = ref<ApplicationStatus | 'ALL'>('ALL');
  const viewMode = ref<'table' | 'cards'>('table');

  const filteredApplications = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return applications.value.filter((app) => {
      const matchesSearch =
        query === '' ||
        app.companyName.toLowerCase().includes(query) ||
        app.positionTitle.toLowerCase().includes(query);

      const matchesStatus = statusFilter.value === 'ALL' || app.status === statusFilter.value;

      return matchesSearch && matchesStatus;
    });
  });

  const stats = computed(() => {
    const count = (status: ApplicationStatus) => applications.value.filter((a) => a.status === status).length;
    return {
      total: applications.value.length,
      draft: count('DRAFT'),
      applied: count('APPLIED'),
      interviewing: count('INTERVIEWING'),
      offered: count('OFFERED'),
      approved: count('APPROVED'),
      rejected: count('REJECTED')
    };
  });

  function setError(e: unknown) {
    error.value = e instanceof Error ? e.message : 'Unexpected error.';
    errorStatus.value = e instanceof ApiError ? e.status : null;
  }

  function startRequest() {
    loading.value = true;
    error.value = null;
    errorStatus.value = null;
  }

  async function fetchAll() {
    startRequest();
    try {
      applications.value = await applicationsService.list();
    } catch (e) {
      setError(e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id: number) {
    startRequest();
    current.value = null;
    try {
      current.value = await applicationsService.get(id);
    } catch (e) {
      setError(e);
    } finally {
      loading.value = false;
    }
  }

  // Mutations throw so the calling form can show the error next to its fields
  async function addApplication(data: ApplicationInput) {
    const created = await applicationsService.create(data);
    applications.value.unshift({ ...created, reviews: [] });
    return created;
  }

  async function updateApplication(id: number, data: Partial<ApplicationInput>) {
    const updated = await applicationsService.update(id, data);
    const idx = applications.value.findIndex((a) => a.id === id);
    if (idx !== -1) {
      applications.value[idx] = { ...applications.value[idx], ...updated };
    }
    return updated;
  }

  async function deleteApplication(id: number) {
    await applicationsService.remove(id);
    applications.value = applications.value.filter((a) => a.id !== id);
  }

  async function addReview(applicationId: number, comment: string, decision: Review['decision']) {
    const review = await applicationsService.addReview({
      applicationId,
      advisorId: 99,
      advisorName: 'Prof. CHUN Thavorac',
      comment,
      decision
    });

    // FR-REV-02 / FR-REV-03: a final decision also moves the application status.
    // The mock needs two calls; the real API (M3) will do this in one transaction.
    if (decision === 'APPROVED' || decision === 'REJECTED') {
      await updateApplication(applicationId, { status: decision });
    }
    // Refresh without clearing `current`, so the page doesn't flash a loading state
    current.value = await applicationsService.get(applicationId);
    return review;
  }

  return {
    applications,
    current,
    loading,
    error,
    errorStatus,
    searchQuery,
    statusFilter,
    viewMode,
    filteredApplications,
    stats,
    fetchAll,
    fetchById,
    addApplication,
    updateApplication,
    deleteApplication,
    addReview
  };
});
