<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

function toggleRole() {
  if (authStore.currentUser?.role === 'STUDENT') {
    authStore.switchRole('ADVISOR');
  } else {
    authStore.switchRole('STUDENT');
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <router-link to="/dashboard" class="brand">
        <span class="brand-icon">🎓</span>
        <span>Internship Tracker</span>
      </router-link>

      <nav>
        <ul class="nav-links">
          <li>
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          </li>
          <li v-if="authStore.isStudent">
            <router-link to="/applications/new" class="nav-link">+ New Application</router-link>
          </li>
          <li v-if="!authStore.isAuthenticated">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li v-if="!authStore.isAuthenticated">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>
          <li v-if="authStore.isAuthenticated" style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="user-badge" :title="'Current Role: ' + authStore.currentUser?.role">
              <span>{{ authStore.currentUser?.fullName }}</span>
              <span
                :class="['role-tag', authStore.currentUser?.role.toLowerCase()]"
              >
                {{ authStore.currentUser?.role }}
              </span>
            </div>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              @click="toggleRole"
              title="Click to switch role preview"
            >
              Switch to {{ authStore.currentUser?.role === 'STUDENT' ? 'Advisor' : 'Student' }}
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              @click="handleLogout"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
