<script setup>
import { computed, ref, watch } from 'vue'
import TurmaChannelBadges from '../turmas/TurmaChannelBadges.vue'
import { fetchAvisoDetail } from '../../services/avisos'
import { avisoDisplayDetail } from '../../utils/avisoDisplay'
import { formatNoticeSentAt } from '../../utils/noticePreview'
import { formatWhatsappDisplay } from '../../utils/whatsapp'
import { listActiveTurmaChannels } from '../../utils/turmaChannels'

const props = defineProps({
  aviso: { type: Object, required: true },
})

const expanded = ref(false)
const loading = ref(false)
const detail = ref(null)
const loadError = ref('')

const displayText = computed(() =>
  avisoDisplayDetail(props.aviso),
)

const sentAtLabel = computed(() => formatNoticeSentAt(props.aviso.sentAt))

const stats = computed(() => props.aviso.stats ?? { deliveries: 0, recipients: 0, views: 0 })

const statsLine = computed(() => {
  const s = stats.value
  return `${s.recipients} aluno(s) · ${s.deliveries} entrega(s) · ${s.views} visualização(ões)`
})

const DETAIL_TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'viewed', label: 'Visualizados' },
  { id: 'unviewed', label: 'Não visualizados' },
]

const detailTab = ref('all')

function channelLabel(key) {
  const map = { email: 'E-mail', whatsapp: 'WhatsApp', telegram: 'Telegram' }
  return map[key] ?? key
}

async function loadDetail() {
  if (detail.value || loading.value) return
  loading.value = true
  loadError.value = ''
  try {
    detail.value = await fetchAvisoDetail(props.aviso.id)
  } catch {
    loadError.value = 'Não foi possível carregar entregas e visualizações.'
  } finally {
    loading.value = false
  }
}

function toggleExpanded() {
  expanded.value = !expanded.value
  if (expanded.value) {
    loadDetail()
  }
}

watch(
  () => props.aviso.id,
  () => {
    expanded.value = false
    detail.value = null
    loadError.value = ''
    detailTab.value = 'all'
  },
)

const delivered = computed(() => detail.value?.delivered ?? [])
const viewed = computed(() => detail.value?.viewed ?? [])
const activeChannels = computed(() => listActiveTurmaChannels(props.aviso.channels ?? {}))

const recipients = computed(() => {
  const viewByUser = new Map(viewed.value.map((item) => [item.userId, item]))
  return delivered.value.map((person) => {
    const view = viewByUser.get(person.userId)
    return {
      ...person,
      viewedAt: view?.viewedAt ?? null,
      viewChannel: view?.channel ?? null,
    }
  })
})

const tabCounts = computed(() => {
  const list = recipients.value
  const viewedCount = list.filter((person) => person.viewedAt).length
  return {
    all: list.length,
    viewed: viewedCount,
    unviewed: list.length - viewedCount,
  }
})

const filteredRecipients = computed(() => {
  const list = recipients.value
  if (detailTab.value === 'viewed') return list.filter((person) => person.viewedAt)
  if (detailTab.value === 'unviewed') return list.filter((person) => !person.viewedAt)
  return list
})

const recipientsEmptyMessage = computed(() => {
  if (!recipients.value.length) {
    return 'Nenhuma entrega registrada para este aviso.'
  }
  if (filteredRecipients.value.length > 0) {
    return ''
  }
  if (detailTab.value === 'viewed') {
    return 'Nenhum aluno visualizou este aviso ainda.'
  }
  if (detailTab.value === 'unviewed') {
    return 'Todos os alunos desta entrega já visualizaram.'
  }
  return ''
})
</script>

<template>
  <article class="aviso-feed-card" :class="{ 'aviso-feed-card--expanded': expanded }">
    <button type="button" class="aviso-feed-card__header" @click="toggleExpanded">
      <span class="aviso-feed-card__icon" :class="`aviso-feed-card__icon--${aviso.tone}`" aria-hidden="true">
        <template v-if="aviso.icon === 'arrow'">↰</template>
        <template v-else-if="aviso.icon === 'bell'">!</template>
        <template v-else>×</template>
      </span>

      <div class="aviso-feed-card__summary">
        <div class="aviso-feed-card__row">
          <h3 class="aviso-feed-card__title">{{ aviso.title }}</h3>
          <time class="aviso-feed-card__time" :datetime="aviso.sentAt">{{ sentAtLabel }}</time>
        </div>

        <div class="aviso-feed-card__turma-row">
          <span class="aviso-feed-card__turma">{{ aviso.turmaName }}</span>
          <span v-if="aviso.turmaMeta" class="aviso-feed-card__turma-meta">{{ aviso.turmaMeta }}</span>
        </div>

        <p class="aviso-feed-card__text">{{ displayText }}</p>

        <div class="aviso-feed-card__meta">
          <TurmaChannelBadges :channels="aviso.channels" />
          <span class="aviso-feed-card__stats">{{ statsLine }}</span>
        </div>
      </div>

      <span class="aviso-feed-card__chevron" :class="{ 'aviso-feed-card__chevron--open': expanded }" aria-hidden="true">
        ▾
      </span>
    </button>

    <div v-if="expanded" class="aviso-feed-card__detail">
      <p v-if="loading" class="aviso-feed-card__hint">Carregando detalhes…</p>
      <p v-else-if="loadError" class="aviso-feed-card__error">{{ loadError }}</p>
      <template v-else>
        <div class="aviso-feed-card__recipients">
          <div class="aviso-feed-card__tabs" role="tablist" aria-label="Filtrar alunos">
            <button
              v-for="tab in DETAIL_TABS"
              :key="tab.id"
              type="button"
              role="tab"
              class="aviso-feed-card__tab"
              :class="{ 'aviso-feed-card__tab--active': detailTab === tab.id }"
              :aria-selected="detailTab === tab.id"
              @click="detailTab = tab.id"
            >
              {{ tab.label }}
              <span class="aviso-feed-card__tab-count">{{ tabCounts[tab.id] }}</span>
            </button>
          </div>

          <p v-if="recipientsEmptyMessage" class="aviso-feed-card__empty">
            {{ recipientsEmptyMessage }}
          </p>
          <ul v-else class="aviso-feed-card__people">
            <li
              v-for="person in filteredRecipients"
              :key="person.userId"
              class="aviso-feed-card__person"
            >
              <div class="aviso-feed-card__person-main">
                <p class="aviso-feed-card__person-name">{{ person.name }}</p>
                <p class="aviso-feed-card__person-contact">{{ person.email }}</p>
                <p v-if="person.whatsapp" class="aviso-feed-card__person-contact">
                  {{ formatWhatsappDisplay(person.whatsapp) }}
                </p>
              </div>
              <div class="aviso-feed-card__person-status">
                <template v-if="person.viewedAt">
                  <p class="aviso-feed-card__status-label aviso-feed-card__status-label--viewed">
                    Visualizado
                  </p>
                  <p class="aviso-feed-card__status-meta">
                    {{ formatNoticeSentAt(person.viewedAt) }}
                  </p>
                  <p v-if="person.viewChannel" class="aviso-feed-card__status-meta">
                    via {{ channelLabel(person.viewChannel) }}
                  </p>
                </template>
                <p v-else class="aviso-feed-card__status-label aviso-feed-card__status-label--pending">
                  Não visualizado
                </p>
              </div>
            </li>
          </ul>
        </div>

        <p v-if="activeChannels.length" class="aviso-feed-card__channels-note">
          Canais da turma no envio:
          <TurmaChannelBadges :channels="aviso.channels" />
        </p>
      </template>
    </div>
  </article>
</template>

<style scoped>
.aviso-feed-card {
  background: #fff;
  border: 1px solid #ebe9e5;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.aviso-feed-card--expanded {
  border-color: #e3dfd6;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.aviso-feed-card__header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.05rem;
  font: inherit;
  text-align: left;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
}

.aviso-feed-card__header:hover {
  background: #fafaf8;
}

.aviso-feed-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  margin-top: 0.1rem;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
}

.aviso-feed-card__icon--wine {
  color: #8b4a5e;
  background: #f8eef1;
}

.aviso-feed-card__icon--amber {
  color: #b8862e;
  background: #fdf6e8;
}

.aviso-feed-card__icon--slate {
  color: #4a6278;
  background: #eef2f6;
}

.aviso-feed-card__summary {
  flex: 1;
  min-width: 0;
}

.aviso-feed-card__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.aviso-feed-card__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #2a2a2a;
}

.aviso-feed-card__time {
  font-size: 0.75rem;
  color: #9a958d;
  white-space: nowrap;
}

.aviso-feed-card__turma-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
  margin-bottom: 0.4rem;
}

.aviso-feed-card__turma {
  display: inline-block;
  padding: 0.12rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #5c3d8f;
  background: #f3eefb;
  border-radius: 999px;
}

.aviso-feed-card__turma-meta {
  font-size: 0.75rem;
  color: #9a958d;
}

.aviso-feed-card__text {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #7a7772;
}

.aviso-feed-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
}

.aviso-feed-card__stats {
  font-size: 0.72rem;
  font-weight: 600;
  color: #9a958d;
}

.aviso-feed-card__chevron {
  margin-top: 0.35rem;
  font-size: 0.85rem;
  color: #9a958d;
  transition: transform 0.2s ease;
}

.aviso-feed-card__chevron--open {
  transform: rotate(180deg);
}

.aviso-feed-card__detail {
  padding: 0 1.05rem 1rem;
  border-top: 1px solid #efedea;
}

.aviso-feed-card__recipients {
  margin-top: 0.85rem;
}

.aviso-feed-card__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.75rem;
}

.aviso-feed-card__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.7rem;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6f6c66;
  background: #fff;
  border: 1px solid #e3e0db;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.aviso-feed-card__tab:hover {
  border-color: #d4cfc6;
  color: #4a4742;
}

.aviso-feed-card__tab--active {
  color: #5c3d8f;
  background: #f3eefb;
  border-color: #c9b8e8;
}

.aviso-feed-card__tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.15rem;
  padding: 0.05rem 0.35rem;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.2;
  color: inherit;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 999px;
}

.aviso-feed-card__tab--active .aviso-feed-card__tab-count {
  background: rgba(92, 61, 143, 0.12);
}

.aviso-feed-card__people {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 14rem;
  overflow-y: auto;
}

.aviso-feed-card__person {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 0;
  border-top: 1px solid #f0eeea;
}

.aviso-feed-card__person-main {
  flex: 1;
  min-width: 0;
}

.aviso-feed-card__person-status {
  flex-shrink: 0;
  max-width: 9.5rem;
  text-align: right;
}

.aviso-feed-card__person:first-child {
  border-top: none;
  padding-top: 0;
}

.aviso-feed-card__person-name {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #2a2a2a;
}

.aviso-feed-card__person-contact {
  margin: 0.1rem 0 0;
  font-size: 0.75rem;
  color: #8a8680;
}

.aviso-feed-card__status-label {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
}

.aviso-feed-card__status-label--viewed {
  color: #2f6b4f;
}

.aviso-feed-card__status-label--pending {
  color: #9a958d;
}

.aviso-feed-card__status-meta {
  margin: 0.2rem 0 0;
  font-size: 0.7rem;
  line-height: 1.35;
  color: #8a8680;
}

.aviso-feed-card__empty,
.aviso-feed-card__hint {
  margin: 0;
  font-size: 0.8125rem;
  color: #9a958d;
}

.aviso-feed-card__error {
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: #b42318;
}

.aviso-feed-card__channels-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin: 0.85rem 0 0;
  font-size: 0.75rem;
  color: #9a958d;
}

@media (max-width: 640px) {
  .aviso-feed-card__person {
    flex-direction: column;
    gap: 0.45rem;
  }

  .aviso-feed-card__person-status {
    max-width: none;
    text-align: left;
  }
}
</style>
