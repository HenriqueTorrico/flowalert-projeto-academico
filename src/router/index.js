import { createRouter, createWebHistory } from 'vue-router'
import { getStoredToken, logout } from '../services/auth'
import LoginView from '../views/LoginView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import DashboardView from '../views/DashboardView.vue'
import TurmasView from '../views/TurmasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/login',
      redirect: { name: 'login' },
    },
    {
      path: '/recuperar-senha',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/turmas',
      name: 'turmas',
      component: TurmasView,
      meta: { requiresAuth: true },
    },
    {
      path: '/entrar-turma/:id',
      name: 'join-turma',
      component: () => import('../views/JoinTurmaView.vue'),
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: async () => {
        await logout()
        return { name: 'login' }
      },
    },
  ],
})

router.beforeEach((to) => {
  const isLoggedIn = Boolean(getStoredToken())

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return { name: 'dashboard' }
  }
})

export default router
