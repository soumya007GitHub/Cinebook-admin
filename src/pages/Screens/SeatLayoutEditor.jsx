import { Plus, Trash2 } from 'lucide-react'
import Button from '@/components/Button/Button'
import SelectField from '@/components/SelectField/SelectField'
import TextField from '@/components/TextField/TextField'
import { SEAT_TYPE_OPTIONS, SEAT_TYPES } from '@/constants/options'
import { formatNumber } from '@/utils/format'
import styles from './SeatLayoutEditor.module.css'

/** Label after the given one: A -> B, Z -> AA, AZ -> BA. */
function nextRowLabel(label) {
  const letters = (label || '@').toUpperCase().split('')
  let i = letters.length - 1
  while (i >= 0) {
    if (letters[i] !== 'Z') {
      letters[i] = String.fromCharCode(letters[i].charCodeAt(0) + 1)
      return letters.join('')
    }
    letters[i] = 'A'
    i--
  }
  return `A${letters.join('')}`
}

/**
 * Edits a screen's rows ({ rowLabel, seatCount, seatType }) and previews the
 * seats as the audience would see them, screen at the top.
 */
export default function SeatLayoutEditor({ rows, onChange, disabled = false }) {
  const updateRow = (index, changes) => onChange(rows.map((row, i) => (i === index ? { ...row, ...changes } : row)))
  const removeRow = (index) => onChange(rows.filter((_, i) => i !== index))
  const addRow = () => {
    const last = rows[rows.length - 1]
    onChange([...rows, { rowLabel: nextRowLabel(last?.rowLabel), seatCount: last?.seatCount ?? 10, seatType: last?.seatType ?? 'REGULAR' }])
  }

  const totalSeats = rows.reduce((sum, row) => sum + (Number(row.seatCount) || 0), 0)

  return (
    <div className={styles.editor}>
      <div className={styles.rowsPanel}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Rows</h3>
          <span className={styles.total}>{formatNumber(totalSeats)} seats</span>
        </div>

        <div className={styles.rows}>
          {rows.map((row, index) => (
            <div key={index} className={styles.row}>
              <TextField
                label={index === 0 ? 'Row' : undefined}
                aria-label="Row label"
                value={row.rowLabel}
                maxLength={2}
                onChange={(event) => updateRow(index, { rowLabel: event.target.value.toUpperCase().replace(/[^A-Z]/g, '') })}
                disabled={disabled}
              />
              <TextField
                label={index === 0 ? 'Seats' : undefined}
                aria-label="Seats in row"
                type="number"
                min={1}
                max={50}
                value={row.seatCount}
                onChange={(event) => updateRow(index, { seatCount: event.target.value })}
                disabled={disabled}
              />
              <SelectField
                label={index === 0 ? 'Type' : undefined}
                aria-label="Seat type"
                value={row.seatType}
                options={SEAT_TYPE_OPTIONS}
                onChange={(event) => updateRow(index, { seatType: event.target.value })}
                disabled={disabled}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                aria-label={`Remove row ${row.rowLabel}`}
                onClick={() => removeRow(index)}
                disabled={disabled || rows.length === 1}
                className={styles.remove}
              />
            </div>
          ))}
        </div>

        {!disabled && (
          <Button variant="secondary" size="sm" icon={Plus} onClick={addRow}>
            Add row
          </Button>
        )}
      </div>

      <div className={styles.previewPanel}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Preview</h3>
          <div className={styles.legend}>
            {SEAT_TYPES.map((type) => (
              <span key={type} className={styles.legendItem}>
                <span className={`${styles.seat} ${styles[type]}`} /> {type.charAt(0) + type.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.preview}>
          <div className={styles.screenBar}>Screen this way</div>
          {rows.map((row, index) => (
            <div key={index} className={styles.previewRow}>
              <span className={styles.previewLabel}>{row.rowLabel || '?'}</span>
              <div className={styles.seats}>
                {Array.from({ length: Math.min(Number(row.seatCount) || 0, 50) }, (_, seat) => (
                  <span key={seat} className={`${styles.seat} ${styles[row.seatType]}`} title={`${row.rowLabel}${seat + 1}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
