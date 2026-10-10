import { useState } from 'react'
import { screensApi } from '@/api/screens'
import Button from '@/components/Button/Button'
import Modal from '@/components/Modal/Modal'
import Spinner from '@/components/Spinner/Spinner'
import TextField from '@/components/TextField/TextField'
import { useFetch } from '@/hooks/useFetch'
import { useForm } from '@/hooks/useForm'
import { useNotify } from '@/hooks/useNotify'
import SeatLayoutEditor from './SeatLayoutEditor'
import styles from './ScreenFormModal.module.css'

const NEW_SCREEN = { name: '', rows: [{ rowLabel: 'A', seatCount: 10, seatType: 'REGULAR' }], layoutLocked: false }

/** Create (screenId = null) or edit a screen; editing first loads its current layout. */
export default function ScreenFormModal({ screenId, theaterId, onClose, onSaved }) {
  const { data: screen } = useFetch(() => (screenId ? screensApi.get(screenId) : Promise.resolve(NEW_SCREEN)), [screenId])

  return (
    <Modal title={screenId ? 'Edit screen' : 'Add screen'} onClose={onClose} size="lg">
      {screen ? (
        <ScreenForm screen={screen} screenId={screenId} theaterId={theaterId} onClose={onClose} onSaved={onSaved} />
      ) : (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
    </Modal>
  )
}

function ScreenForm({ screen, screenId, theaterId, onClose, onSaved }) {
  const notify = useNotify()
  const { values, setValue, errors, setErrors } = useForm({ name: screen.name, rows: screen.rows })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    const payload = {
      name: values.name,
      theaterId,
      rows: values.rows.map((row) => ({ ...row, seatCount: Number(row.seatCount) })),
    }
    try {
      const request = screenId ? screensApi.update(screenId, payload) : screensApi.create(payload)
      await notify.track(request, { pending: 'Saving screen…', success: `${values.name} saved` })
      onSaved()
    } catch (error) {
      setErrors(error.fieldErrors ?? {})
      setSaving(false)
    }
  }

  // Backend errors for individual rows arrive as "rows[0].seatCount" etc.
  const rowErrors = Object.entries(errors).filter(([field, message]) => field.startsWith('rows') && message)

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <TextField
        label="Screen name"
        name="name"
        value={values.name}
        onChange={(event) => setValue('name', event.target.value)}
        error={errors.name}
        placeholder="e.g. Screen 1, Audi 2"
        required
        autoFocus
        className={styles.name}
      />

      {screen.layoutLocked && (
        <p className={styles.notice}>
          Shows are already scheduled on this screen, so its seat layout can no longer change. You can still rename it.
        </p>
      )}

      <SeatLayoutEditor rows={values.rows} onChange={(rows) => setValue('rows', rows)} disabled={screen.layoutLocked} />

      {rowErrors.length > 0 && (
        <ul className={styles.errors}>
          {rowErrors.map(([field, message]) => (
            <li key={field}>{message}</li>
          ))}
        </ul>
      )}

      <div className={styles.footer}>
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Save
        </Button>
      </div>
    </form>
  )
}
