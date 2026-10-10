import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import Spinner from '@/components/Spinner/Spinner'
import styles from './Toast.module.css'

const ICONS = {
  success: <CheckCircle2 size={18} aria-hidden="true" />,
  fail: <CircleAlert size={18} aria-hidden="true" />,
  pending: <Spinner size="sm" label="In progress" />,
}

/** status: 'success' (green) | 'pending' (yellow) | 'fail' (red) */
export default function Toast({ status, message, onDismiss }) {
  return (
    <div className={`${styles.toast} ${styles[status]}`} role={status === 'fail' ? 'alert' : 'status'}>
      <span className={styles.icon}>{ICONS[status]}</span>
      <p className={styles.message}>{message}</p>
      <button type="button" className={styles.close} onClick={onDismiss} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  )
}
