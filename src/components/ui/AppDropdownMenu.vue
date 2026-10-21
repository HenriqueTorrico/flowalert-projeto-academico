<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  label: { type: String, default: 'Abrir menu' },
  align: { type: String, default: 'right' },
})

const emit = defineEmits(['open', 'close'])

const rootRef = ref(null)
const open = ref(false)

function setOpen(next) {
  if (open.value === next) return
  open.value = next
  emit(next ? 'open' : 'close')
}

function toggle() {
  setOpen(!open.value)
}

function close() {
  setOpen(false)
}

function onDocumentPointerDown(event) {
  const root = rootRef.value
  if (!root || !open.value) return
  if (!root.contains(event.target)) {
    close()
  }
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape' && open.value) {
    close()
  }
}

function onMenuClick(event) {
  const item = event.target.closest('.app-dropdown__item')
  if (item && !item.disabled) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
})

defineExpose({ close })
</script>

<template>
  <div ref="rootRef" class="app-dropdown" :class="`app-dropdown--${align}`">
    <button
      type="button"
      class="app-dropdown__trigger"
      :aria-label="label"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="toggle"
    >
      <slot name="trigger">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 7h14M5 12h14M5 17h14"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
          />
        </svg>
      </slot>
    </button>

    <Transition name="app-dropdown-fade">
      <div
        v-if="open"
        class="app-dropdown__panel"
        role="menu"
        :aria-label="label"
        @click="onMenuClick"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-dropdown {
  position: relative;
  display: inline-flex;
}

.app-dropdown--right .app-dropdown__panel {
  right: 0;
}

.app-dropdown--left .app-dropdown__panel {
  left: 0;
}

.app-dropdown__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin: 0;
  padding: 0;
  color: #6b6760;
  background: #fff;
  border: 1px solid #ebe9e5;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;
}

.app-dropdown__trigger:hover {
  background: #faf9f7;
  border-color: #ddd9d3;
  color: #3d3d3d;
}

.app-dropdown__trigger:focus-visible {
  outline: 2px solid rgba(240, 168, 48, 0.55);
  outline-offset: 2px;
}

.app-dropdown__panel {
  position: absolute;
  top: calc(100% + 0.35rem);
  z-index: 20;
  min-width: 11.5rem;
  padding: 0.35rem;
  background: #fff;
  border: 1px solid #ebe9e5;
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.1);
}

.app-dropdown-fade-enter-active,
.app-dropdown-fade-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.app-dropdown-fade-enter-from,
.app-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<style>
.app-dropdown__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.65rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: left;
  color: #2a2a2a;
  background: transparent;
  border: none;
  border-radius: 7px;
  cursor: pointer;
}

.app-dropdown__item:hover:not(:disabled) {
  background: #f7f6f4;
}

.app-dropdown__item:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
