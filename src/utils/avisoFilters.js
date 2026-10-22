export function avisoYearFromSentAt(sentAt) {
  if (!sentAt) return null
  const date = new Date(sentAt)
  if (Number.isNaN(date.getTime())) return null
  return date.getFullYear()
}

export function filterAvisosList(avisos, { turmaId = 'all', year = 'all', search = '' } = {}) {
  const term = search.trim().toLowerCase()

  return avisos.filter((aviso) => {
    if (turmaId !== 'all' && String(aviso.turmaId) !== String(turmaId)) {
      return false
    }

    if (year !== 'all') {
      const avisoYear = avisoYearFromSentAt(aviso.sentAt)
      if (avisoYear !== Number(year)) return false
    }

    if (!term) return true

    const haystack = [
      aviso.title,
      aviso.turmaName,
      aviso.detail,
      aviso.text,
      aviso.turmaMeta,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(term)
  })
}
