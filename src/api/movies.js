import { apiRequest } from './client'

export const moviesApi = {
  /** params: { title, language, genre, page, size, sort } */
  list: (params) => apiRequest('/movies', { params }),
  create: (movie) => apiRequest('/admin/movies', { method: 'POST', body: movie }),
  update: (id, movie) => apiRequest(`/admin/movies/${id}`, { method: 'PUT', body: movie }),
  remove: (id) => apiRequest(`/admin/movies/${id}`, { method: 'DELETE' }),
}
