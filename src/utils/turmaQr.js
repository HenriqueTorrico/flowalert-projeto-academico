export function getTurmaJoinUrl(turmaId) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/entrar-turma/${turmaId}`
}

export function getTurmaQrImageUrl(turmaId) {
  const data = getTurmaJoinUrl(turmaId)
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=14&data=${encodeURIComponent(data)}`
}
