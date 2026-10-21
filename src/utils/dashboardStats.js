function toLocalDateKey(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function startOfWeekMonday(date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function isToday(sentAt, now = new Date()) {
  if (!sentAt) return false
  return toLocalDateKey(sentAt) === toLocalDateKey(now)
}

export function isThisCalendarWeek(sentAt, now = new Date()) {
  if (!sentAt) return false
  const date = new Date(sentAt)
  if (Number.isNaN(date.getTime())) return false
  const weekStart = startOfWeekMonday(now)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)
  return date >= weekStart && date < weekEnd
}

export function buildDashboardMetrics(avisos, turmasById, now = new Date()) {
  const turmaStudentCount = (turmaId) => turmasById.get(turmaId)?.studentsCount ?? 0

  let avisosToday = 0
  let roomChangesThisWeek = 0
  const turmasNotifiedToday = new Set()

  for (const aviso of avisos) {
    if (isToday(aviso.sentAt, now)) {
      avisosToday += 1
      turmasNotifiedToday.add(aviso.turmaId)
    }
    if (aviso.scenario === 'room_change' && isThisCalendarWeek(aviso.sentAt, now)) {
      roomChangesThisWeek += 1
    }
  }

  let studentsNotifiedToday = 0
  for (const turmaId of turmasNotifiedToday) {
    studentsNotifiedToday += turmaStudentCount(turmaId)
  }

  const recentNotices = avisos.slice(0, 8).map((aviso) => {
    const turma = turmasById.get(aviso.turmaId)
    const detail = aviso.detail || aviso.text || aviso.title || 'Aviso'
    const turmaLabel = aviso.turmaName || turma?.name
    const text = turmaLabel ? `${turmaLabel} - ${detail}` : detail
    return {
      id: aviso.id,
      tone: aviso.tone,
      text,
    }
  })

  return {
    avisosToday,
    studentsNotifiedToday,
    roomChangesThisWeek,
    recentNotices,
  }
}
