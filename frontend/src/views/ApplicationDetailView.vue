<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useApplicationStore } from '@/stores/applications';
import StatusBadge from '@/components/StatusBadge.vue';
import type { ReviewDecision } from '@/types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const appStore = useApplicationStore();

const applicationId = computed(() => Number(route.params.id));
const application = computed(() => appStore.getById(applicationId.value));

// Advisor review submission state
const reviewDecision = ref<ReviewDecision>('APPROVED');
const reviewComment = ref('');
const reviewError = ref('');
const reviewSuccess = ref('');

function handleSubmitReview() {
  reviewError.value = '';
  reviewSuccess.value = '';

  if (!reviewComment.value.trim() || reviewComment.value.trim().length < 10) {
    reviewError.value = 'Review comment must be at least 10 characters.';
    return;
  }

  const added = appStore.addReview(applicationId.value, reviewComment.value.trim(), reviewDecision.value);
  if (added) {
    reviewSuccess.value = 'Review submitted successfully and application status updated.';
    reviewComment.value = '';
  }
}
</script>

<template>
  <div v-if="!application" style="text-align: center; padding: 4rem 1rem;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">Application Not Found</h2>
    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">The requested internship application could not be located.</p>
    <router-link to="/dashboard" class="btn btn-primary">Return to Dashboard</router-link>
  </div>

  <div v-else style="max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.75rem;">
    <!-- Top Action Bar -->
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <router-link to="/dashboard" class="btn btn-secondary btn-sm">
        ← Back to Dashboard
      </router-link>
      <div style="display: flex; gap: 0.5rem;">
        <router-link
          v-if="application.status !== 'APPROVED'"
          :to="'/applications/' + application.id + '/edit'"
          class="btn btn-secondary btn-sm"
        >
          Edit Application
        </router-link>
      </div>
    </div>

    <!-- Application Summary Card -->
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
        <div>
          <h1 style="font-size: 1.6rem; font-weight: 700; color: var(--text-main);">
            {{ application.companyName }}
          </h1>
          <p style="font-size: 1.1rem; color: var(--text-muted); margin-top: 0.25rem;">
            {{ application.positionTitle }}
          </p>
        </div>
        <StatusBadge :status="application.status" />
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
        <div>
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Student</span>
          <div style="font-weight: 600; margin-top: 0.2rem;">{{ application.studentName || 'Student #' + application.studentId }}</div>
        </div>

        <div>
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Location</span>
          <div style="font-weight: 600; margin-top: 0.2rem;">{{ application.location }}</div>
        </div>

        <div>
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Stipend</span>
          <div style="font-weight: 600; margin-top: 0.2rem;">
            {{ application.stipend ? '$' + application.stipend + ' / month' : 'Unpaid / Voluntary' }}
          </div>
        </div>

        <div>
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Duration</span>
          <div style="font-weight: 600; margin-top: 0.2rem;">
            {{ application.startDate }} to {{ application.endDate }}
          </div>
        </div>
      </div>
    </div>

    <!-- Advisor Reviews Section -->
    <div class="card">
      <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem;">
        Advisor Feedback Thread
      </h2>

      <div v-if="!application.reviews || application.reviews.length === 0" style="padding: 2rem; text-align: center; color: var(--text-muted); background: #f8fafc; border-radius: var(--radius);">
        No reviews have been submitted for this application yet.
      </div>

      <!-- Chronological Review Thread -->
      <div v-else style="display: flex; flex-direction: column; gap: 1rem;">
        <div
          v-for="rev in application.reviews"
          :key="rev.id"
          style="padding: 1rem 1.25rem; background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius);"
        >
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="font-weight: 600; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>👨‍🏫 {{ rev.advisorName || 'Academic Advisor' }}</span>
              <StatusBadge :status="rev.decision" />
            </div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              {{ new Date(rev.createdAt).toLocaleDateString() }}
            </span>
          </div>
          <p style="color: #334155; font-size: 0.925rem; white-space: pre-line;">
            {{ rev.comment }}
          </p>
        </div>
      </div>

      <!-- Advisor Review Submission Form -->
      <div v-if="authStore.isAdvisor" style="margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
        <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem;">
          Post Advisor Review & Decision
        </h3>

        <div v-if="reviewError" style="background: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: var(--radius); margin-bottom: 1rem; font-size: 0.875rem;">
          {{ reviewError }}
        </div>
        <div v-if="reviewSuccess" style="background: #dcfce7; color: #15803d; padding: 0.75rem; border-radius: var(--radius); margin-bottom: 1rem; font-size: 0.875rem;">
          {{ reviewSuccess }}
        </div>

        <form @submit.prevent="handleSubmitReview">
          <div class="form-group">
            <label class="form-label" for="review-decision">Decision *</label>
            <select id="review-decision" v-model="reviewDecision" class="form-select">
              <option value="APPROVED">APPROVED (Internship formally accredited)</option>
              <option value="PENDING">PENDING (Under evaluation)</option>
              <option value="NEEDS_CHANGES">NEEDS_CHANGES (Additional documentation required)</option>
              <option value="REJECTED">REJECTED (Does not meet course criteria)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="review-comment">Feedback Comment *</label>
            <textarea
              id="review-comment"
              v-model="reviewComment"
              rows="3"
              class="form-textarea"
              placeholder="Provide constructive feedback and justification for this decision (min 10 characters)..."
              required
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
