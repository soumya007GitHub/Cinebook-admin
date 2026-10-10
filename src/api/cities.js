import { apiRequest } from './client'

export const citiesApi = {
  list: (search) => apiRequest('/cities', { params: { search } }),
  create: (city) => apiRequest('/admin/cities', { method: 'POST', body: city }),
  update: (id, city) => apiRequest(`/admin/cities/${id}`, { method: 'PUT', body: city }),
  remove: (id) => apiRequest(`/admin/cities/${id}`, { method: 'DELETE' }),
}
