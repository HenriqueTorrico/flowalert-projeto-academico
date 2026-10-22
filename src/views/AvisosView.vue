<script setup>
import { computed, ref, watch } from 'vue'
import AvisoFeedCard from '../components/avisos/AvisoFeedCard.vue'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import DashboardTopbar from '../components/dashboard/DashboardTopbar.vue'
import SendNoticeDialog from '../components/turmas/SendNoticeDialog.vue'
import { useRequireAuth } from '../composables/useRequireAuth'
import { useToast } from '../composables/useToast'
import { fetchAllAvisos } from '../services/avisos'
import { fetchTurmas } from '../services/turmas'
import { filterAvisosList } from '../utils/avisoFilters'
import { getLastTurmaYearOptions } from '../utils/turmaYearFilter'

const { user, loading } = useRequireAuth()
const toast = useToast()

const displayName = computed(() => user.value?.name ?? '')

const avisos = ref([])
const turmas = ref([])
const pageLoading = ref(false)

const turmaFilter = ref('all')
const yearFilter = ref('all')
const search = ref('')

const yearFilterOptions = computed(() => getLastTurmaYearOptions(5))

const turmaOptions = computed(() => [
  { value: 'all', label: 'Todas as turmas' },
  ...turmas.value.map((turma) => ({ value: String(turma.id), label: turma.name })),
])

const filteredAvisos = computed(() =>
  filterAvisosList(avisos.value, {
    turmaId: turmaFilter.value,
    year: yearFilter.value,
    search: search.value,
  }),
)

const hasTurmas = computed(() => turmas.value.length > 0)

const showNoticeDialog = ref(false)
const noticeDialogKey = ref(0)
const noticeInitialTurmaId = ref(null)

async function loadPage() {
  pageLoading.value = true
  try {
    const [turmasData, avisosData] = await Promise.all([fetchTurmas(), fetchAllAvisos()])
    turmas.value = turmasData
    avisos.value = avisosData
  } catch {
    toast.error('Avisos', 'Não foi possível carregar os avisos.')
    avisos.value = []
  } finally {
    pageLoading.value = false
  }
}

watch(
  () => loading.value,
  (isAuthLoading) => {
    if (!isAuthLoading) {
      loadPage()
    }
  },
  { immediate: true },
)

function openNoticeDialog() {
  noticeInitialTurmaId.value = null
  showNoticeDialog.value = true
}

function closeNoticeDialog() {
  showNoticeDialog.value = false
  noticeInitialTurmaId.value = null
  noticeDialogKey.value += 1
}

function onNoticeSent(payload) {
  if (payload?.aviso) {
    const exists = avisos.value.some((item) => item.id === payload.aviso.id)
    if (!exists) {
      avisos.value = [payload.aviso, ...avisos.value]
    }
  }
  closeNoticeDialog()
  toast.success('Aviso enviado com sucesso')
}
</script>

<template>
  <div class="dashboard-shell">
    <DashboardSidebar active-nav="avisos" />

    <div class="dashboard-main">
      <DashboardTopbar :user-name="displayName" search-placeholder="Buscar aviso" />

      <p v-if="loading || pageLoading" class="dashboard-loading">Carregando…</p>

      <main v-else class="dashboard-content">
        <header class="avisos-page-header">
          <div>
            <h1 class="avisos-page-header__title">Avisos</h1>
            <p class="avisos-page-header__lead">
              Acompanhe entregas, visualizações e o histórico completo dos avisos enviados.
            </p>
          </div>
          <button
            type="button"
            class="btn-accent-sm"
            :disabled="!hasTurmas"
            :title="hasTurmas ? undefined : 'Crie uma turma antes de enviar avisos'"
            @click="openNoticeDialog"
          >
            Novo aviso
          </button>
        </header>

        <section class="avisos-filters" aria-label="Filtros de avisos">
          <div class="avisos-filters__row">
            <div class="avisos-filters__field">
              <label class="avisos-filters__label" for="avisos-turma-filter">Turma</label>
              <select id="avisos-turma-filter" v-model="turmaFilter" class="avisos-filters__select">
                <option v-for="option in turmaOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="avisos-filters__field" style="flex: 1">
              <label class="avisos-filters__label" for="avisos-search">Buscar</label>
              <input
                id="avisos-search"
                v-model="search"
                type="search"
                class="avisos-filters__search"
                placeholder="Título, turma ou texto do aviso"
              />
            </div>
          </div>

          <div class="turmas-year-filters" aria-label="Filtrar por ano de envio">
            <span class="turmas-year-filters__label">Ano do envio</span>
            <div class="turmas-year-filters__pills" role="group">
              <button
                type="button"
                class="turmas-year-filters__pill"
                :class="{ 'turmas-year-filters__pill--active': yearFilter === 'all' }"
                @click="yearFilter = 'all'"
              >
                Todos
              </button>
              <button
                v-for="year in yearFilterOptions"
                :key="year"
                type="button"
                class="turmas-year-filters__pill"
                :class="{ 'turmas-year-filters__pill--active': yearFilter === year }"
                @click="yearFilter = year"
              >
                {{ year }}
              </button>
            </div>
          </div>
        </section>

        <section v-if="!filteredAvisos.length" class="avisos-empty" aria-live="polite">
          <p class="avisos-empty__text">
            {{ avisos.length ? 'Nenhum aviso corresponde aos filtros.' : 'Você ainda não enviou avisos.' }}
          </p>
        </section>

        <section v-else class="avisos-feed" aria-label="Lista de avisos">
          <AvisoFeedCard v-for="item in filteredAvisos" :key="item.id" :aviso="item" />
        </section>
      </main>
    </div>

    <SendNoticeDialog
      :key="noticeDialogKey"
      :open="showNoticeDialog"
      :turmas="turmas"
      :initial-turma-id="noticeInitialTurmaId"
      @close="closeNoticeDialog"
      @sent="onNoticeSent"
    />
  </div>
</template>

<style scoped>
@import '../styles/dashboard.css';
@import '../styles/turmas.css';
@import '../styles/avisos.css';
</style>
