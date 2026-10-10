import styles from './FormGrid.module.css'

/** Two-column form layout (one column on phones). Fields with `fullWidth` span both. */
export default function FormGrid({ children }) {
  return <div className={styles.grid}>{children}</div>
}
