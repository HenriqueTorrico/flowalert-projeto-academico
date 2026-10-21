<script setup>
import { computed } from 'vue'
import AppSpinner from './AppSpinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'accent-sm', 'outline'].includes(value),
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loadingLabel: { type: String, default: '' },
  type: { type: String, default: 'button' },
  form: { type: String, default: undefined },
})

const variantClass = computed(() => {
  if (props.variant === 'accent-sm') return 'btn-accent-sm'
  if (props.variant === 'outline') return 'btn-outline'
  return 'btn-primary'
})
</script>

<template>
  <button
    :type="type"
    :form="form"
    :class="[variantClass, 'app-action-btn']"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span class="app-action-btn__content">
      <AppSpinner v-if="loading" />
      <span v-if="loading">
        <template v-if="loadingLabel">{{ loadingLabel }}</template>
        <slot v-else />
      </span>
      <slot v-else />
    </span>
  </button>
</template>

<style scoped>
.app-action-btn__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.app-action-btn.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-action-btn.btn-primary .app-action-btn__content {
  width: 100%;
  justify-content: center;
}
</style>
