import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ApplicationFormView from '@/views/ApplicationFormView.vue';
import ApplicationDetailView from '@/views/ApplicationDetailView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/applications/new',
      name: 'application-new',
      component: ApplicationFormView
    },
    {
      path: '/applications/:id',
      name: 'application-detail',
      component: ApplicationDetailView
    },
    {
      path: '/applications/:id/edit',
      name: 'application-edit',
      component: ApplicationFormView
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView
    }
  ]
});

export default router;
