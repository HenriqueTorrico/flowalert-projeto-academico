<template>
  <div class="dashboard-shell">
    <DashboardSidebar :user-name="displayName" active-nav="home" />

    <div class="dashboard-main">
      <DashboardTopbar :user-name="displayName" />

      <p v-if="loading" class="dashboard-loading">Carregando…</p>

      <main v-else class="dashboard-content">
        <header class="dashboard-greeting">
          <h1 class="dashboard-greeting__title">Olá, {{ firstName }}</h1>
          <p class="dashboard-greeting__lead">
            {{ dateLine }} - aqui está o resumo dos seus avisos.
          </p>
        </header>

        <section class="dashboard-stats" aria-label="Resumo">
          <article class="stat-card">
            <span class="stat-card__label">Avisos enviados hoje</span>
            <span class="stat-card__value stat-card__value--gold">4</span>
          </article>
          <article class="stat-card">
            <span class="stat-card__label">Alunos notificados</span>
            <span class="stat-card__value stat-card__value--teal">132</span>
          </article>
          <article class="stat-card">
            <span class="stat-card__label">Mudanças de sala esta semana</span>
            <span class="stat-card__value stat-card__value--navy">2</span>
          </article>
        </section>

        <section class="recent-panel" aria-labelledby="recent-title">
          <h2 id="recent-title" class="recent-panel__title">Avisos recentes</h2>
          <ul class="recent-list">
            <li v-for="item in recentNotices" :key="item.id" class="recent-list__item">
              <span class="recent-list__dot" :class="`recent-list__dot--${item.tone}`" aria-hidden="true" />
              {{ item.text }}
            </li>
          </ul>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import DashboardTopbar from '../components/dashboard/DashboardTopbar.vue'
import { useRequireAuth } from '../composables/useRequireAuth'
import { formatDashboardDate, getFirstName } from '../utils/userDisplay'

const { user, loading } = useRequireAuth()

const displayName = computed(() => user.value?.name ?? '')
const firstName = computed(() => getFirstName(displayName.value))
const dateLine = computed(() => formatDashboardDate())

const recentNotices = [
  {
    id: 1,
    tone: 'wine',
    text: 'Mudança de sala: Banco de Dados agora é na sala 202A (antes 300B)',
  },
  {
    id: 2,
    tone: 'amber',
    text: 'Não haverá aula de Estrutura de Dados hoje',
  },
  {
    id: 3,
    tone: 'teal',
    text: 'Aviso geral enviado para Engenharia de Software',
  },
]
</script>

<style scoped>
@import '../styles/dashboard.css';
</style>
