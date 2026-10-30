<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const fullName = ref('');
const email = ref('');
const studentIdNumber = ref('');
const password = ref('');
const role = ref<UserRole>('STUDENT');
const errorMessage = ref('');

function handleSubmit() {
  if (!fullName.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill out all required fields';
    return;
  }
  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters';
    return;
  }
  authStore.login(email.value, role.value);
  router.push('/dashboard');
}
</script>

<template>
  <div style="max-width: 480px; margin: 2rem auto;">
    <div class="card">
      <div style="text-align: center; margin-bottom: 2rem;">
        <span style="font-size: 2.5rem;">🎓</span>
        <h1 style="font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem;">Create an Account</h1>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Join ITC Student Internship Tracker</p>
      </div>

      <div v-if="errorMessage" style="background: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: var(--radius); margin-bottom: 1rem; font-size: 0.875rem;">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">I am registering as</label>
          <div style="display: flex; gap: 0.5rem;">
            <button
              type="button"
              :class="['btn', role === 'STUDENT' ? 'btn-primary' : 'btn-secondary']"
              style="flex: 1;"
              @click="role = 'STUDENT'"
            >
              Student
            </button>
            <button
              type="button"
              :class="['btn', role === 'ADVISOR' ? 'btn-primary' : 'btn-secondary']"
              style="flex: 1;"
              @click="role = 'ADVISOR'"
            >
              Academic Advisor
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-fullname">Full Name *</label>
          <input
            id="reg-fullname"
            v-model="fullName"
            type="text"
            class="form-input"
            placeholder="e.g. SOK Vireak"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-email">Email Address *</label>
          <input
            id="reg-email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="e.g. vireak.sok@itc.edu.kh"
            required
          />
        </div>

        <div v-if="role === 'STUDENT'" class="form-group">
          <label class="form-label" for="reg-studentid">Student ID Number</label>
          <input
            id="reg-studentid"
            v-model="studentIdNumber"
            type="text"
            class="form-input"
            placeholder="e.g. e20231270"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password">Password *</label>
          <input
            id="reg-password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Min 8 characters (at least 1 letter & 1 digit)"
            required
          />
          <div class="form-hint">At least 8 characters with letters and numbers.</div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
          Register Account
        </button>
      </form>

      <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted);">
        Already have an account?
        <router-link to="/login" style="color: var(--primary); font-weight: 600; text-decoration: none;">
          Sign in
        </router-link>
      </div>
    </div>
  </div>
</template>
