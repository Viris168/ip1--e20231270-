<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('vireak.sok@itc.edu.kh');
const password = ref('Password123');
const role = ref<UserRole>('STUDENT');
const errorMessage = ref('');

function handleSubmit() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password';
    return;
  }
  authStore.login(email.value, role.value);
  router.push('/dashboard');
}
</script>

<template>
  <div style="max-width: 440px; margin: 3rem auto;">
    <div class="card">
      <div style="text-align: center; margin-bottom: 2rem;">
        <span style="font-size: 2.5rem;">🎓</span>
        <h1 style="font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem;">Welcome Back</h1>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Sign in to your Internship Tracker account</p>
      </div>

      <div v-if="errorMessage" style="background: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: var(--radius); margin-bottom: 1rem; font-size: 0.875rem;">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Role</label>
          <div style="display: flex; gap: 0.5rem;">
            <button
              type="button"
              :class="['btn', role === 'STUDENT' ? 'btn-primary' : 'btn-secondary']"
              style="flex: 1;"
              @click="role = 'STUDENT'; email = 'vireak.sok@itc.edu.kh';"
            >
              Student
            </button>
            <button
              type="button"
              :class="['btn', role === 'ADVISOR' ? 'btn-primary' : 'btn-secondary']"
              style="flex: 1;"
              @click="role = 'ADVISOR'; email = 'thavorac.chun@itc.edu.kh';"
            >
              Advisor
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="login-email">Email Address</label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="student@itc.edu.kh"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="login-password">Password</label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
          Sign In
        </button>
      </form>

      <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted);">
        Don't have an account?
        <router-link to="/register" style="color: var(--primary); font-weight: 600; text-decoration: none;">
          Register here
        </router-link>
      </div>
    </div>
  </div>
</template>
