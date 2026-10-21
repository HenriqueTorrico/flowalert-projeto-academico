function formatDateBr(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-')
  if (!y || !m || !d) return isoDate
  return `${d}/${m}/${y}`
}

export function buildNoticePreview({ scenario, turmaName, currentRoom, newRoom, date, message }) {
  const name = turmaName || 'Turma'

  if (scenario === 'room_change') {
    const dest = newRoom?.trim() || '-'
    const before = currentRoom?.trim() || '-'
    return {
      title: 'Mudança de sala',
      body: `${name}: a aula agora será na sala ${dest} (antes ${before}).`,
    }
  }

  if (scenario === 'no_class') {
    const when = formatDateBr(date)
    const suffix = when ? ` em ${when}` : ' hoje'
    const reason = message?.trim()
    const reasonSuffix = reason ? ` Motivo: ${reason}` : ''
    return {
      title: 'Sem aula',
      body: `${name}: não haverá aula${suffix}.${reasonSuffix}`,
    }
  }

  return {
    title: 'Aviso geral',
    body: `${name}: ${message?.trim() || '…'}`,
  }
}

export function formatNoticeSentAt(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function formatRelativeNoticeTime(value = new Date(), now = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return 'Agora'

  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Agora'
  if (diffMin < 60) return `Há ${diffMin} min`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24 && startOfLocalDay(now).getTime() === startOfLocalDay(date).getTime()) {
    return diffHours === 1 ? 'Há 1 h' : `Há ${diffHours} h`
  }

  const yesterday = new Date(startOfLocalDay(now))
  yesterday.setDate(yesterday.getDate() - 1)
  if (startOfLocalDay(date).getTime() === yesterday.getTime()) {
    return 'Ontem'
  }

  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
  if (diffMs < 7 * 24 * 60 * 60 * 1000) {
    return weekday.charAt(0).toUpperCase() + weekday.slice(1)
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function buildSentNoticeRecord({ scenario, turmaName, currentRoom, newRoom, date, message }) {
  const preview = buildNoticePreview({
    scenario,
    turmaName,
    currentRoom,
    newRoom,
    date,
    message,
  })

  const tone = scenario === 'room_change' ? 'wine' : scenario === 'no_class' ? 'amber' : 'slate'
  const icon = scenario === 'room_change' ? 'arrow' : scenario === 'no_class' ? 'x' : 'bell'

  return {
    tone,
    icon,
    title: preview.title,
    text: preview.body,
  }
}
