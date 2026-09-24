<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  id: { type: Number, required: true },
  variant: { type: String, default: 'success' },
  message: { type: String, default: '' },
  title: { type: String, default: '' },
  duration: { type: Number, default: 4800 },
})

const emit = defineEmits(['dismiss'])

const visible = ref(true)
let timer = null

function startDismiss() {
  if (!visible.value) return
  visible.value = false
}

function onAfterLeave() {
  emit('dismiss', props.id)
}

onMounted(() => {
  timer = setTimeout(startDismiss, props.duration)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Transition name="toast" appear @after-leave="onAfterLeave">
    <article
      v-if="visible"
      class="app-toast"
      :class="`app-toast--${variant}`"
      role="status"
      :aria-live="variant === 'error' ? 'assertive' : 'polite'"
    >
      <span class="app-toast__icon" aria-hidden="true">
        <svg v-if="variant === 'success'" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12.5l4.2 4.2L19 7"
            stroke="currentColor"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
        </svg>
      </span>

      <div class="app-toast__content">
        <p v-if="variant === 'error' && title" class="app-toast__title">{{ title }}</p>
        <p class="app-toast__message">{{ message }}</p>
      </div>

      <div
        class="app-toast__progress"
        :style="{ animationDuration: `${duration}ms` }"
        aria-hidden="true"
      />
    </article>
  </Transition>
</template>

<style scoped>
.app-toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: min(22rem, calc(100vw - 2rem));
  padding: 0.85rem 1rem 1rem;
  overflow: hidden;
  color: #f4f6fb;
  background: #0f1728;
  border-radius: 12px;
  box-shadow: 0 14px 36px rgba(8, 12, 24, 0.35);
}

.app-toast__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  margin-top: 0.05rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.app-toast--success .app-toast__icon {
  color: #fff;
  background: #3d8f6e;
}

.app-toast--error .app-toast__icon {
  color: #fff;
  background: #c94b4b;
}

.app-toast__content {
  flex: 1;
  min-width: 0;
  padding-right: 0.15rem;
}

.app-toast__title {
  margin: 0 0 0.15rem;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.35;
  color: #ffb4b4;
}

.app-toast__message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.45;
  color: #f4f6fb;
}

.app-toast--success .app-toast__message {
  font-weight: 500;
}

.app-toast__progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  transform-origin: left center;
  animation-name: toast-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.app-toast--success .app-toast__progress {
  background: linear-gradient(90deg, #3d8f6e, #5cb896);
}

.app-toast--error .app-toast__progress {
  background: linear-gradient(90deg, #c94b4b, #e07070);
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.toast-enter-active {
  transition:
    opacity 0.32s ease,
    transform 0.36s cubic-bezier(0.33, 1, 0.68, 1);
}

.toast-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.26s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
