<script setup>
import { computed, ref, watch } from 'vue'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import DashboardTopbar from '../components/dashboard/DashboardTopbar.vue'
import CreateTurmaDialog from '../components/turmas/CreateTurmaDialog.vue'
import TurmaQrDialog from '../components/turmas/TurmaQrDialog.vue'
import TurmaStudentsAside from '../components/turmas/TurmaStudentsAside.vue'
import TurmaNoticesAside from '../components/turmas/TurmaNoticesAside.vue'
import NoticeListItem from '../components/turmas/NoticeListItem.vue'
import SendNoticeDialog from '../components/turmas/SendNoticeDialog.vue'
import TurmaChannelBadges from '../components/turmas/TurmaChannelBadges.vue'
import EditTurmaDialog from '../components/turmas/EditTurmaDialog.vue'
import AppDropdownMenu from '../components/ui/AppDropdownMenu.vue'
import { formatNoticeSentAt } from '../utils/noticePreview'
import { useRequireAuth } from '../composables/useRequireAuth'
import { useToast } from '../composables/useToast'
import { fetchAllAvisos } from '../services/avisos'
import { fetchTurmas } from '../services/turmas'
import { avisoDisplayDetail } from '../utils/avisoDisplay'
import {
  countTurmasByYear,
  filterTurmasByYear,
  getLastTurmaYearOptions,
} from '../utils/turmaYearFilter'

const { user, loading } = useRequireAuth()
const toast = useToast()

const displayName = computed(() => user.value?.name ?? '')
const hasTurmas = computed(() => classes.value.length > 0)

const yearFilter = ref('all')
const yearFilterOptions = computed(() => getLastTurmaYearOptions(5))

const filteredClasses = computed(() => filterTurmasByYear(classes.value, yearFilter.value))

const hasFilteredTurmas = computed(() => filteredClasses.value.length > 0)

const yearFilterEmptyMessage = computed(() => {
  if (yearFilter.value === 'all') return ''
  return `Nenhuma turma cadastrada em ${yearFilter.value}.`
})

const classes = ref([])
const turmasLoading = ref(false)

const sentNotices = ref([])
const avisosLoading = ref(false)

const showCreateDialog = ref(false)
const createDialogKey = ref(0)
const showQrDialog = ref(false)
const qrTurma = ref(null)
const showStudentsAside = ref(false)
const selectedTurma = ref(null)
const showNoticeDialog = ref(false)
const noticeDialogKey = ref(0)
const noticeInitialTurmaId = ref(null)
const showEditDialog = ref(false)
const editTurma = ref(null)
const editDialogKey = ref(0)
const showNoticesAside = ref(false)
const noticesTurma = ref(null)

function openCreateDialog() {
  showCreateDialog.value = true
}

function closeCreateDialog() {
  showCreateDialog.value = false
  createDialogKey.value += 1
}

function openQrDialog(turma) {
  qrTurma.value = turma
  showQrDialog.value = true
}

function openEditDialog(turma) {
  editTurma.value = turma
  showEditDialog.value = true
}

function closeEditDialog() {
  showEditDialog.value = false
  editDialogKey.value += 1
}

function closeQrDialog() {
  showQrDialog.value = false
}

function openStudentsAside(turma) {
  selectedTurma.value = turma
  showStudentsAside.value = true
}

function closeStudentsAside() {
  showStudentsAside.value = false
}

function openNoticesAside(turma) {
  noticesTurma.value = turma
  showNoticesAside.value = true
}

function closeNoticesAside() {
  showNoticesAside.value = false
}

function openNoticeDialog(turma = null) {
  noticeInitialTurmaId.value = turma?.id ?? null
  showNoticeDialog.value = true
}

function closeNoticeDialog() {
  showNoticeDialog.value = false
  noticeInitialTurmaId.value = null
  noticeDialogKey.value += 1
}

function prependNotice(aviso) {
  if (!aviso?.id) return
  const exists = sentNotices.value.some((item) => item.id === aviso.id)
  if (!exists) {
    sentNotices.value = [enrichAvisoWithTurma(aviso), ...sentNotices.value]
  }
}

function onNoticeSent(payload) {
  if (payload?.aviso) {
    prependNotice(payload.aviso)
  }

  showNoticeDialog.value = false
  noticeDialogKey.value += 1
  toast.success('Aviso enviado com sucesso')
}

function onNoticeSentFromAside(aviso) {
  prependNotice(aviso)
}

function onFormValidationError(message) {
  toast.error('Validação', message)
}

function onNoticeError() {
  onFormValidationError('Revise os campos antes de enviar o aviso.')
}

async function loadTurmas() {
  turmasLoading.value = true
  try {
    classes.value = await fetchTurmas()
  } catch {
    toast.error('Turmas', 'Não foi possível carregar suas turmas.')
  } finally {
    turmasLoading.value = false
  }
}

function enrichAvisoWithTurma(aviso) {
  const turma = classes.value.find((item) => item.id === aviso.turmaId)
  if (!turma) return aviso

  const turmaName = aviso.turmaName || turma.name
  const turmaMeta = aviso.turmaMeta || turma.meta
  const channels = aviso.channels ?? turma.channels
  const detail = aviso.detail || avisoDisplayDetail({ ...aviso, turmaName })

  return {
    ...aviso,
    turmaName,
    turmaMeta,
    channels,
    detail,
  }
}

async function loadAvisos() {
  avisosLoading.value = true
  try {
    const avisos = await fetchAllAvisos()
    sentNotices.value = avisos.map(enrichAvisoWithTurma)
  } catch {
    sentNotices.value = []
  } finally {
    avisosLoading.value = false
  }
}

watch(
  () => loading.value,
  async (isAuthLoading) => {
    if (!isAuthLoading) {
      await loadTurmas()
      await loadAvisos()
    }
  },
  { immediate: true },
)

function onTurmaUpdated(turma) {
  if (!turma?.id) return

  const index = classes.value.findIndex((item) => item.id === turma.id)
  if (index >= 0) {
    classes.value[index] = turma
  }

  if (selectedTurma.value?.id === turma.id) {
    selectedTurma.value = turma
  }
  if (qrTurma.value?.id === turma.id) {
    qrTurma.value = turma
  }
  if (noticesTurma.value?.id === turma.id) {
    noticesTurma.value = turma
  }

  showEditDialog.value = false
  editDialogKey.value += 1
  toast.success('Turma atualizada com sucesso')
}

function onTurmaCreated(turma) {
  if (!turma?.id) {
    toast.error('Turmas', 'A turma foi criada, mas a resposta da API está incompleta.')
    return
  }

  const exists = classes.value.some((item) => item.id === turma.id)
  if (!exists) {
    classes.value.unshift(turma)
  }

  if (turma.year != null) {
    yearFilter.value = turma.year
  }

  showCreateDialog.value = false
  createDialogKey.value += 1
  toast.success('Turma criada com sucesso')
  openQrDialog(turma)
}
</script>

<template>
  <div class="dashboard-shell">
    <DashboardSidebar active-nav="turmas" />

    <div class="dashboard-main dashboard-main--turmas">
      <DashboardTopbar :user-name="displayName" search-placeholder="Buscar turma" />

      <p v-if="loading || turmasLoading" class="dashboard-loading">Carregando…</p>

      <main v-else class="dashboard-content turmas-page">
        <div class="turmas-page__top">
        <header class="turmas-page-header">
          <div>
            <h1 class="turmas-page-header__title">Minhas turmas</h1>
            <p class="turmas-page-header__lead">Cadastre turmas novas e envie avisos sobre elas</p>
          </div>
          <div class="turmas-page-header__actions">
            <button type="button" class="btn-outline" @click="openCreateDialog">+ Criar turma</button>
            <button
              type="button"
              class="btn-accent-sm"
              :disabled="!hasTurmas"
              :title="hasTurmas ? undefined : 'Crie uma turma antes de enviar avisos'"
              @click="openNoticeDialog()"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 17H9l-1 2h8l-1-2ZM5 9a7 7 0 0 1 14 0c0 5 2 6 2 6H3s2-1 2-6Z" stroke="currentColor"
                  stroke-width="1.6" stroke-linejoin="round" />
              </svg>
              Novo aviso
            </button>
          </div>
        </header>

        <section
          v-if="hasTurmas"
          class="turmas-year-filters"
          aria-label="Filtrar turmas por ano de cadastro"
        >
          <span class="turmas-year-filters__label">Ano do cadastro</span>
          <div class="turmas-year-filters__pills" role="group" aria-label="Ano do cadastro">
            <button
              type="button"
              class="turmas-year-filters__pill"
              :class="{ 'turmas-year-filters__pill--active': yearFilter === 'all' }"
              @click="yearFilter = 'all'"
            >
              Todas
              <span class="turmas-year-filters__count">{{ classes.length }}</span>
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
              <span class="turmas-year-filters__count">{{ countTurmasByYear(classes, year) }}</span>
            </button>
          </div>
        </section>

        <section
          v-if="!hasTurmas"
          class="turmas-empty"
          aria-label="Nenhuma turma cadastrada"
        >
          <p class="turmas-empty__title">Você ainda não tem turmas</p>
          <p class="turmas-empty__text">
            Crie sua primeira turma para compartilhar o QR Code com os alunos e enviar avisos.
          </p>
          <button type="button" class="btn-accent-sm" @click="openCreateDialog">
            + Criar primeira turma
          </button>
        </section>

        <section
          v-else-if="!hasFilteredTurmas"
          class="turmas-filter-empty"
          aria-live="polite"
        >
          <p class="turmas-filter-empty__text">{{ yearFilterEmptyMessage }}</p>
          <button type="button" class="btn-outline" @click="yearFilter = 'all'">
            Ver todas as turmas
          </button>
        </section>

        <section v-else class="class-grid" aria-label="Turmas cadastradas">
          <article
            v-for="turma in filteredClasses"
            :key="turma.id"
            class="class-card"
            :class="`class-card--${turma.accent}`"
          >
            <div class="class-card__head">
              <span class="class-card__icon" aria-hidden="true">
                <svg v-if="turma.icon === 'database'" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" stroke-width="1.6" />
                  <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" stroke="currentColor" stroke-width="1.6" />
                  <path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" stroke="currentColor" stroke-width="1.6" />
                </svg>
                <svg v-else-if="turma.icon === 'list'" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" />
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3 20 8v8l-8 5-8-5V8l8-5Z" stroke="currentColor" stroke-width="1.6"
                    stroke-linejoin="round" />
                </svg>
              </span>
              <div class="class-card__menu">
                <AppDropdownMenu label="Opções da turma">
                  <button type="button" class="app-dropdown__item" @click="openEditDialog(turma)">
                    Editar configurações
                  </button>
                  <button type="button" class="app-dropdown__item" @click="openQrDialog(turma)">
                    Compartilhar QR Code
                  </button>
                </AppDropdownMenu>
              </div>
            </div>
            <h2 class="class-card__name">{{ turma.name }}</h2>
            <p class="class-card__meta">{{ turma.meta }}</p>
            <TurmaChannelBadges class="class-card__channels" :channels="turma.channels" />
            <div class="class-card__actions">
              <button type="button" class="class-card__action" @click="openStudentsAside(turma)">
                Alunos
              </button>
              <button
                type="button"
                class="class-card__action class-card__action--primary"
                @click="openNoticesAside(turma)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 17H9l-1 2h8l-1-2ZM5 9a7 7 0 0 1 14 0c0 5 2 6 2 6H3s2-1 2-6Z" stroke="currentColor"
                    stroke-width="1.6" stroke-linejoin="round" />
                </svg>
                Avisos
              </button>
            </div>
          </article>
        </section>
        </div>

        <section v-if="sentNotices.length" class="sent-panel" aria-labelledby="sent-title">
          <div class="sent-panel__head">
            <h2 id="sent-title" class="sent-panel__title">Todos os avisos enviados</h2>
            <RouterLink :to="{ name: 'avisos' }" class="sent-panel__link">
              Ver painel de avisos →
            </RouterLink>
          </div>
          <div class="sent-panel__scroll">
            <ul class="sent-list">
              <NoticeListItem
                v-for="item in sentNotices"
                :key="item.id"
                :tone="item.tone"
                :icon="item.icon"
                :title="item.title"
                :text="item.text"
                :detail="item.detail"
                :turma-name="item.turmaName"
                :turma-meta="item.turmaMeta"
                :channels="item.channels"
                show-turma
                show-channels
                :sent-at="formatNoticeSentAt(item.sentAt)"
              />
            </ul>
          </div>
        </section>
      </main>
    </div>

    <CreateTurmaDialog
      :key="createDialogKey"
      :open="showCreateDialog"
      @close="closeCreateDialog"
      @created="onTurmaCreated"
    />
    <EditTurmaDialog
      :key="editDialogKey"
      :open="showEditDialog"
      :turma="editTurma"
      @close="closeEditDialog"
      @updated="onTurmaUpdated"
    />
    <TurmaQrDialog :open="showQrDialog" :turma="qrTurma" @close="closeQrDialog" />
    <TurmaStudentsAside :open="showStudentsAside" :turma="selectedTurma" @close="closeStudentsAside" />
    <TurmaNoticesAside
      :open="showNoticesAside"
      :turma="noticesTurma"
      @close="closeNoticesAside"
      @sent="onNoticeSentFromAside"
    />
    <SendNoticeDialog :key="noticeDialogKey" :open="showNoticeDialog" :turmas="classes"
      :initial-turma-id="noticeInitialTurmaId" @close="closeNoticeDialog" @sent="onNoticeSent" @error="onNoticeError" />
  </div>
</template>

<style scoped>
@import '../styles/dashboard.css';
@import '../styles/turmas.css';
</style>
