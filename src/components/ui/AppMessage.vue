<template>
  <div class="app-message" :class="`app-message--${severity}`" role="alert">
    <span class="app-message__icon" aria-hidden="true">
      <svg v-if="severity === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.75" />
        <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <svg v-else-if="severity === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.75" />
        <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
      <svg v-else-if="severity === 'warn'" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 3.5 20.5 19H3.5L12 3.5Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
        <path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.75" />
        <path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </span>
    <p class="app-message__text">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  severity: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'success', 'warn', 'info'].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.app-message {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 0.875rem;
  line-height: 1.45;
}

.app-message__icon {
  display: flex;
  flex-shrink: 0;
  margin-top: 0.05rem;
}

.app-message__text {
  margin: 0;
  flex: 1;
}

.app-message--error {
  color: #991b1b;
  background: #fef2f2;
  border-color: #fecaca;
  border-left-width: 4px;
  border-left-color: #ef4444;
}

.app-message--error .app-message__icon {
  color: #dc2626;
}

.app-message--success {
  color: #166534;
  background: #f0fdf4;
  border-color: #bbf7d0;
  border-left-width: 4px;
  border-left-color: #22c55e;
}

.app-message--success .app-message__icon {
  color: #16a34a;
}

.app-message--warn {
  color: #92400e;
  background: #fffbeb;
  border-color: #fde68a;
  border-left-width: 4px;
  border-left-color: #f59e0b;
}

.app-message--warn .app-message__icon {
  color: #d97706;
}

.app-message--info {
  color: #1e40af;
  background: #eff6ff;
  border-color: #bfdbfe;
  border-left-width: 4px;
  border-left-color: #3b82f6;
}

.app-message--info .app-message__icon {
  color: #2563eb;
}
</style>
