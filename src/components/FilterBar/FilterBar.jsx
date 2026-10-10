import Button from '@/components/Button/Button'
import styles from './FilterBar.module.css'

/** Row of filter fields that wraps on small screens, with an optional "Clear" button. */
export default function FilterBar({ onClear, children }) {
  return (
    <div className={styles.bar}>
      {children}
      {onClear && (
        <Button variant="ghost" onClick={onClear} className={styles.clear}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
