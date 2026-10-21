export function avisoDisplayDetail(aviso) {
  if (!aviso) return ''
  if (aviso.detail) return aviso.detail
  const body = aviso.text ?? ''
  const turmaName = aviso.turmaName
  if (!turmaName) return body
  const prefix = `${turmaName}: `
  return body.startsWith(prefix) ? body.slice(prefix.length) : body
}

export function avisoNotificationSummary(aviso) {
  if (!aviso) return ''
  const turmaName = aviso.turmaName?.trim()
  const detail = avisoDisplayDetail(aviso)
  if (turmaName && detail) return `${turmaName}: ${detail}`
  return aviso.text || detail || aviso.title || 'Aviso'
}
