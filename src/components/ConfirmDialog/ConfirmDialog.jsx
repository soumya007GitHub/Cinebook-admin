import Button from '@/components/Button/Button'
import Modal from '@/components/Modal/Modal'
import styles from './ConfirmDialog.module.css'

/**
 * "Are you sure?" dialog for destructive actions. `children` can add extra
 * inputs (e.g. a cancellation reason) below the message.
 */
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  loading = false,
  onConfirm,
  onCancel,
  children,
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className={styles.message}>{message}</p>
      {children && <div className={styles.extra}>{children}</div>}
    </Modal>
  )
}
