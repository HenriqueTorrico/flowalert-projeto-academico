<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { createInitialNotifications } from '../../data/mockNotifications'
import { getInitials } from '../../utils/userDisplay'
import NotificationHistoryPopover from './NotificationHistoryPopover.vue'

defineProps({
  userName: { type: String, default: '' },
  searchPlaceholder: { type: String, default: 'Buscar' },
})

const notificationsOpen = ref(false)
const notifyRootRef = ref(null)
const notifications = ref(createInitialNotifications())

const hasUnread = computed(() => notifications.value.some((item) => item.unread))

function toggleNotifications() {
  notificationsOpen.value = !notificationsOpen.value
}

function closeNotifications() {
  notificationsOpen.value = false
}

function markAllAsRead() {
  notifications.value.forEach((item) => {
    item.unread = false
  })
}

watch(notificationsOpen, (isOpen) => {
  if (isOpen) markAllAsRead()
})

function onDocumentPointerDown(event) {
  const root = notifyRootRef.value
  if (!root || root.contains(event.target)) return
  closeNotifications()
}

function onKeydown(event) {
  if (event.key === 'Escape') closeNotifications()
}

watch(notificationsOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header class="topbar">
    <label class="topbar__search">
      <span class="topbar__search-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.75" />
          <path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        </svg>
      </span>
      <input
        type="search"
        class="topbar__search-input"
        :placeholder="searchPlaceholder"
        :aria-label="searchPlaceholder"
      />
    </label>

    <div class="topbar__actions">
      <div ref="notifyRootRef" class="topbar__notify">
        <button
          type="button"
          class="topbar__icon-btn topbar__icon-btn--notify"
          :class="{ 'topbar__icon-btn--active': notificationsOpen }"
          :aria-expanded="notificationsOpen"
          aria-haspopup="dialog"
          aria-label="Notificações"
          @click="toggleNotifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 17H9l-1 2h8l-1-2ZM5 9a7 7 0 0 1 14 0c0 5 2 6 2 6H3s2-1 2-6Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
          </svg>
          <span v-if="hasUnread" class="topbar__notify-dot" aria-hidden="true" />
        </button>

        <Transition name="notify-pop">
          <NotificationHistoryPopover v-if="notificationsOpen" :notifications="notifications" />
        </Transition>
      </div>

      <span class="topbar__avatar">{{ getInitials(userName) }}</span>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.75rem 0.85rem;
}

.topbar__search {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex: 1;
  max-width: 22rem;
  padding: 0.55rem 0.85rem;
  background: #fff;
  border: 1px solid #e8e6e2;
  border-radius: 999px;
  color: #9a958d;
}

.topbar__search-input {
  width: 100%;
  border: none;
  outline: none;
  font: inherit;
  font-size: 0.875rem;
  color: var(--color-ink);
  background: transparent;
  cursor: text;
}

.topbar__search-input::placeholder {
  color: #a8a39a;
}

.topbar__actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.topbar__notify {
  position: relative;
}

.topbar__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  border: none;
  background: transparent;
  color: #5c5a56;
  cursor: pointer;
  border-radius: 6px;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease;
}

.topbar__icon-btn--notify {
  position: relative;
  padding: 0.5rem;
  background: #fff;
  border: 1px solid #ddd9d3;
  border-radius: 10px;
}

.topbar__icon-btn--notify:hover,
.topbar__icon-btn--active {
  border-color: #cfc9c0;
  background: #faf9f7;
}

.topbar__notify-dot {
  position: absolute;
  top: 0.35rem;
  right: 0.38rem;
  width: 0.45rem;
  height: 0.45rem;
  border: 2px solid #fff;
  border-radius: 50%;
  background: var(--color-accent-orange);
}

.topbar__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  background: #7a3d5c;
}

.notify-pop-enter-active,
.notify-pop-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.24s cubic-bezier(0.33, 1, 0.68, 1);
}

.notify-pop-enter-from,
.notify-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
