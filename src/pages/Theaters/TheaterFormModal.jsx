import { useState } from 'react'
import { theatersApi } from '@/api/theaters'
import Button from '@/components/Button/Button'
import FormGrid from '@/components/FormGrid/FormGrid'
import Modal from '@/components/Modal/Modal'
import SelectField from '@/components/SelectField/SelectField'
import TextField from '@/components/TextField/TextField'
import { useForm } from '@/hooks/useForm'
import { useNotify } from '@/hooks/useNotify'
import { toSelectOptions } from '@/utils/format'

/** Create (theater = null) or edit a theater. */
export default function TheaterFormModal({ theater, defaultCityId, cities, onClose, onSaved }) {
  const notify = useNotify()
  const { values, handleChange, errors, setErrors } = useForm({
    name: theater?.name ?? '',
    address: theater?.address ?? '',
    pincode: theater?.pincode ?? '',
    cityId: theater ? String(theater.city.id) : defaultCityId,
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    const payload = { ...values, pincode: values.pincode || null, cityId: Number(values.cityId) }
    try {
      const request = theater ? theatersApi.update(theater.id, payload) : theatersApi.create(payload)
      const saved = await notify.track(request, { pending: 'Saving theater…', success: `${values.name} saved` })
      onSaved(saved)
    } catch (error) {
      setErrors(error.fieldErrors ?? {})
      setSaving(false)
    }
  }

  return (
    <Modal
      title={theater ? 'Edit theater' : 'Add theater'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="theater-form" loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <form id="theater-form" onSubmit={handleSubmit} noValidate>
        <FormGrid>
          <TextField label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} required autoFocus fullWidth />
          <TextField label="Address" name="address" value={values.address} onChange={handleChange} error={errors.address} required fullWidth />
          <SelectField
            label="City"
            name="cityId"
            value={values.cityId}
            onChange={handleChange}
            options={toSelectOptions(cities, (city) => `${city.name}, ${city.state}`)}
            error={errors.cityId}
            required
          />
          <TextField label="Pincode" name="pincode" value={values.pincode} onChange={handleChange} error={errors.pincode} inputMode="numeric" maxLength={6} />
        </FormGrid>
      </form>
    </Modal>
  )
}
