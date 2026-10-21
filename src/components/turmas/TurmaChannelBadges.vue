<script setup>
import { computed } from 'vue'
import { listActiveTurmaChannels } from '../../utils/turmaChannels'

const props = defineProps({
  channels: { type: Object, default: () => ({}) },
})

const activeChannels = computed(() => listActiveTurmaChannels(props.channels))
</script>

<template>
  <div v-if="activeChannels.length" class="turma-channels-badges" aria-label="Meios de aviso">
    <span
      v-for="channel in activeChannels"
      :key="channel.key"
      class="turma-channels-badges__item"
    >
      <span class="turma-channels-badges__icon" aria-hidden="true">
        <svg
          v-if="channel.key === 'email'"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 7.5 12 13l8-5.5M5 18h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="channel.key === 'whatsapp'"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 3a8 8 0 0 0-6.93 12.04L4 21l6.08-1.58A8 8 0 1 0 12 3Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <path
            d="M9.2 10.2c.2-.55.85-.9 1.2-.85.35.05.75.55 1 .75.2.15.15.55-.05.75-.15.15-.3.35-.15.55.3.45 1.05 1.05 1.55 1.2.25.1.55 0 .7-.2.2-.25.45-.55.7-.45.6.25 1.15.55 1.55.95"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
          />
        </svg>
        <svg
          v-else
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 4 10.5 13.5M21 4l-6.5 17L10.5 13.5 3 10.5 21 4Z"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      {{ channel.label }}
    </span>
  </div>
</template>

<style scoped>
.turma-channels-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.turma-channels-badges__item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.5rem 0.2rem 0.4rem;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: 0.01em;
  color: #6f6c66;
  background: #f7f6f4;
  border: 1px solid #ebe9e5;
  border-radius: 999px;
}

.turma-channels-badges__icon {
  display: inline-flex;
  flex-shrink: 0;
  color: #8a8680;
}
</style>
