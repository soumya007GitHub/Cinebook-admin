import { useId } from 'react'
import styles from '@/components/TextField/Field.module.css'

/**
 * Labelled input (or textarea with `multiline`). Extra props go to the input.
 * `error` shows below the field in red; `hint` in grey.
 * `fullWidth` spans both columns inside a FormGrid.
 */
export default function TextField({ label, error, hint, multiline = false, fullWidth = false, className = '', ...inputProps }) {
  const id = useId()
  const Input = multiline ? 'textarea' : 'input'
  return (
    <div className={`${styles.field} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {inputProps.required && <span className={styles.required}> *</span>}
        </label>
      )}
      <Input
        id={id}
        className={`${styles.control} ${multiline ? styles.textarea : ''} ${error ? styles.invalid : ''}`}
        aria-invalid={Boolean(error)}
        {...inputProps}
      />
      {error ? <p className={styles.error}>{error}</p> : hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}
