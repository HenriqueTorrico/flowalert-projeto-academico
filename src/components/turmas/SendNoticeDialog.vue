<script setup>
import { computed, toRef, watch } from 'vue'
import { useAuthForm } from '../../composables/useAuthForm'
import { useSimulatedLoad } from '../../composables/useSimulatedLoad'
import { NOTICE_SCENARIOS, sendNoticeSchema } from '../../schemas/sendNoticeSchema'
import { buildNoticePreview } from '../../utils/noticePreview'
import { parseRoomFromTurmaMeta } from '../../utils/turmaMeta'
import AppModal from '../ui/AppModal.vue'
import AppSelect from '../ui/AppSelect.vue'
import AppSkeleton from '../ui/AppSkeleton.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  turmas: { type: Array, default: () => [] },
  initialTurmaId: { type: [Number, String], default: null },
})

const emit = defineEmits(['close', 'sent', 'error'])

const { isLoading } = useSimulatedLoad(toRef(props, 'open'))

const turmaOptions = computed(() =>
  props.turmas.map((turma) => ({
    value: String(turma.id),
    label: turma.name,
  })),
)

const { defineAuthField, handleSubmit, errors, submitCount, setFieldValue } = useAuthForm({
  validationSchema: sendNoticeSchema,
  initialValues: {
    turmaId: '',
    scenario: 'room_change',
    currentRoom: '',
    newRoom: '',
    date: '',
    message: '',
  },
})

const [turmaId, turmaIdAttrs] = defineAuthField('turmaId')
const [scenario] = defineAuthField('scenario')
const [currentRoom, currentRoomAttrs] = defineAuthField('currentRoom')
const [newRoom, newRoomAttrs] = defineAuthField('newRoom')
const [date, dateAttrs] = defineAuthField('date')
const [message, messageAttrs] = defineAuthField('message')

const selectedTurma = computed(() =>
  props.turmas.find((turma) => String(turma.id) === String(turmaId.value)),
)

const preview = computed(() =>
  buildNoticePreview({
    scenario: scenario.value,
    turmaName: selectedTurma.value?.name,
    currentRoom: currentRoom.value,
    newRoom: newRoom.value,
    date: date.value,
    message: message.value,
  }),
)

watch(
  () => [props.open, props.initialTurmaId, props.turmas],
  ([isOpen]) => {
    if (!isOpen) return
    const fallbackId = props.initialTurmaId ?? props.turmas[0]?.id
    if (fallbackId != null) {
      setFieldValue('turmaId', String(fallbackId))
    }
  },
  { immediate: true },
)

watch(
  () => [turmaId.value, selectedTurma.value?.meta],
  () => {
    const meta = selectedTurma.value?.meta
    if (meta) {
      setFieldValue('currentRoom', parseRoomFromTurmaMeta(meta))
    }
  },
)

function setScenario(next) {
  setFieldValue('scenario', next)
}

function showError(field) {
  return submitCount.value > 0 && errors.value[field]
}

const onSubmit = handleSubmit(
  (formValues) => {
    emit('sent', {
      ...formValues,
      turma: selectedTurma.value,
    })
  },
  () => {
    emit('error')
  },
)

function onClose() {
  emit('close')
}
</script>

<template>
  <AppModal
    :open="open"
    title="Enviar aviso"
    description="Os alunos da turma recebem a notificação assim que você enviar."
    max-width="30rem"
    @close="onClose"
  >
    <div v-if="isLoading" class="skeleton-form" aria-busy="true" aria-label="Carregando formulário">
      <div v-for="n in 4" :key="n" class="skeleton-form__group">
        <AppSkeleton variant="label" />
        <AppSkeleton variant="input" />
      </div>
    </div>

    <form v-else id="send-notice-form" class="notice-form" @submit.prevent="onSubmit" novalidate>
      <div class="field">
        <label class="field__label" for="notice-turma">Turma</label>
        <AppSelect
          id="notice-turma"
          v-model="turmaId"
          v-bind="turmaIdAttrs"
          :options="turmaOptions"
          placeholder="Selecione a turma"
          :invalid="showError('turmaId')"
        />
        <p v-if="showError('turmaId')" class="field__error">{{ errors.turmaId }}</p>
      </div>

      <div class="field">
        <span class="field__label">Tipo de aviso</span>
        <div class="notice-scenarios" role="group" aria-label="Tipo de aviso">
          <button
            v-for="option in NOTICE_SCENARIOS"
            :key="option.value"
            type="button"
            class="notice-scenarios__pill"
            :class="{ 'notice-scenarios__pill--active': scenario === option.value }"
            @click="setScenario(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        <p v-if="showError('scenario')" class="field__error">{{ errors.scenario }}</p>
      </div>

      <template v-if="scenario === 'room_change'">
        <div class="field">
          <label class="field__label" for="notice-current-room">Sala atual</label>
          <input
            id="notice-current-room"
            v-model="currentRoom"
            v-bind="currentRoomAttrs"
            class="field__input field__input--muted"
            type="text"
            :class="{ 'field__input--invalid': showError('currentRoom') }"
          />
          <p v-if="showError('currentRoom')" class="field__error">{{ errors.currentRoom }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="notice-new-room">Nova sala</label>
          <input
            id="notice-new-room"
            v-model="newRoom"
            v-bind="newRoomAttrs"
            class="field__input"
            type="text"
            placeholder="Ex: 202A"
            :class="{ 'field__input--invalid': showError('newRoom') }"
          />
          <p v-if="showError('newRoom')" class="field__error">{{ errors.newRoom }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="notice-date-room">Data</label>
          <input
            id="notice-date-room"
            v-model="date"
            v-bind="dateAttrs"
            class="field__input field__input--date"
            type="date"
            :class="{ 'field__input--invalid': showError('date') }"
          />
          <p v-if="showError('date')" class="field__error">{{ errors.date }}</p>
        </div>
      </template>

      <template v-else-if="scenario === 'no_class'">
        <div class="field">
          <label class="field__label" for="notice-date-off">Data</label>
          <input
            id="notice-date-off"
            v-model="date"
            v-bind="dateAttrs"
            class="field__input field__input--date"
            type="date"
            :class="{ 'field__input--invalid': showError('date') }"
          />
          <p v-if="showError('date')" class="field__error">{{ errors.date }}</p>
        </div>
      </template>

      <template v-else>
        <div class="field">
          <label class="field__label" for="notice-message">Mensagem</label>
          <textarea
            id="notice-message"
            v-model="message"
            v-bind="messageAttrs"
            class="field__input field__textarea"
            rows="3"
            placeholder="Escreva o aviso para os alunos"
            :class="{ 'field__input--invalid': showError('message') }"
          />
          <p v-if="showError('message')" class="field__error">{{ errors.message }}</p>
        </div>
      </template>

      <section class="notice-preview" aria-label="Pré-visualização para o aluno">
        <p class="notice-preview__label">Pré-visualização para o aluno</p>
        <div class="notice-preview__card">
          <span class="notice-preview__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 17H9l-1 2h8l-1-2ZM5 9a7 7 0 0 1 14 0c0 5 2 6 2 6H3s2-1 2-6Z"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <div class="notice-preview__body">
            <p class="notice-preview__title">{{ preview.title }}</p>
            <p class="notice-preview__text">{{ preview.body }}</p>
          </div>
        </div>
      </section>
    </form>

    <template #footer>
      <button type="button" class="btn-outline" :disabled="isLoading" @click="onClose">Cancelar</button>
      <button type="submit" form="send-notice-form" class="btn-accent-sm" :disabled="isLoading">
        Enviar aviso
      </button>
    </template>
  </AppModal>
</template>

<style scoped>
@import '../../styles/auth-form.css';

.notice-form {
  display: flex;
  flex-direction: column;
  gap: 1.05rem;
}

.field__input--muted {
  background: #f7f6f4;
}

.field__input--date {
  cursor: text;
}

.field__textarea {
  min-height: 5.5rem;
  resize: vertical;
  cursor: text;
}

.notice-scenarios {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.notice-scenarios__pill {
  padding: 0.45rem 0.75rem;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6f6c66;
  background: #fff;
  border: 1px solid #e3e0db;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.notice-scenarios__pill:hover {
  border-color: #d4cfc6;
  color: #4a4742;
}

.notice-scenarios__pill--active {
  color: #9a5c12;
  background: #fff8eb;
  border-color: #e8b44a;
}

.notice-preview {
  margin-top: 0.15rem;
}

.notice-preview__label {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #9a958d;
}

.notice-preview__card {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.85rem 0.9rem;
  background: #f7f6f4;
  border: 1px solid #ebe9e5;
  border-radius: 10px;
}

.notice-preview__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  color: #c98512;
  background: #fff3dc;
  flex-shrink: 0;
}

.notice-preview__title {
  margin: 0 0 0.2rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #2a2a2a;
}

.notice-preview__text {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #7a7772;
}
</style>
