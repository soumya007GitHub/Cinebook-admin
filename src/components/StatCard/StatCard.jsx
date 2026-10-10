import styles from './StatCard.module.css'

/** A single headline number, e.g. "Revenue  ₹1,20,000". */
export default function StatCard({ label, value, hint }) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}
