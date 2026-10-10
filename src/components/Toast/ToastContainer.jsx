import Toast from './Toast'
import styles from './Toast.module.css'

/** Stack of toasts pinned to the top-right corner. */
export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} status={toast.status} message={toast.message} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  )
}
