export function getInitials(name) {
  if (!name) return '?'
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function getFirstName(name) {
  if (!name) return ''
  return String(name).trim().split(/\s+/)[0]
}

export function formatDashboardDate(date = new Date()) {
  const raw = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}
