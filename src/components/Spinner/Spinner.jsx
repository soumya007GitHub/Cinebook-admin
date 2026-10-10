import styles from './Spinner.module.css'

/** size: 'sm' (inside buttons) | 'md' | 'lg' (full page) */
export default function Spinner({ size = 'md', label = 'Loading' }) {
  return <span className={`${styles.spinner} ${styles[size]}`} role="status" aria-label={label} />
}
