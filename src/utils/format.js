const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const number = new Intl.NumberFormat('en-IN')
const dateTime = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
const dateOnly = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' })

export const formatCurrency = (value) => (value == null ? '—' : currency.format(Number(value)))
export const formatNumber = (value) => (value == null ? '—' : number.format(Number(value)))
export const formatDateTime = (value) => (value ? dateTime.format(new Date(value)) : '—')
export const formatDate = (value) => (value ? dateOnly.format(new Date(value)) : '—')

/** yyyy-MM-dd for <input type="date"> and API date params, in local time. */
export function toDateInput(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** API list -> [{ value, label }] for SelectField. Values are strings, as <select> gives back. */
export function toSelectOptions(items, getLabel = (item) => item.name) {
  return (items ?? []).map((item) => ({ value: String(item.id), label: getLabel(item) }))
}

/** "ENUM_VALUE" -> "Enum value" */
export function humanize(value) {
  if (!value) return ''
  const text = String(value).replaceAll('_', ' ').toLowerCase()
  return text.charAt(0).toUpperCase() + text.slice(1)
}
