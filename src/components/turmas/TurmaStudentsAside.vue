<script setup>
import { computed, ref, toRef, watch } from 'vue'
import { useSimulatedLoad } from '../../composables/useSimulatedLoad'
import { getInitials } from '../../utils/userDisplay'
import { getStudentsForTurma } from '../../data/mockStudents'
import AppSkeleton from '../ui/AppSkeleton.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  turma: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const { isLoading } = useSimulatedLoad(toRef(props, 'open'))

const search = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) search.value = ''
  },
)

const students = computed(() => {
  if (!props.turma) return []
  return getStudentsForTurma(props.turma.id)
})

const filteredStudents = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return students.value
  return students.value.filter(
    (student) =>
      student.name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term),
  )
})

function onClose() {
  emit('close')
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
              <template v-if="isLoading">
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

          <div v-if="isLoading" class="aside-skeleton" aria-busy="true" aria-label="Carregando alunos">
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
              <li v-if="filteredStudents.length === 0" class="aside-list__empty">
                Nenhum aluno encontrado.
              </li>
              <li v-for="student in filteredStudents" :key="student.id" class="aside-list__item">
                <span class="aside-list__avatar">{{ getInitials(student.name) }}</span>
                <div class="aside-list__body">
                  <p class="aside-list__name">{{ student.name }}</p>
                  <p class="aside-list__email">{{ student.email }}</p>
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
  width: min(22rem, 100%);
  height: 100%;
  padding: 1.25rem 1.15rem 1.5rem;
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
  font-size: 1.15rem;
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
  width: 2rem;
  height: 2rem;
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
