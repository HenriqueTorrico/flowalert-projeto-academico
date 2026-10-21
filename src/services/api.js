import { getStoredToken } from './auth'

const GENERIC_ERROR = 'Ocorreu um erro. Tente novamente.'

export function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL ?? ''
  return `${base}${path}`
}

export async function apiRequest(path, options = {}) {
  const token = getStoredToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(apiUrl(path), { ...options, headers })
  } catch {
    throw new Error(GENERIC_ERROR)
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      response.status >= 500
        ? GENERIC_ERROR
        : typeof data.error === 'string'
          ? data.error
          : GENERIC_ERROR

    const error = new Error(message)

    if (response.status < 500 && data.fields && typeof data.fields === 'object') {
      error.fields = data.fields
    }

    throw error
  }

  return data
}
