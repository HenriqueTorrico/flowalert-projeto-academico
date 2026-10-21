<script setup>
import { useToast } from '../../composables/useToast'
import AppToast from './AppToast.vue'

const { items, dismiss } = useToast()
</script>

<template>
  <div class="toast-host" aria-live="polite">
    <AppToast
      v-for="toast in items"
      :key="toast.id"
      :id="toast.id"
      :variant="toast.variant"
      :message="toast.message"
      :title="toast.title"
      :duration="toast.duration"
      @dismiss="dismiss"
    />
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: 1.15rem;
  left: 50%;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  width: min(22rem, calc(100vw - 2rem));
  transform: translateX(-50%);
  pointer-events: none;
}

.toast-host :deep(.app-toast) {
  pointer-events: auto;
}
</style>
