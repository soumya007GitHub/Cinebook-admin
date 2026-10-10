import { apiRequest } from './client'

export const theatersApi = {
  listByCity: (cityId) => apiRequest(`/cities/${cityId}/theaters`),
  create: (theater) => apiRequest('/admin/theaters', { method: 'POST', body: theater }),
  update: (id, theater) => apiRequest(`/admin/theaters/${id}`, { method: 'PUT', body: theater }),
  remove: (id) => apiRequest(`/admin/theaters/${id}`, { method: 'DELETE' }),
}
