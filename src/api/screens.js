import { apiRequest } from './client'

export const screensApi = {
  listByTheater: (theaterId) => apiRequest(`/admin/theaters/${theaterId}/screens`),
  get: (id) => apiRequest(`/admin/screens/${id}`),
  create: (screen) => apiRequest('/admin/screens', { method: 'POST', body: screen }),
  update: (id, screen) => apiRequest(`/admin/screens/${id}`, { method: 'PUT', body: screen }),
  remove: (id) => apiRequest(`/admin/screens/${id}`, { method: 'DELETE' }),
}
