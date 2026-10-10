import Button from '@/components/Button/Button'
import Modal from '@/components/Modal/Modal'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import { formatCurrency, formatDateTime, humanize } from '@/utils/format'
import styles from './BookingDetailsModal.module.css'

function Detail({ label, children }) {
  return (
    <div className={styles.detail}>
      <dt>{label}</dt>
      <dd>{children ?? '—'}</dd>
    </div>
  )
}

/** Read-only view of one booking, including payment and cancellation info. */
export default function BookingDetailsModal({ booking, onClose }) {
  const payment = booking.payment

  return (
    <Modal
      title={`Booking ${booking.bookingReference}`}
      onClose={onClose}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className={styles.status}>
        <StatusBadge status={booking.status} />
        {booking.cancellationReason && <span className={styles.reason}>{booking.cancellationReason}</span>}
      </div>

      <h3 className={styles.section}>Customer</h3>
      <dl className={styles.grid}>
        <Detail label="Name">{booking.customerName}</Detail>
        <Detail label="Email">{booking.customerEmail}</Detail>
      </dl>

      <h3 className={styles.section}>Show</h3>
      <dl className={styles.grid}>
        <Detail label="Movie">{`${booking.movieTitle} (${booking.movieLanguage})`}</Detail>
        <Detail label="Starts">{formatDateTime(booking.showStartTime)}</Detail>
        <Detail label="Cinema">{booking.theaterName}</Detail>
        <Detail label="Address">{`${booking.theaterAddress}, ${booking.cityName}`}</Detail>
        <Detail label="Screen">{booking.screenName}</Detail>
        <Detail label="Seats">{`${booking.seats.join(', ')} (${booking.numberOfSeats})`}</Detail>
      </dl>

      <h3 className={styles.section}>Payment</h3>
      <dl className={styles.grid}>
        <Detail label="Amount">{formatCurrency(booking.totalAmount)}</Detail>
        <Detail label="Payment status">{payment ? <StatusBadge status={payment.status} /> : 'Not paid'}</Detail>
        <Detail label="Method">{payment && humanize(payment.paymentMethod)}</Detail>
        <Detail label="Transaction">{payment?.transactionId}</Detail>
        <Detail label="Paid at">{payment?.paidAt && formatDateTime(payment.paidAt)}</Detail>
        <Detail label="Refunded at">{payment?.refundedAt && formatDateTime(payment.refundedAt)}</Detail>
      </dl>

      <h3 className={styles.section}>Timeline</h3>
      <dl className={styles.grid}>
        <Detail label="Booked">{formatDateTime(booking.bookedAt)}</Detail>
        <Detail label="Confirmed">{booking.confirmedAt && formatDateTime(booking.confirmedAt)}</Detail>
        <Detail label="Cancelled">{booking.cancelledAt && formatDateTime(booking.cancelledAt)}</Detail>
        {booking.paymentDueBy && <Detail label="Pay by">{formatDateTime(booking.paymentDueBy)}</Detail>}
      </dl>
    </Modal>
  )
}
