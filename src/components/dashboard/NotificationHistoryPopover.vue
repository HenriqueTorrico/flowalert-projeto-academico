<script setup>
defineProps({
  notifications: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="notify-popover" role="dialog" aria-label="Histórico de notificações">
    <header class="notify-popover__header">
      <h2 class="notify-popover__title">Notificações</h2>
      <p class="notify-popover__lead">Avisos enviados às suas turmas</p>
    </header>

    <ul v-if="notifications.length" class="notify-popover__list">
      <li
        v-for="item in notifications"
        :key="item.id"
        class="notify-popover__item"
        :class="{ 'notify-popover__item--unread': item.unread }"
      >
        <span class="notify-popover__icon" :class="`notify-popover__icon--${item.tone}`" aria-hidden="true">
          <template v-if="item.icon === 'arrow'">↰</template>
          <template v-else-if="item.icon === 'bell'">!</template>
          <template v-else>×</template>
        </span>
        <div class="notify-popover__body">
          <div class="notify-popover__row">
            <p class="notify-popover__item-title">{{ item.title }}</p>
            <time class="notify-popover__time">{{ item.time }}</time>
          </div>
          <p class="notify-popover__text">{{ item.text }}</p>
        </div>
        <span v-if="item.unread" class="notify-popover__unread" aria-label="Não lida" />
      </li>
    </ul>

    <p v-else class="notify-popover__empty">Nenhuma notificação por enquanto.</p>
  </div>
</template>

<style scoped>
.notify-popover {
  position: absolute;
  top: calc(100% + 0.55rem);
  right: 0;
  z-index: 50;
  width: min(22.5rem, calc(100vw - 2rem));
  max-height: min(24rem, 70vh);
  display: flex;
  flex-direction: column;
  padding: 0.35rem 0 0.25rem;
  background: #fff;
  border: 1px solid #ebe9e5;
  border-radius: 12px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.notify-popover__header {
  padding: 0.85rem 1rem 0.65rem;
  border-bottom: 1px solid #f0eeea;
}

.notify-popover__title {
  margin: 0 0 0.2rem;
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 700;
  color: #1f1f1f;
  letter-spacing: -0.02em;
}

.notify-popover__lead {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: #9a958d;
}

.notify-popover__list {
  list-style: none;
  margin: 0;
  padding: 0.25rem 0.5rem 0.5rem;
  overflow-y: auto;
}

.notify-popover__item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  transition: background-color 0.15s ease;
}

.notify-popover__item:hover {
  background: #faf9f7;
}

.notify-popover__item--unread {
  background: #fffdf8;
}

.notify-popover__item--unread:hover {
  background: #fff9ef;
}

.notify-popover__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  margin-top: 0.05rem;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
}

.notify-popover__icon--wine {
  color: #8b4a5e;
  background: #f8eef1;
}

.notify-popover__icon--amber {
  color: #b8862e;
  background: #fdf6e8;
}

.notify-popover__icon--slate {
  color: #4a6278;
  background: #eef2f6;
}

.notify-popover__body {
  flex: 1;
  min-width: 0;
}

.notify-popover__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.15rem;
}

.notify-popover__item-title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #2a2a2a;
}

.notify-popover__time {
  font-size: 0.6875rem;
  color: #a8a39a;
  white-space: nowrap;
}

.notify-popover__text {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #7a7772;
}

.notify-popover__unread {
  position: absolute;
  top: 0.85rem;
  right: 0.45rem;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: var(--color-accent-orange);
}

.notify-popover__empty {
  margin: 0;
  padding: 1.25rem 1rem 1.5rem;
  font-size: 0.875rem;
  text-align: center;
  color: #9a958d;
}
</style>
