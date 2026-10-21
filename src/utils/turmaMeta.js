export function parseRoomFromTurmaMeta(meta) {
  if (!meta || typeof meta !== 'string') return ''

  const salaMatch = meta.match(/Sala\s+([^·]+)/i)
  if (salaMatch) return salaMatch[1].trim()

  const parts = meta.split('·')
  return parts[0]?.trim() ?? ''
}
