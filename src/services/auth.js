const TOKEN_KEY = 'flowalert_token'
const USER_KEY = 'flowalert_user'

function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL ?? ''
  return `${base}${path}`
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function login(email, password) {
  const response = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error ?? 'Não foi possível entrar.')
  }

  setSession(data.token, data.user)
  return data
}

export async function fetchCurrentUser() {
  const token = getStoredToken()
  if (!token) return null

  const response = await fetch(apiUrl('/api/auth/me'), {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (response.status === 401) {
    clearSession()
    return null
  }

  if (!response.ok) {
    throw new Error('Não foi possível validar a sessão.')
  }

  const data = await response.json()
  setSession(token, data.user)
  return data.user
}

export async function logout() {
  const token = getStoredToken()

  if (token) {
    try {
      await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      // Sessão local é encerrada mesmo se a API estiver indisponível
    }
  }

  clearSession()
}
