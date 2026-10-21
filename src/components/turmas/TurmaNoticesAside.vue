<script setup>
import { computed, ref, watch } from 'vue'
import AppActionButton from '../ui/AppActionButton.vue'
import NoticeListItem from './NoticeListItem.vue'
import SendNoticeDialog from './SendNoticeDialog.vue'
import { useToast } from '../../composables/useToast'
import { fetchTurmaAvisos } from '../../services/avisos'
import { formatNoticeSentAt } from '../../utils/noticePreview'
import AppSkeleton from '../ui/AppSkeleton.vue'

const toast = useToast()

const props = defineProps({
  open: { type: Boolean, default: false },
  turma: { type: Object, default: null },
})

const emit = defineEmits(['close', 'sent'])

const showSendDialog = ref(false)
const sendDialogKey = ref(0)
const avisos = ref([])
const loading = ref(false)
const loadRequestId = ref(0)

const isEmpty = computed(() => !loading.value && avisos.value.length === 0)

watch(
  () => [props.open, props.turma?.id],
  ([isOpen, turmaId]) => {
    if (!isOpen) {
      showSendDialog.value = false
      sendDialogKey.value += 1
      avisos.value = []
      loadRequestId.value += 1
      return
    }

    if (turmaId) {
      loadAvisos(turmaId)
    }
  },
)

async function loadAvisos(turmaId) {
  const requestId = ++loadRequestId.value
  loading.value = true

  try {
    const data = await fetchTurmaAvisos(turmaId)
    if (requestId !== loadRequestId.value) return
    avisos.value = data
  } catch {
    if (requestId !== loadRequestId.value) return
    avisos.value = []
    toast.error('Avisos', 'Não foi possível carregar os avisos da turma.')
  } finally {
    if (requestId === loadRequestId.value) {
      loading.value = false
    }
  }
}

function onClose() {
  emit('close')
}

function openSendDialog() {
  showSendDialog.value = true
}

function closeSendDialog() {
  showSendDialog.value = false
  sendDialogKey.value += 1
}

function onNoticeSent(payload) {
  if (payload?.aviso) {
    const exists = avisos.value.some((item) => item.id === payload.aviso.id)
    if (!exists) {
      avisos.value = [payload.aviso, ...avisos.value]
    }
    emit('sent', payload.aviso)
  }

  closeSendDialog()
  toast.success('Aviso enviado com sucesso')
}

function onNoticeError() {
  toast.error('Validação', 'Revise os campos antes de enviar o aviso.')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="aside-overlay">
      <div v-if="open" class="aside-root">
        <button type="button" class="aside-backdrop" aria-label="Fechar" @click="onClose" />

        <aside class="aside-panel" role="dialog" aria-modal="true" aria-labelledby="notices-aside-title">
          <header class="aside-panel__header">
            <div class="aside-panel__heading">
              <h2 id="notices-aside-title" class="aside-panel__title">Avisos da turma</h2>
              <p v-if="turma" class="aside-panel__subtitle">{{ turma.name }}</p>
            </div>
            <button type="button" class="aside-panel__close" aria-label="Fechar painel" @click="onClose">
              ×
            </button>
          </header>

          <div class="notices-aside__toolbar">
            <AppActionButton type="button" variant="accent-sm" @click="openSendDialog">
              Novo aviso
            </AppActionButton>
          </div>

          <section class="notices-aside__list-wrap" aria-label="Avisos enviados">
            <div v-if="loading" class="notices-aside__loading" aria-busy="true">
              <AppSkeleton v-for="n in 4" :key="n" variant="text" height="3.5rem" />
            </div>
            <p v-else-if="isEmpty" class="notices-aside__empty">
              Nenhum aviso enviado para esta turma ainda. Use &quot;Novo aviso&quot; para notificar os alunos.
            </p>
            <ul v-else class="notices-aside__list">
              <NoticeListItem
                v-for="item in avisos"
                :key="item.id"
                :tone="item.tone"
                :icon="item.icon"
                :title="item.title"
                :text="item.text"
                :detail="item.detail"
                :channels="item.channels ?? turma?.channels"
                show-channels
                :sent-at="formatNoticeSentAt(item.sentAt)"
              />
            </ul>
          </section>
        </aside>
      </div>
    </Transition>
  </Teleport>

  <SendNoticeDialog
    :key="sendDialogKey"
    :open="showSendDialog"
    :turmas="turma ? [turma] : []"
    :initial-turma-id="turma?.id"
    lock-turma
    @close="closeSendDialog"
    @sent="onNoticeSent"
    @error="onNoticeError"
  />
</template>

<style scoped>
@import '../../styles/auth-form.css';

.aside-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.aside-backdrop {
  position: absolute;
  inset: 0;
  border: none;
  background: rgba(26, 35, 56, 0.35);
  cursor: pointer;
}

.aside-panel {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  width: min(32rem, 100%);
  max-width: 100vw;
  height: 100%;
  padding: 1.5rem 1.5rem 1.75rem;
  background: #fff;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
}

.aside-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.aside-panel__heading {
  flex: 1;
  min-width: 0;
}

.aside-panel__title {
  margin: 0 0 0.2rem;
  font-family: var(--font-serif);
  font-size: 1.28rem;
  font-weight: 700;
  color: #1f1f1f;
}

.aside-panel__subtitle {
  margin: 0;
  font-size: 0.8125rem;
  color: #7a7772;
}

.aside-panel__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 1.35rem;
  line-height: 1;
  color: #6b6760;
  cursor: pointer;
}

.aside-panel__close:hover {
  background: #f3f2ef;
}

.notices-aside__toolbar {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #efedea;
}

.notices-aside__list-wrap {
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.notices-aside__list {
  margin: 0;
  padding: 0;
}

.notices-aside__empty {
  margin: 0;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #7a7772;
}

.notices-aside__loading {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.aside-overlay-enter-active,
.aside-overlay-leave-active {
  transition: opacity 0.28s ease;
}

.aside-overlay-enter-active .aside-panel,
.aside-overlay-leave-active .aside-panel {
  transition: transform 0.34s cubic-bezier(0.33, 1, 0.68, 1);
}

.aside-overlay-enter-from,
.aside-overlay-leave-to {
  opacity: 0;
}

.aside-overlay-enter-from .aside-panel,
.aside-overlay-leave-to .aside-panel {
  transform: translateX(100%);
}
</style>
