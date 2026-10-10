import styles from './RowActions.module.css'

/** Right-aligned buttons in a table row. Clicks don't trigger the row's own onClick. */
export default function RowActions({ children }) {
  return (
    <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
      {children}
    </div>
  )
}
