import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/login',
      redirect: { name: 'login' },
    },
    {
      path: '/recuperar-senha',
      name: 'forgot-password',
      component: ForgotPasswordView,
    },
  ],
})

export default router
