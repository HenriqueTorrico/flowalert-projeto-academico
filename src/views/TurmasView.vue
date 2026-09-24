<script setup>
import { computed, ref } from 'vue'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import DashboardTopbar from '../components/dashboard/DashboardTopbar.vue'
import CreateTurmaDialog from '../components/turmas/CreateTurmaDialog.vue'
import TurmaQrDialog from '../components/turmas/TurmaQrDialog.vue'
import TurmaStudentsAside from '../components/turmas/TurmaStudentsAside.vue'
import SendNoticeDialog from '../components/turmas/SendNoticeDialog.vue'
import { buildSentNoticeRecord } from '../utils/noticePreview'
import { useRequireAuth } from '../composables/useRequireAuth'
import { useToast } from '../composables/useToast'

const { user, loading } = useRequireAuth()
const toast = useToast()

const displayName = computed(() => user.value?.name ?? '')

const accentCycle = ['orange', 'green', 'purple']
let nextTurmaId = 4

const classes = ref([
  {
    id: 1,
    accent: 'orange',
    icon: 'database',
    name: 'Banco de Dados - A',
    meta: 'Sala 300B · Manhã',
  },
  {
    id: 2,
    accent: 'green',
    icon: 'list',
    name: 'Estrutura de Dados',
    meta: 'Sala 105 · Tarde',
  },
  {
    id: 3,
    accent: 'purple',
    icon: 'cube',
    name: 'Engenharia de Software',
    meta: 'Lab 02 · Manhã',
  },
])

let nextNoticeId = 3

const sentNotices = ref([
  {
    id: 1,
    tone: 'wine',
    icon: 'arrow',
    title: 'Mudança de sala',
    text: 'Banco de Dados - A: aula agora na sala 202A (antes 300B)',
  },
  {
    id: 2,
    tone: 'amber',
    icon: 'x',
    title: 'Sem aula',
    text: 'Estrutura de Dados: não haverá aula hoje',
  },
])

const showCreateDialog = ref(false)
const createDialogKey = ref(0)
const showQrDialog = ref(false)
const qrTurma = ref(null)
const showStudentsAside = ref(false)
const selectedTurma = ref(null)
const showNoticeDialog = ref(false)
const noticeDialogKey = ref(0)
const noticeInitialTurmaId = ref(null)

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

function openNoticeDialog(turma = null) {
  noticeInitialTurmaId.value = turma?.id ?? null
  showNoticeDialog.value = true
}

function closeNoticeDialog() {
  showNoticeDialog.value = false
  noticeInitialTurmaId.value = null
  noticeDialogKey.value += 1
}

function onNoticeSent(payload) {
  const record = buildSentNoticeRecord({
    scenario: payload.scenario,
    turmaName: payload.turma?.name,
    currentRoom: payload.currentRoom,
    newRoom: payload.newRoom,
    date: payload.date,
    message: payload.message,
  })

  sentNotices.value.unshift({
    id: nextNoticeId++,
    ...record,
  })

  showNoticeDialog.value = false
  noticeDialogKey.value += 1
  toast.success('Aviso enviado com sucesso')
}

function onFormValidationError(message) {
  toast.error('Validação', message)
}

function onNoticeError() {
  onFormValidationError('Revise os campos antes de enviar o aviso.')
}

function onTurmaCreateError() {
  onFormValidationError('Revise os campos antes de criar a turma.')
}

function onTurmaCreated(values) {
  const id = nextTurmaId++
  const accent = accentCycle[id % accentCycle.length]
  const turma = {
    id,
    accent,
    icon: 'list',
    name: values.name,
    meta: `${values.room} · ${values.period}`,
  }

  classes.value.unshift(turma)
  showCreateDialog.value = false
  createDialogKey.value += 1
  toast.success('Turma criada com sucesso')
  openQrDialog(turma)
}
</script>

<template>
  <div class="dashboard-shell">
    <DashboardSidebar :user-name="displayName" active-nav="turmas" />

    <div class="dashboard-main">
      <DashboardTopbar :user-name="displayName" search-placeholder="Buscar turma" />

      <p v-if="loading" class="dashboard-loading">Carregando…</p>

      <main v-else class="dashboard-content">
        <header class="turmas-page-header">
          <div>
            <h1 class="turmas-page-header__title">Minhas turmas</h1>
            <p class="turmas-page-header__lead">Cadastre turmas novas e envie avisos sobre elas</p>
          </div>
          <div class="turmas-page-header__actions">
            <button type="button" class="btn-outline" @click="openCreateDialog">+ Criar turma</button>
            <button type="button" class="btn-accent-sm" @click="openNoticeDialog()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 17H9l-1 2h8l-1-2ZM5 9a7 7 0 0 1 14 0c0 5 2 6 2 6H3s2-1 2-6Z" stroke="currentColor"
                  stroke-width="1.6" stroke-linejoin="round" />
              </svg>
              Novo aviso
            </button>
          </div>
        </header>

        <section class="class-grid" aria-label="Turmas cadastradas">
          <article v-for="turma in classes" :key="turma.id" class="class-card" :class="`class-card--${turma.accent}`">
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
              <button type="button" class="class-card__share" aria-label="Compartilhar QR Code da turma"
                @click="openQrDialog(turma)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8.5 12.5 12 9l3.5 3.5M12 15V9M6 18h12a2 2 0 0 0 2-2v-3M6 6h12a2 2 0 0 1 2 2v3"
                    stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
            <h2 class="class-card__name">{{ turma.name }}</h2>
            <p class="class-card__meta">{{ turma.meta }}</p>
            <div class="class-card__actions">
              <button type="button" class="class-card__action" @click="openStudentsAside(turma)">
                Visualizar
              </button>
              <button type="button" class="class-card__action class-card__action--primary"
                @click="openNoticeDialog(turma)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 17H9l-1 2h8l-1-2ZM5 9a7 7 0 0 1 14 0c0 5 2 6 2 6H3s2-1 2-6Z" stroke="currentColor"
                    stroke-width="1.6" stroke-linejoin="round" />
                </svg>
                Enviar aviso
              </button>
            </div>
          </article>
        </section>

        <section class="sent-panel" aria-labelledby="sent-title">
          <h2 id="sent-title" class="sent-panel__title">Avisos enviados</h2>
          <ul class="sent-list">
            <li v-for="item in sentNotices" :key="item.id" class="sent-list__item">
              <span class="sent-list__icon" :class="`sent-list__icon--${item.tone}`" aria-hidden="true">
                <template v-if="item.icon === 'arrow'">↰</template>
                <template v-else-if="item.icon === 'bell'">!</template>
                <template v-else>×</template>
              </span>
              <div class="sent-list__body">
                <p class="sent-list__title">{{ item.title }}</p>
                <p class="sent-list__text">{{ item.text }}</p>
              </div>
            </li>
          </ul>
        </section>
      </main>
    </div>

    <CreateTurmaDialog :key="createDialogKey" :open="showCreateDialog" @close="closeCreateDialog"
      @created="onTurmaCreated" @error="onTurmaCreateError" />
    <TurmaQrDialog :open="showQrDialog" :turma="qrTurma" @close="closeQrDialog" />
    <TurmaStudentsAside :open="showStudentsAside" :turma="selectedTurma" @close="closeStudentsAside" />
    <SendNoticeDialog :key="noticeDialogKey" :open="showNoticeDialog" :turmas="classes"
      :initial-turma-id="noticeInitialTurmaId" @close="closeNoticeDialog" @sent="onNoticeSent" @error="onNoticeError" />
  </div>
</template>

<style scoped>
@import '../styles/dashboard.css';
@import '../styles/turmas.css';
</style>
