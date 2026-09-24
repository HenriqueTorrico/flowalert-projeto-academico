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
    return {
      title: 'Sem aula',
      body: `${name}: não haverá aula${suffix}.`,
    }
  }

  return {
    title: 'Aviso geral',
    body: `${name}: ${message?.trim() || '…'}`,
  }
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
