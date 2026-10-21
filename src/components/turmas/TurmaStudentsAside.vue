<script setup>
import { computed, ref, watch } from 'vue'
import { useToast } from '../../composables/useToast'
import { enrollTurmaStudent, fetchTurmaStudents } from '../../services/turmas'
import { getInitials } from '../../utils/userDisplay'
import { formatWhatsappDisplay, whatsappHref } from '../../utils/whatsapp'
import AppActionButton from '../ui/AppActionButton.vue'
import AppSkeleton from '../ui/AppSkeleton.vue'
import AppWhatsappInput from '../ui/AppWhatsappInput.vue'
import HighlightText from '../ui/HighlightText.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  turma: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const toast = useToast()
const search = ref('')
const students = ref([])
const loading = ref(false)
const loadRequestId = ref(0)
const enrollName = ref('')
const enrollEmail = ref('')
const enrollWhatsapp = ref('')
const enrollSubmitting = ref(false)
const enrollErrors = ref({ name: '', email: '', whatsapp: '' })

watch(
  () => [props.open, props.turma?.id],
  ([isOpen, turmaId]) => {
    if (!isOpen) {
      search.value = ''
      students.value = []
      enrollName.value = ''
      enrollEmail.value = ''
      enrollWhatsapp.value = ''
      enrollErrors.value = { name: '', email: '', whatsapp: '' }
      loadRequestId.value += 1
      return
    }

    if (turmaId) {
      loadStudents(turmaId)
    }
  },
)

async function loadStudents(turmaId) {
  const requestId = ++loadRequestId.value
  loading.value = true

  try {
    const data = await fetchTurmaStudents(turmaId)
    if (requestId !== loadRequestId.value) return
    students.value = data.students
  } catch {
    if (requestId !== loadRequestId.value) return
    students.value = []
    toast.error('Alunos', 'Não foi possível carregar os alunos da turma.')
  } finally {
    if (requestId === loadRequestId.value) {
      loading.value = false
    }
  }
}

const searchTerm = computed(() => search.value.trim())

const filteredStudents = computed(() => {
  const term = searchTerm.value.toLowerCase()
  if (!term) return students.value
  return students.value.filter(
    (student) =>
      student.name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term),
  )
})

const isEmptyList = computed(() => !loading.value && students.value.length === 0)

function onClose() {
  emit('close')
}

async function onEnrollSubmit() {
  if (!props.turma?.id) return

  enrollErrors.value = { name: '', email: '', whatsapp: '' }
  enrollSubmitting.value = true

  try {
    const student = await enrollTurmaStudent(props.turma.id, {
      name: enrollName.value,
      email: enrollEmail.value,
      whatsapp: enrollWhatsapp.value,
    })

    const exists = students.value.some((item) => item.id === student.id)
    if (!exists) {
      students.value = [...students.value, student].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR'),
      )
    }

    enrollName.value = ''
    enrollEmail.value = ''
    enrollWhatsapp.value = ''
    toast.success('Aluno matriculado com sucesso')
  } catch (err) {
    const fields = err?.fields
    if (fields?.name) enrollErrors.value.name = fields.name
    if (fields?.email) enrollErrors.value.email = fields.email
    if (fields?.whatsapp) enrollErrors.value.whatsapp = fields.whatsapp

    const message = err instanceof Error ? err.message : 'Não foi possível matricular o aluno.'
    toast.error('Matrícula', message)
  } finally {
    enrollSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="aside-overlay">
      <div v-if="open" class="aside-root">
        <button type="button" class="aside-backdrop" aria-label="Fechar" @click="onClose" />

        <aside class="aside-panel" role="dialog" aria-modal="true" aria-labelledby="aside-title">
          <header class="aside-panel__header">
            <div class="aside-panel__heading">
              <template v-if="loading">
                <AppSkeleton variant="title" width="70%" />
                <AppSkeleton variant="text" width="55%" class="aside-panel__subtitle-skel" />
              </template>
              <template v-else>
                <h2 id="aside-title" class="aside-panel__title">Alunos da turma</h2>
                <p v-if="turma" class="aside-panel__subtitle">{{ turma.name }}</p>
              </template>
            </div>
            <button type="button" class="aside-panel__close" aria-label="Fechar painel" @click="onClose">
              ×
            </button>
          </header>

          <div v-if="loading" class="aside-skeleton" aria-busy="true" aria-label="Carregando alunos">
            <AppSkeleton variant="input" height="2.35rem" class="aside-skeleton__search" />
            <ul class="aside-list">
              <li v-for="n in 6" :key="n" class="aside-skeleton__row">
                <AppSkeleton circle width="2rem" height="2rem" />
                <div class="skeleton-stack" style="flex: 1">
                  <AppSkeleton variant="text" width="75%" />
                  <AppSkeleton variant="text" width="55%" />
                </div>
              </li>
            </ul>
          </div>

          <template v-else>
            <section class="aside-enroll" aria-label="Matricular aluno manualmente">
              <p class="aside-enroll__lead">
                Cadastre o aluno aqui. O QR Code é só um atalho para o aluno entrar sozinho.
              </p>
              <form class="aside-enroll__form" @submit.prevent="onEnrollSubmit">
                <div class="field">
                  <label class="field__label" for="enroll-name">Nome</label>
                  <input
                    id="enroll-name"
                    v-model="enrollName"
                    class="field__input"
                    :class="{ 'field__input--invalid': enrollErrors.name }"
                    type="text"
                    autocomplete="off"
                    placeholder="Nome do aluno"
                    :disabled="enrollSubmitting"
                  />
                  <p v-if="enrollErrors.name" class="field__error">{{ enrollErrors.name }}</p>
                </div>
                <div class="field">
                  <label class="field__label" for="enroll-email">E-mail</label>
                  <input
                    id="enroll-email"
                    v-model="enrollEmail"
                    class="field__input"
                    :class="{ 'field__input--invalid': enrollErrors.email }"
                    type="email"
                    autocomplete="off"
                    placeholder="aluno@escola.com.br"
                    :disabled="enrollSubmitting"
                  />
                  <p v-if="enrollErrors.email" class="field__error">{{ enrollErrors.email }}</p>
                </div>
                <div class="field">
                  <label class="field__label" for="enroll-whatsapp">WhatsApp</label>
                  <AppWhatsappInput
                    id="enroll-whatsapp"
                    v-model="enrollWhatsapp"
                    :invalid="Boolean(enrollErrors.whatsapp)"
                    :disabled="enrollSubmitting"
                  />
                  <p v-if="enrollErrors.whatsapp" class="field__error">{{ enrollErrors.whatsapp }}</p>
                </div>
                <AppActionButton
                  type="submit"
                  variant="accent-sm"
                  :loading="enrollSubmitting"
                  loading-label="Matriculando…"
                >
                  Matricular aluno
                </AppActionButton>
              </form>
            </section>

            <label class="aside-search">
              <span class="aside-search__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.75" />
                  <path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
                </svg>
              </span>
              <input
                v-model="search"
                type="search"
                class="aside-search__input"
                placeholder="Buscar por nome ou e-mail"
                aria-label="Buscar por nome ou e-mail"
              />
            </label>

            <ul class="aside-list">
              <li v-if="isEmptyList" class="aside-list__empty">
                Nenhum aluno matriculado nesta turma.
              </li>
              <li v-else-if="filteredStudents.length === 0" class="aside-list__empty">
                Nenhum aluno encontrado.
              </li>
              <li v-for="student in filteredStudents" :key="student.id" class="aside-list__item">
                <span class="aside-list__avatar">{{ getInitials(student.name) }}</span>
                <div class="aside-list__body">
                  <p class="aside-list__name">
                    <HighlightText :text="student.name" :query="searchTerm" />
                  </p>
                  <p class="aside-list__email">
                    <HighlightText :text="student.email" :query="searchTerm" />
                  </p>
                  <a
                    v-if="student.whatsapp"
                    class="aside-list__whatsapp"
                    :href="whatsappHref(student.whatsapp)"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp: {{ formatWhatsappDisplay(student.whatsapp) }}
                  </a>
                </div>
              </li>
            </ul>
          </template>
        </aside>
      </div>
    </Transition>
  </Teleport>
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

.aside-panel__subtitle-skel {
  margin-top: 0.35rem;
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

.aside-skeleton__search {
  margin-bottom: 1rem;
  border-radius: 999px;
}

.aside-skeleton__row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0;
  border-top: 1px solid #efedea;
  list-style: none;
}

.aside-skeleton__row:first-child {
  border-top: none;
}

.aside-enroll {
  margin-bottom: 1.15rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid #efedea;
}

.aside-enroll__lead {
  margin: 0 0 0.85rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #7a7772;
}

.aside-enroll__form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.aside-enroll__form .field__label {
  font-size: 0.8125rem;
}

.aside-enroll__form .field__input {
  font-size: 0.8125rem;
}

.aside-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.55rem 0.75rem;
  border: 1px solid #e8e6e2;
  border-radius: 999px;
  background: #fafaf8;
  color: #9a958d;
}

.aside-search__input {
  width: 100%;
  border: none;
  outline: none;
  font: inherit;
  font-size: 0.8125rem;
  color: var(--color-ink);
  background: transparent;
  cursor: text;
}

.aside-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.aside-list__item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0;
  border-top: 1px solid #efedea;
}

.aside-list__item:first-child {
  border-top: none;
}

.aside-list__empty {
  padding: 1rem 0;
  font-size: 0.875rem;
  color: #7a7772;
}

.aside-list__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 50%;
  font-size: 0.68rem;
  font-weight: 700;
  color: #fff;
  background: #4d8a7c;
  flex-shrink: 0;
}

.aside-list__name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2a2a2a;
}

.aside-list__email {
  margin: 0.1rem 0 0;
  font-size: 0.75rem;
  color: #8a8680;
}

.aside-list__whatsapp {
  display: inline-block;
  margin-top: 0.2rem;
  font-size: 0.75rem;
  color: #3d7a5c;
  text-decoration: none;
}

.aside-list__whatsapp:hover {
  text-decoration: underline;
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
