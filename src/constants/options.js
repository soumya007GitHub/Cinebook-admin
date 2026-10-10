/** Select options that mirror the backend enums. */

const toOptions = (values) => values.map((value) => ({ value, label: value.charAt(0) + value.slice(1).toLowerCase().replaceAll('_', ' ') }))

export const SEAT_TYPES = ['REGULAR', 'PREMIUM', 'RECLINER']
export const SEAT_TYPE_OPTIONS = toOptions(SEAT_TYPES)

export const CERTIFICATE_OPTIONS = ['U', 'UA', 'A', 'S'].map((value) => ({ value, label: value }))

export const SHOW_STATUS_OPTIONS = toOptions(['SCHEDULED', 'COMPLETED', 'CANCELLED'])

export const BOOKING_STATUS_OPTIONS = toOptions(['PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED'])

export const ROLE_OPTIONS = toOptions(['USER', 'ADMIN'])

export const YES_NO_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

export const PAGE_SIZE = 20
