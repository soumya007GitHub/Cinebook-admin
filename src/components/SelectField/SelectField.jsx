import { useId } from 'react'
import styles from '@/components/TextField/Field.module.css'

/**
 * Labelled <select>. options: [{ value, label }].
 * `placeholder` adds a first empty option (e.g. "All statuses").
 * `fullWidth` spans both columns inside a FormGrid.
 */
export default function SelectField({ label, error, options, placeholder, fullWidth = false, className = '', ...selectProps }) {
  const id = useId()
  return (
    <div className={`${styles.field} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {selectProps.required && <span className={styles.required}> *</span>}
        </label>
      )}
      <select
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ''}`}
        aria-invalid={Boolean(error)}
        {...selectProps}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
