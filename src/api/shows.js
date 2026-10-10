import { apiRequest } from './client'

export const showsApi = {
  /** params: { movieId, cityId, theaterId, status, from, to, page, size, sort } */
  list: (params) => apiRequest('/admin/shows', { params }),
  create: (show) => apiRequest('/admin/shows', { method: 'POST', body: show }),
  cancel: (id, reason) => apiRequest(`/admin/shows/${id}/cancel`, { method: 'POST', body: { reason } }),
}
