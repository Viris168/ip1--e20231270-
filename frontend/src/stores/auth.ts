import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, UserRole } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // Static demo user for Check 1
  const currentUser = ref<User | null>({
    id: 1,
    email: 'vireak.sok@itc.edu.kh',
    fullName: 'SOK Vireak',
    role: 'STUDENT',
    studentIdNumber: 'e20231270'
  });

  const isAuthenticated = computed(() => currentUser.value !== null);
  const isStudent = computed(() => currentUser.value?.role === 'STUDENT');
  const isAdvisor = computed(() => currentUser.value?.role === 'ADVISOR');

  function switchRole(role: UserRole) {
    if (role === 'STUDENT') {
      currentUser.value = {
        id: 1,
        email: 'vireak.sok@itc.edu.kh',
        fullName: 'SOK Vireak',
        role: 'STUDENT',
        studentIdNumber: 'e20231270'
      };
    } else {
      currentUser.value = {
        id: 99,
        email: 'thavorac.chun@itc.edu.kh',
        fullName: 'Prof. CHUN Thavorac',
        role: 'ADVISOR',
        studentIdNumber: null
      };
    }
  }

  function login(email: string, role: UserRole = 'STUDENT') {
    currentUser.value = {
      id: role === 'STUDENT' ? 1 : 99,
      email: email || 'student@itc.edu.kh',
      fullName: role === 'STUDENT' ? 'SOK Vireak' : 'Prof. CHUN Thavorac',
      role,
      studentIdNumber: role === 'STUDENT' ? 'e20231270' : null
    };
  }

  function logout() {
    currentUser.value = null;
  }

  return {
    currentUser,
    isAuthenticated,
    isStudent,
    isAdvisor,
    switchRole,
    login,
    logout
  };
});
