import { useState } from 'react'
import { citiesApi } from '@/api/cities'
import Button from '@/components/Button/Button'
import FormGrid from '@/components/FormGrid/FormGrid'
import Modal from '@/components/Modal/Modal'
import TextField from '@/components/TextField/TextField'
import { useForm } from '@/hooks/useForm'
import { useNotify } from '@/hooks/useNotify'

/** Create (city = null) or edit a city. */
export default function CityFormModal({ city, onClose, onSaved }) {
  const notify = useNotify()
  const { values, handleChange, errors, setErrors } = useForm({ name: city?.name ?? '', state: city?.state ?? '' })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const request = city ? citiesApi.update(city.id, values) : citiesApi.create(values)
      await notify.track(request, { pending: 'Saving city…', success: `${values.name} saved` })
      onSaved()
    } catch (error) {
      setErrors(error.fieldErrors ?? {})
      setSaving(false)
    }
  }

  return (
    <Modal
      title={city ? 'Edit city' : 'Add city'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="city-form" loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <form id="city-form" onSubmit={handleSubmit} noValidate>
        <FormGrid>
          <TextField label="City" name="name" value={values.name} onChange={handleChange} error={errors.name} required autoFocus />
          <TextField label="State" name="state" value={values.state} onChange={handleChange} error={errors.state} required />
        </FormGrid>
      </form>
    </Modal>
  )
}
