<template>
  <div class="dashboard-shell">
    <DashboardSidebar active-nav="home" />

    <div class="dashboard-main">
      <DashboardTopbar :user-name="displayName" />

      <p v-if="pageLoading" class="dashboard-loading">Carregando…</p>

      <main v-else class="dashboard-content">
        <header class="dashboard-greeting">
          <h1 class="dashboard-greeting__title">Olá, {{ firstName }}</h1>
          <p class="dashboard-greeting__lead">
            {{ dateLine }} - aqui está o resumo dos seus avisos.
          </p>
        </header>

        <section class="dashboard-stats" aria-label="Resumo">
          <article class="stat-card">
            <span class="stat-card__label">Turmas cadastradas</span>
            <span class="stat-card__value stat-card__value--purple">
              {{ turmasCountDisplay }}
            </span>
          </article>
          <article class="stat-card">
            <span class="stat-card__label">Avisos enviados hoje</span>
            <span class="stat-card__value stat-card__value--gold">
              {{ statDisplay(metrics.avisosToday) }}
            </span>
          </article>
          <article class="stat-card">
            <span class="stat-card__label">Alunos nas turmas avisadas hoje</span>
            <span class="stat-card__value stat-card__value--teal">
              {{ statDisplay(metrics.studentsNotifiedToday) }}
            </span>
          </article>
          <article class="stat-card">
            <span class="stat-card__label">Mudanças de sala esta semana</span>
            <span class="stat-card__value stat-card__value--navy">
              {{ statDisplay(metrics.roomChangesThisWeek) }}
            </span>
          </article>
        </section>

        <section class="recent-panel" aria-labelledby="recent-title">
          <h2 id="recent-title" class="recent-panel__title">Avisos recentes</h2>
          <p v-if="recentNotices.length === 0" class="recent-panel__empty">
            Nenhum aviso enviado ainda. Crie um aviso em Turmas.
          </p>
          <ul v-else class="recent-list">
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
import { computed, ref, watch } from 'vue'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import DashboardTopbar from '../components/dashboard/DashboardTopbar.vue'
import { useRequireAuth } from '../composables/useRequireAuth'
import { fetchAllAvisos } from '../services/avisos'
import { fetchTurmas } from '../services/turmas'
import { buildDashboardMetrics } from '../utils/dashboardStats'
import { formatDashboardDate, getFirstName } from '../utils/userDisplay'

const { user, loading: authLoading } = useRequireAuth()

const displayName = computed(() => user.value?.name ?? '')
const firstName = computed(() => getFirstName(displayName.value))
const dateLine = computed(() => formatDashboardDate())

const dashboardLoading = ref(false)
const turmasCount = ref(null)
const metrics = ref({
  avisosToday: 0,
  studentsNotifiedToday: 0,
  roomChangesThisWeek: 0,
})
const recentNotices = ref([])

const pageLoading = computed(() => authLoading.value || dashboardLoading.value)

const turmasCountDisplay = computed(() => {
  if (dashboardLoading.value) return '…'
  if (turmasCount.value == null) return '-'
  return turmasCount.value
})

function statDisplay(value) {
  if (dashboardLoading.value) return '…'
  if (value == null) return '-'
  return value
}

async function loadDashboard() {
  dashboardLoading.value = true
  try {
    const [turmas, avisos] = await Promise.all([fetchTurmas(), fetchAllAvisos()])
    const turmasById = new Map(turmas.map((turma) => [turma.id, turma]))
    turmasCount.value = turmas.length
    const built = buildDashboardMetrics(avisos, turmasById)
    metrics.value = {
      avisosToday: built.avisosToday,
      studentsNotifiedToday: built.studentsNotifiedToday,
      roomChangesThisWeek: built.roomChangesThisWeek,
    }
    recentNotices.value = built.recentNotices
  } catch {
    turmasCount.value = null
    metrics.value = {
      avisosToday: null,
      studentsNotifiedToday: null,
      roomChangesThisWeek: null,
    }
    recentNotices.value = []
  } finally {
    dashboardLoading.value = false
  }
}

watch(
  () => authLoading.value,
  (isAuthLoading) => {
    if (!isAuthLoading) {
      loadDashboard()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
@import '../styles/dashboard.css';
</style>
