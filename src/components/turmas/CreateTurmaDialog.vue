<script setup>
import { toRef } from 'vue'
import { useAuthForm } from '../../composables/useAuthForm'
import { useSimulatedLoad } from '../../composables/useSimulatedLoad'
import { createTurmaSchema } from '../../schemas/createTurmaSchema'
import AppModal from '../ui/AppModal.vue'
import AppSelect from '../ui/AppSelect.vue'
import AppSkeleton from '../ui/AppSkeleton.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'created', 'error'])

const { isLoading } = useSimulatedLoad(toRef(props, 'open'))

const { defineAuthField, handleSubmit, errors, submitCount } = useAuthForm({
  validationSchema: createTurmaSchema,
  initialValues: {
    name: '',
    room: '',
    period: 'Manhã',
  },
})

const [name, nameAttrs] = defineAuthField('name')
const [room, roomAttrs] = defineAuthField('room')
const [period, periodAttrs] = defineAuthField('period')

const periods = ['Manhã', 'Tarde', 'Noite']

const onSubmit = handleSubmit(
  (values) => {
    emit('created', values)
  },
  () => {
    emit('error')
  },
)

function showError(field) {
  return submitCount.value > 0 && errors.value[field]
}

function onClose() {
  emit('close')
}
</script>

<template>
  <AppModal
    :open="open"
    title="Criar nova turma"
    description="A turma fica disponível para receber avisos assim que for criada."
    @close="onClose"
  >
    <div v-if="isLoading" class="skeleton-form" aria-busy="true" aria-label="Carregando formulário">
      <div v-for="n in 3" :key="n" class="skeleton-form__group">
        <AppSkeleton variant="label" />
        <AppSkeleton variant="input" />
      </div>
    </div>

    <form v-else id="create-turma-form" @submit.prevent="onSubmit" novalidate>
      <div class="field">
        <label class="field__label" for="turma-name">Nome da turma</label>
        <input
          id="turma-name"
          v-model="name"
          v-bind="nameAttrs"
          class="field__input"
          :class="{ 'field__input--invalid': showError('name') }"
          type="text"
          placeholder="Redes de computadores"
        />
        <p v-if="showError('name')" class="field__error">{{ errors.name }}</p>
      </div>

      <div class="field">
        <label class="field__label" for="turma-room">Sala</label>
        <input
          id="turma-room"
          v-model="room"
          v-bind="roomAttrs"
          class="field__input"
          :class="{ 'field__input--invalid': showError('room') }"
          type="text"
          placeholder="210B"
        />
        <p v-if="showError('room')" class="field__error">{{ errors.room }}</p>
      </div>

      <div class="field">
        <label class="field__label" for="turma-period">Turno</label>
        <AppSelect
          id="turma-period"
          v-model="period"
          v-bind="periodAttrs"
          :options="periods"
          :invalid="showError('period')"
        />
        <p v-if="showError('period')" class="field__error">{{ errors.period }}</p>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn-outline" :disabled="isLoading" @click="onClose">Cancelar</button>
      <button type="submit" form="create-turma-form" class="btn-accent-sm" :disabled="isLoading">
        Criar turma
      </button>
    </template>
  </AppModal>
</template>

<style scoped>
@import '../../styles/auth-form.css';
</style>
