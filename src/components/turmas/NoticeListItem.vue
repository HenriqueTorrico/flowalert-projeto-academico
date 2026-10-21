<script setup>
import { computed } from 'vue'
import TurmaChannelBadges from './TurmaChannelBadges.vue'
import { avisoDisplayDetail } from '../../utils/avisoDisplay'

const props = defineProps({
  tone: { type: String, required: true },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  detail: { type: String, default: '' },
  turmaName: { type: String, default: '' },
  turmaMeta: { type: String, default: '' },
  channels: { type: Object, default: null },
  showTurma: { type: Boolean, default: false },
  showChannels: { type: Boolean, default: false },
  sentAt: { type: String, default: '' },
})

const displayText = computed(() => {
  if (props.detail) return props.detail
  return avisoDisplayDetail({
    text: props.text,
    turmaName: props.turmaName,
  })
})

const channelProps = computed(() => props.channels ?? {})
</script>

<template>
  <li class="notice-list-item">
    <span class="notice-list-item__icon" :class="`notice-list-item__icon--${tone}`" aria-hidden="true">
      <template v-if="icon === 'arrow'">↰</template>
      <template v-else-if="icon === 'bell'">!</template>
      <template v-else>×</template>
    </span>
    <div class="notice-list-item__body">
      <p class="notice-list-item__title">{{ title }}</p>

      <div v-if="showTurma && turmaName" class="notice-list-item__turma-row">
        <span class="notice-list-item__turma">{{ turmaName }}</span>
        <span v-if="turmaMeta" class="notice-list-item__turma-meta">{{ turmaMeta }}</span>
      </div>

      <div v-if="showChannels" class="notice-list-item__delivery">
        <span class="notice-list-item__delivery-label">Enviado via</span>
        <TurmaChannelBadges :channels="channelProps" />
      </div>

      <p class="notice-list-item__text">{{ displayText }}</p>
      <p v-if="sentAt" class="notice-list-item__time">{{ sentAt }}</p>
    </div>
  </li>
</template>

<style scoped>
.notice-list-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.95rem 0;
  border-top: 1px solid #efedea;
  list-style: none;
}

.notice-list-item:first-child {
  border-top: none;
  padding-top: 0.35rem;
}

.notice-list-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  margin-top: 0.1rem;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
}

.notice-list-item__icon--wine {
  color: #8b4a5e;
  background: #f8eef1;
}

.notice-list-item__icon--amber {
  color: #b8862e;
  background: #fdf6e8;
}

.notice-list-item__icon--slate {
  color: #4a6278;
  background: #eef2f6;
}

.notice-list-item__title {
  margin: 0 0 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2a2a2a;
}

.notice-list-item__turma-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.5rem;
  margin-bottom: 0.45rem;
}

.notice-list-item__turma {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.35;
  color: #5c3d8f;
  background: #f3eefb;
  border: 1px solid #e3d9f2;
  border-radius: 999px;
}

.notice-list-item__turma-meta {
  font-size: 0.75rem;
  font-weight: 500;
  color: #9a958d;
}

.notice-list-item__delivery {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.5rem;
  margin-bottom: 0.45rem;
}

.notice-list-item__delivery-label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #9a958d;
}

.notice-list-item__text {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #7a7772;
}

.notice-list-item__time {
  margin: 0.35rem 0 0;
  font-size: 0.75rem;
  color: #9a958d;
}
</style>
