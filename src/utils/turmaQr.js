export function getTurmaJoinUrl(turmaId) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/entrar-turma/${turmaId}`
}

export function getTurmaQrImageUrl(turmaId) {
  const data = getTurmaJoinUrl(turmaId)
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=14&data=${encodeURIComponent(data)}`
}

export function buildTurmaQrWhatsAppShareMessage(turma, joinUrl) {
  const name = String(turma?.name ?? '').trim() || 'sua turma'
  const meta = String(turma?.meta ?? '').trim()
  const metaSuffix = meta ? ` (${meta})` : ''
  const link = String(joinUrl ?? '').trim()

  return [
    `Olá! Entre na turma *${name}*${metaSuffix} pelo FlowAlert:`,
    '',
    link,
    '',
    'Abra o link com sua conta de *aluno* para concluir a matrícula.',
  ].join('\n')
}
