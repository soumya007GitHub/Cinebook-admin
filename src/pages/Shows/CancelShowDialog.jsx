import { useState } from 'react'
import { showsApi } from '@/api/shows'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog'
import TextField from '@/components/TextField/TextField'
import { useNotify } from '@/hooks/useNotify'
import { formatCurrency, formatDateTime } from '@/utils/format'

/** Confirms cancelling a show; every booking is cancelled and paid ones are refunded. */
export default function CancelShowDialog({ show, onClose, onCancelled }) {
  const notify = useNotify()
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleConfirm() {
    setBusy(true)
    try {
      const result = await notify.track(showsApi.cancel(show.id, reason.trim() || null), {
        pending: 'Cancelling show…',
        success: 'Show cancelled',
      })
      if (result.cancelledBookings > 0) {
        notify.success(
          `${result.cancelledBookings} booking(s) cancelled, ${result.refundedBookings} refunded (${formatCurrency(result.refundedAmount)}). Customers have been emailed.`,
        )
      }
      onCancelled()
    } catch {
      setBusy(false)
    }
  }

  return (
    <ConfirmDialog
      title="Cancel show"
      message={`Cancel ${show.movieTitle} at ${show.theaterName} (${show.screenName}) on ${formatDateTime(show.startTime)}? All its bookings will be cancelled, paid ones refunded, and every customer emailed.`}
      confirmLabel="Cancel show"
      loading={busy}
      onConfirm={handleConfirm}
      onCancel={onClose}
    >
      <TextField
        label="Reason (shown to customers)"
        multiline
        rows={3}
        maxLength={200}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="e.g. Projector maintenance"
      />
    </ConfirmDialog>
  )
}
