<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import AppActionButton from '../ui/AppActionButton.vue'
import { useDebouncedFn } from '../../composables/useDebouncedFn'
import { useToast } from '../../composables/useToast'
import { buildCreateTurmaSchema } from '../../schemas/createTurmaSchema'
import { updateTurma, validateTurmaUpdate } from '../../services/turmas'
import { DUPLICATE_TURMA_MESSAGE } from '../../utils/turmaDuplicate'
import AppModal from '../ui/AppModal.vue'
import AppSelect from '../ui/AppSelect.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  turma: { type: Object, default: null },
})

const emit = defineEmits(['close', 'updated'])

const toast = useToast()
const submitting = ref(false)
const validateRequestId = ref(0)

const VALIDATION_TOAST = 'Preencha os campos obrigatórios para salvar a turma.'

const fieldTouched = reactive({
  name: false,
  room: false,
  period: false,
  channels: false,
})

function turmaToFormValues(turma) {
  return {
    name: turma?.name ?? '',
    room: turma?.room ?? '',
    period: turma?.period ?? 'Manhã',
    channelEmail: Boolean(turma?.channels?.email),
    channelWhatsapp: Boolean(turma?.channels?.whatsapp),
    channelTelegram: Boolean(turma?.channels?.telegram),
  }
}

const {
  defineField,
  handleSubmit,
  errors,
  submitCount,
  setFieldError,
  validateField,
  validate,
  resetForm,
} = useForm({
  validationSchema: buildCreateTurmaSchema(),
  validateOnMount: false,
  initialValues: turmaToFormValues(null),
})

const [name, nameAttrs] = defineField('name')
const [room, roomAttrs] = defineField('room')
const [period, periodAttrs] = defineField('period')
const [channelEmail] = defineField('channelEmail')
const [channelWhatsapp] = defineField('channelWhatsapp')
const [channelTelegram] = defineField('channelTelegram')

const periods = ['Manhã', 'Tarde', 'Noite']

const channelToggles = [
  { key: 'email', label: 'E-mail' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'telegram', label: 'Telegram' },
]

const hasAnyChannel = computed(
  () => Boolean(channelEmail.value || channelWhatsapp.value || channelTelegram.value),
)

function isChannelActive(key) {
  if (key === 'email') return channelEmail.value
  if (key === 'whatsapp') return channelWhatsapp.value
  return channelTelegram.value
}

function toggleChannel(key) {
  if (submitting.value) return

  if (key === 'email') channelEmail.value = !channelEmail.value
  else if (key === 'whatsapp') channelWhatsapp.value = !channelWhatsapp.value
  else channelTelegram.value = !channelTelegram.value

  validateChannelsNow()
}

function buildTurmaPayload(values) {
  const source = values ?? {
    name: name.value,
    room: room.value,
    period: period.value,
    channelEmail: channelEmail.value,
    channelWhatsapp: channelWhatsapp.value,
    channelTelegram: channelTelegram.value,
  }

  return {
    name: source.name,
    room: source.room,
    period: source.period,
    channels: {
      email: Boolean(source.channelEmail),
      whatsapp: Boolean(source.channelWhatsapp),
      telegram: Boolean(source.channelTelegram),
    },
  }
}

function currentValues() {
  return buildTurmaPayload()
}

function isDuplicateMessage(message) {
  return message === DUPLICATE_TURMA_MESSAGE
}

function clearDuplicateErrors() {
  for (const field of ['name', 'room', 'period']) {
    if (isDuplicateMessage(errors.value[field])) {
      setFieldError(field, undefined)
    }
  }
}

function applyRemoteValidation(result) {
  if (result?.valid) {
    clearDuplicateErrors()
    if (hasAnyChannel.value) {
      setFieldError('channels', undefined)
    }
    return
  }

  const fields = result?.fields
  if (!fields || typeof fields !== 'object') return

  const duplicate = Object.values(fields).some((message) => isDuplicateMessage(message))

  if (duplicate) {
    setFieldError('name', DUPLICATE_TURMA_MESSAGE)
    setFieldError('room', DUPLICATE_TURMA_MESSAGE)
    setFieldError('period', DUPLICATE_TURMA_MESSAGE)
    return
  }

  if (fields.channels) {
    setFieldError('channels', String(fields.channels))
  }

  for (const [field, message] of Object.entries(fields)) {
    if (message && fieldTouched[field]) {
      setFieldError(field, String(message))
    }
  }
}

async function validateTurmaRemote() {
  const turmaId = props.turma?.id
  if (!turmaId) return

  const requestId = ++validateRequestId.value

  try {
    const result = await validateTurmaUpdate(turmaId, currentValues())
    if (requestId !== validateRequestId.value) return
    applyRemoteValidation(result)
  } catch {
    // validação em tempo real falha em silêncio
  }
}

const debouncedValidateName = useDebouncedFn(async () => {
  fieldTouched.name = true
  await validateField('name')
  await validateTurmaRemote()
}, 450)

const debouncedValidateRoom = useDebouncedFn(async () => {
  fieldTouched.room = true
  await validateField('room')
  await validateTurmaRemote()
}, 450)

async function validatePeriodNow() {
  fieldTouched.period = true
  await validateField('period')
  await validateTurmaRemote()
}

async function validateChannelsNow() {
  fieldTouched.channels = true

  if (hasAnyChannel.value) {
    setFieldError('channels', undefined)
  } else {
    setFieldError('channels', 'Selecione pelo menos um meio de aviso.')
  }

  await validate()
  await validateTurmaRemote()
}

watch(
  () => [props.open, props.turma?.id],
  ([isOpen, turmaId]) => {
    if (!isOpen) {
      validateRequestId.value += 1
      debouncedValidateName.cancel()
      debouncedValidateRoom.cancel()
      resetForm({ values: turmaToFormValues(null) })
      fieldTouched.name = false
      fieldTouched.room = false
      fieldTouched.period = false
      fieldTouched.channels = false
      return
    }

    if (turmaId) {
      resetForm({ values: turmaToFormValues(props.turma) })
      fieldTouched.name = false
      fieldTouched.room = false
      fieldTouched.period = false
      fieldTouched.channels = false
    }
  },
)

function applyApiFieldErrors(fields) {
  if (!fields || typeof fields !== 'object') return

  for (const [field, message] of Object.entries(fields)) {
    if (message) {
      if (field === 'channels') {
        fieldTouched.channels = true
      } else {
        fieldTouched[field] = true
      }
      setFieldError(field, String(message))
    }
  }
}

function onInvalidSubmit(ctx) {
  fieldTouched.name = true
  fieldTouched.room = true
  fieldTouched.period = true
  fieldTouched.channels = true

  const nameError = ctx?.errors?.name
  const channelsError = ctx?.errors?.channels

  if (channelsError) {
    toast.error('Validação', channelsError)
    return
  }

  if (nameError === DUPLICATE_TURMA_MESSAGE) {
    setFieldError('room', DUPLICATE_TURMA_MESSAGE)
    setFieldError('period', DUPLICATE_TURMA_MESSAGE)
    toast.error('Validação', DUPLICATE_TURMA_MESSAGE)
    return
  }

  toast.error('Validação', VALIDATION_TOAST)
}

const runSubmit = handleSubmit(
  async (values) => {
    const turmaId = props.turma?.id
    if (!turmaId) return

    submitting.value = true
    try {
      const turma = await updateTurma(turmaId, buildTurmaPayload(values))
      emit('updated', turma)
    } catch (err) {
      applyApiFieldErrors(err?.fields)
      const message =
        err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.'
      toast.error('Não foi possível salvar a turma', message)
    } finally {
      submitting.value = false
    }
  },
  onInvalidSubmit,
)

function showError(field) {
  if (!errors.value[field]) return false
  return fieldTouched[field] || submitCount.value > 0
}

function onClose() {
  if (submitting.value) return
  emit('close')
}
</script>

<template>
  <AppModal
    :open="open"
    title="Editar turma"
    description="Atualize nome, sala, turno e meios de aviso desta turma."
    max-width="32rem"
    @close="onClose"
  >
    <form id="edit-turma-form" class="edit-turma-form" @submit.prevent="runSubmit" novalidate>
      <div class="edit-turma-form__row">
        <div class="field edit-turma-form__name">
          <label class="field__label" for="edit-turma-name">Nome da turma</label>
          <input
            id="edit-turma-name"
            v-model="name"
            v-bind="nameAttrs"
            class="field__input"
            :class="{ 'field__input--invalid': showError('name') }"
            type="text"
            autocomplete="off"
            :disabled="submitting"
            @input="debouncedValidateName"
          />
          <p v-if="showError('name')" class="field__error" role="alert">{{ errors.name }}</p>
        </div>

        <div class="field edit-turma-form__room">
          <label class="field__label" for="edit-turma-room">Sala</label>
          <input
            id="edit-turma-room"
            v-model="room"
            v-bind="roomAttrs"
            class="field__input"
            :class="{ 'field__input--invalid': showError('room') }"
            type="text"
            autocomplete="off"
            :disabled="submitting"
            @input="debouncedValidateRoom"
          />
          <p v-if="showError('room')" class="field__error" role="alert">{{ errors.room }}</p>
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="edit-turma-period">Turno</label>
        <AppSelect
          id="edit-turma-period"
          v-model="period"
          v-bind="periodAttrs"
          :options="periods"
          :invalid="showError('period')"
          :disabled="submitting"
          @update:model-value="validatePeriodNow"
        />
        <p v-if="showError('period')" class="field__error" role="alert">{{ errors.period }}</p>
      </div>

      <div class="field field--channels">
        <div class="field__label-row">
          <span class="field__label" id="edit-turma-channels-label">Meios de aviso</span>
          <span class="field__tag">Obrigatório</span>
        </div>
        <p class="turma-channels__hint">
          Marque ao menos um canal. Os avisos da turma serão enviados pelos meios selecionados.
        </p>
        <div
          class="turma-channels"
          role="group"
          aria-labelledby="edit-turma-channels-label"
          :aria-invalid="showError('channels')"
        >
          <button
            v-for="option in channelToggles"
            :key="option.key"
            type="button"
            class="turma-channels__pill"
            :class="{ 'turma-channels__pill--active': isChannelActive(option.key) }"
            :aria-pressed="isChannelActive(option.key)"
            :disabled="submitting"
            @click="toggleChannel(option.key)"
          >
            <span
              class="turma-channels__check"
              aria-hidden="true"
              :class="{ 'turma-channels__check--on': isChannelActive(option.key) }"
            >
              <svg v-if="isChannelActive(option.key)" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6l2.5 2.5L9.5 4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            {{ option.label }}
          </button>
        </div>
        <p v-if="showError('channels')" class="field__error" role="alert">
          {{ errors.channels }}
        </p>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn-outline" :disabled="submitting" @click="onClose">
        Cancelar
      </button>
      <AppActionButton
        type="submit"
        form="edit-turma-form"
        variant="accent-sm"
        :loading="submitting"
        loading-label="Salvando…"
      >
        Salvar alterações
      </AppActionButton>
    </template>
  </AppModal>
</template>

<style scoped>
@import '../../styles/auth-form.css';

.edit-turma-form__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 6.75rem;
  gap: 0.85rem;
  align-items: start;
}

.field--channels {
  gap: 0.45rem;
}

.field__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.field__tag {
  flex-shrink: 0;
  padding: 0.15rem 0.45rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #9a5c12;
  background: #fff8eb;
  border: 1px solid #f0d49a;
  border-radius: 999px;
}

.turma-channels__hint {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #7a7772;
}

.turma-channels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.15rem;
}

.turma-channels__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.85rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6f6c66;
  background: #fff;
  border: 1px solid #e3e0db;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.turma-channels__pill:hover:not(:disabled) {
  border-color: #d4cfc6;
  color: #4a4742;
}

.turma-channels__pill--active {
  color: #9a5c12;
  background: #fff8eb;
  border-color: #e8b44a;
  box-shadow: 0 0 0 1px rgba(232, 180, 74, 0.25);
}

.turma-channels__pill:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.turma-channels__check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.05rem;
  height: 1.05rem;
  border: 1.5px solid #cfc9c0;
  border-radius: 4px;
  color: transparent;
  background: #fff;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.turma-channels__check--on {
  color: #fff;
  background: #e8a23b;
  border-color: #e8a23b;
}
</style>
