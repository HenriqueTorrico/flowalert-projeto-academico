export const TURMA_CHANNEL_META = [
  { key: 'email', label: 'E-mail' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'telegram', label: 'Telegram' },
]

export function listActiveTurmaChannels(channels) {
  if (!channels || typeof channels !== 'object') return []
  return TURMA_CHANNEL_META.filter((item) => Boolean(channels[item.key]))
}
