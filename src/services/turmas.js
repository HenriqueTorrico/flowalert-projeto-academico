import { apiRequest } from './api'

export async function fetchTurmas() {
  const data = await apiRequest('/api/turmas')
  return data.turmas ?? []
}

export async function validateTurmaCreate(payload) {
  return apiRequest('/api/turmas/validate', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function createTurma(payload) {
  const data = await apiRequest('/api/turmas', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.turma
}

export async function updateTurma(turmaId, payload) {
  const data = await apiRequest(`/api/turmas/${turmaId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return data.turma
}

export async function validateTurmaUpdate(turmaId, payload) {
  return apiRequest('/api/turmas/validate', {
    method: 'POST',
    body: JSON.stringify({ ...payload, turmaId }),
  })
}

export async function fetchTurmaStudents(turmaId) {
  const data = await apiRequest(`/api/turmas/${turmaId}/alunos`)
  return {
    turma: data.turma,
    students: data.students ?? [],
  }
}

export async function enrollTurmaStudent(turmaId, payload) {
  const data = await apiRequest(`/api/turmas/${turmaId}/alunos`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.student
}

export async function joinTurmaByQr(turmaId) {
  const data = await apiRequest(`/api/turmas/${turmaId}/entrar`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
  return data
}
