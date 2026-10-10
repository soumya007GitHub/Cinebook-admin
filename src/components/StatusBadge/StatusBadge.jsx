import { humanize } from '@/utils/format'
import styles from './StatusBadge.module.css'

/** Colour for each status coming from the backend. Anything unknown is grey. */
const TONES = {
  CONFIRMED: 'success',
  SCHEDULED: 'success',
  SUCCESS: 'success',
  PENDING: 'warning',
  INITIATED: 'warning',
  CANCELLED: 'danger',
  EXPIRED: 'danger',
  FAILED: 'danger',
  REFUNDED: 'info',
  ADMIN: 'info',
}

/** Small coloured pill for an enum value; pass `tone` to override the colour. */
export default function StatusBadge({ status, tone, children }) {
  return <span className={`${styles.badge} ${styles[tone ?? TONES[status] ?? 'neutral']}`}>{children ?? humanize(status)}</span>
}
