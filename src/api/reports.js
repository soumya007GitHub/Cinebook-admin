import { apiRequest } from './client'

export const reportsApi = {
  /** params: { from, to } as yyyy-MM-dd */
  dashboard: (params) => apiRequest('/admin/dashboard', { params }),
  /** params: { status, bookingReference, userEmail, movieId, theaterId, cityId, bookedFrom, bookedTo, page, size, sort } */
  bookings: (params) => apiRequest('/admin/bookings', { params }),
  /** params: { search, role, emailVerified, page, size, sort } */
  users: (params) => apiRequest('/admin/users', { params }),
}
