<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  maxWidth: { type: String, default: '26rem' },
})

const emit = defineEmits(['close'])

function onBackdropClick() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div v-if="open" class="modal-root">
        <button type="button" class="modal-backdrop" aria-label="Fechar" @click="onBackdropClick" />
        <div
          class="modal-panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'modal-title' : undefined"
          :style="{ maxWidth }"
          @click.stop
        >
          <header class="modal-panel__header">
            <h2 id="modal-title" class="modal-panel__title">{{ title }}</h2>
            <p v-if="description" class="modal-panel__description">{{ description }}</p>
          </header>

          <div class="modal-panel__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="modal-panel__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  border: none;
  background: rgba(26, 35, 56, 0.45);
  cursor: pointer;
}

.modal-panel {
  position: relative;
  width: 100%;
  padding: 1.5rem 1.5rem 1.35rem;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.18);
}

.modal-panel__header {
  margin-bottom: 1.25rem;
}

.modal-panel__title {
  margin: 0 0 0.4rem;
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 700;
  color: #1f1f1f;
  letter-spacing: -0.02em;
}

.modal-panel__description {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #7a7772;
}

.modal-panel__body {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.modal-panel__body :deep(form) {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.modal-panel__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.5rem;
  padding-top: 1.15rem;
  border-top: 1px solid #efedea;
}

.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.28s ease;
}

.modal-overlay-enter-active .modal-panel,
.modal-overlay-leave-active .modal-panel {
  transition:
    transform 0.32s cubic-bezier(0.33, 1, 0.68, 1),
    opacity 0.28s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

.modal-overlay-enter-from .modal-panel,
.modal-overlay-leave-to .modal-panel {
  opacity: 0;
  transform: scale(0.96) translateY(10px);
}
</style>
