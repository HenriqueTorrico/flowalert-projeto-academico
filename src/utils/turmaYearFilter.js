export function getLastTurmaYearOptions(count = 5, now = new Date()) {
  const currentYear = now.getFullYear()
  const years = []
  for (let offset = 0; offset < count; offset += 1) {
    years.push(currentYear - offset)
  }
  return years
}

export function filterTurmasByYear(turmas, yearFilter) {
  if (yearFilter === 'all' || yearFilter == null) {
    return turmas
  }
  const year = Number(yearFilter)
  if (!Number.isInteger(year)) return turmas

  return turmas.filter((turma) => {
    if (turma.year == null) return false
    return turma.year === year
  })
}

export function countTurmasByYear(turmas, year) {
  const y = Number(year)
  if (!Number.isInteger(y)) return 0
  return turmas.filter((turma) => turma.year === y).length
}
