export const DUPLICATE_TURMA_MESSAGE =
  'Já existe uma turma com este nome nesta sala e neste turno.'

function normalizePart(value) {
  return String(value ?? '').trim().toLowerCase()
}

export function isSameTurmaSlot(a, b) {
  return (
    normalizePart(a.name) === normalizePart(b.name) &&
    normalizePart(a.room) === normalizePart(b.room) &&
    a.period === b.period
  )
}

export function hasTurmaDuplicate(turmas, candidate) {
  return turmas.some((turma) =>
    isSameTurmaSlot(
      { name: turma.name, room: turma.room, period: turma.period },
      candidate,
    ),
  )
}
