import { apiRequest } from './api'

export async function fetchTurmaAvisos(turmaId) {
  const data = await apiRequest(`/api/turmas/${turmaId}/avisos`)
  return data.avisos ?? []
}

export async function createAviso(turmaId, payload) {
  const data = await apiRequest(`/api/turmas/${turmaId}/avisos`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.aviso
}

export async function fetchAllAvisos() {
  const data = await apiRequest('/api/avisos')
  return data.avisos ?? []
}

export async function fetchAvisoDetail(avisoId) {
  return apiRequest(`/api/avisos/${avisoId}`)
}
