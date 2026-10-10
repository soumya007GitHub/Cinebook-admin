import { useState } from 'react'
import { screensApi } from '@/api/screens'
import { showsApi } from '@/api/shows'
import { theatersApi } from '@/api/theaters'
import Button from '@/components/Button/Button'
import FormGrid from '@/components/FormGrid/FormGrid'
import Modal from '@/components/Modal/Modal'
import SelectField from '@/components/SelectField/SelectField'
import TextField from '@/components/TextField/TextField'
import { useFetch } from '@/hooks/useFetch'
import { useForm } from '@/hooks/useForm'
import { useNotify } from '@/hooks/useNotify'
import { toSelectOptions } from '@/utils/format'

/** Schedule a movie on a screen: city -> theater -> screen, then time and price. */
export default function ShowFormModal({ movies, cities, onClose, onSaved }) {
  const notify = useNotify()
  const { values, setValue, handleChange, errors, setErrors } = useForm({
    movieId: '',
    cityId: '',
    theaterId: '',
    screenId: '',
    startTime: '',
    basePrice: '',
  })
  const [saving, setSaving] = useState(false)

  const { data: theaters } = useFetch(
    () => (values.cityId ? theatersApi.listByCity(values.cityId) : Promise.resolve([])),
    [values.cityId],
  )
  const { data: screens } = useFetch(
    () => (values.theaterId ? screensApi.listByTheater(values.theaterId) : Promise.resolve([])),
    [values.theaterId],
  )

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    const payload = {
      movieId: values.movieId ? Number(values.movieId) : null,
      screenId: values.screenId ? Number(values.screenId) : null,
      startTime: values.startTime || null,
      basePrice: values.basePrice === '' ? null : Number(values.basePrice),
    }
    try {
      await notify.track(showsApi.create(payload), { pending: 'Scheduling show…', success: 'Show scheduled' })
      onSaved()
    } catch (error) {
      setErrors(error.fieldErrors ?? {})
      setSaving(false)
    }
  }

  return (
    <Modal
      title="Schedule show"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="show-form" loading={saving}>
            Schedule
          </Button>
        </>
      }
    >
      <form id="show-form" onSubmit={handleSubmit} noValidate>
        <FormGrid>
          <SelectField
            label="Movie"
            name="movieId"
            value={values.movieId}
            onChange={handleChange}
            options={toSelectOptions(movies, (movie) => `${movie.title} (${movie.durationMinutes} min)`)}
            placeholder="Select a movie"
            error={errors.movieId}
            required
            fullWidth
          />
          <SelectField
            label="City"
            value={values.cityId}
            onChange={(e) => {
              setValue('cityId', e.target.value)
              setValue('theaterId', '')
              setValue('screenId', '')
            }}
            options={toSelectOptions(cities)}
            placeholder="Select a city"
            required
          />
          <SelectField
            label="Theater"
            value={values.theaterId}
            onChange={(e) => {
              setValue('theaterId', e.target.value)
              setValue('screenId', '')
            }}
            options={toSelectOptions(theaters)}
            placeholder={values.cityId ? 'Select a theater' : 'Pick a city first'}
            disabled={!values.cityId}
            required
          />
          <SelectField
            label="Screen"
            name="screenId"
            value={values.screenId}
            onChange={handleChange}
            options={toSelectOptions(screens, (screen) => `${screen.name} (${screen.totalSeats} seats)`)}
            placeholder={values.theaterId ? 'Select a screen' : 'Pick a theater first'}
            disabled={!values.theaterId}
            error={errors.screenId}
            required
            fullWidth
          />
          <TextField
            label="Starts at"
            name="startTime"
            type="datetime-local"
            value={values.startTime}
            onChange={handleChange}
            error={errors.startTime}
            hint="End time is set from the movie's duration"
            required
          />
          <TextField
            label="Base price (₹)"
            name="basePrice"
            type="number"
            min={1}
            step="0.01"
            value={values.basePrice}
            onChange={handleChange}
            error={errors.basePrice}
            hint="Premium ×1.5, Recliner ×2"
            required
          />
        </FormGrid>
      </form>
    </Modal>
  )
}
