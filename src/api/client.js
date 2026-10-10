const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const TOKEN_KEY = 'cinebook_admin_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }

  /** Per-field validation messages from the backend, e.g. { name: 'Name is required' } */
  get fieldErrors() {
    return this.data?.fieldErrors ?? {}
  }
}

// Set by AuthProvider: what to do when the backend says the token is no longer valid
let onUnauthorized = () => {}
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

function buildUrl(url, params) {
  const query = new URLSearchParams()
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, value)
  })
  const queryString = query.toString()
  return `${BASE_URL}${url}${queryString ? `?${queryString}` : ''}`
}

function parseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * @param {string} url      path after the base URL, e.g. '/admin/cities'
 * @param {object} options  { method, body, params, signal }
 * @returns the parsed JSON response (or null for empty responses)
 */
export async function apiRequest(url, { method = 'GET', body, params, signal } = {}) {
  const token = tokenStore.get()
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(buildUrl(url, params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Cannot reach the server. Please check that the backend is running.', 0)
  }

  const text = await response.text()
  const data = text ? parseJson(text) : null

  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized()
    throw new ApiError(data?.message || `Request failed (${response.status})`, response.status, data)
  }
  return data
}
