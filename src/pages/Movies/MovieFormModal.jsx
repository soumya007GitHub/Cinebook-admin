import { useState } from 'react'
import { moviesApi } from '@/api/movies'
import Button from '@/components/Button/Button'
import FormGrid from '@/components/FormGrid/FormGrid'
import Modal from '@/components/Modal/Modal'
import SelectField from '@/components/SelectField/SelectField'
import TextField from '@/components/TextField/TextField'
import { CERTIFICATE_OPTIONS } from '@/constants/options'
import { useForm } from '@/hooks/useForm'
import { useNotify } from '@/hooks/useNotify'
import MoviePoster from './MoviePoster'
import styles from './MovieFormModal.module.css'

/** Create (movie = null) or edit a movie. */
export default function MovieFormModal({ movie, onClose, onSaved }) {
  const notify = useNotify()
  const { values, handleChange, errors, setErrors } = useForm({
    title: movie?.title ?? '',
    language: movie?.language ?? '',
    genre: movie?.genre ?? '',
    durationMinutes: movie?.durationMinutes ?? '',
    releaseDate: movie?.releaseDate ?? '',
    certificate: movie?.certificate ?? '',
    posterUrl: movie?.posterUrl ?? '',
    description: movie?.description ?? '',
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    const payload = {
      ...values,
      durationMinutes: values.durationMinutes === '' ? null : Number(values.durationMinutes),
      releaseDate: values.releaseDate || null,
      certificate: values.certificate || null,
      genre: values.genre || null,
      posterUrl: values.posterUrl.trim() || null,
      description: values.description || null,
    }
    try {
      const request = movie ? moviesApi.update(movie.id, payload) : moviesApi.create(payload)
      await notify.track(request, { pending: 'Saving movie…', success: `${values.title} saved` })
      onSaved()
    } catch (error) {
      setErrors(error.fieldErrors ?? {})
      setSaving(false)
    }
  }

  return (
    <Modal
      title={movie ? 'Edit movie' : 'Add movie'}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="movie-form" loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <form id="movie-form" onSubmit={handleSubmit} noValidate className={styles.layout}>
        <div className={styles.posterColumn}>
          <MoviePoster url={values.posterUrl.trim()} title={values.title} size="lg" />
        </div>
        <FormGrid>
          <TextField label="Title" name="title" value={values.title} onChange={handleChange} error={errors.title} required autoFocus fullWidth />
          <TextField label="Language" name="language" value={values.language} onChange={handleChange} error={errors.language} required />
          <TextField label="Genre" name="genre" value={values.genre} onChange={handleChange} error={errors.genre} placeholder="e.g. Action, Drama" />
          <TextField
            label="Duration (minutes)"
            name="durationMinutes"
            type="number"
            min={1}
            value={values.durationMinutes}
            onChange={handleChange}
            error={errors.durationMinutes}
            required
          />
          <SelectField
            label="Certificate"
            name="certificate"
            value={values.certificate}
            onChange={handleChange}
            options={CERTIFICATE_OPTIONS}
            placeholder="Not rated"
            error={errors.certificate}
          />
          <TextField label="Release date" name="releaseDate" type="date" value={values.releaseDate} onChange={handleChange} error={errors.releaseDate} />
          <TextField
            label="Poster URL"
            name="posterUrl"
            type="url"
            value={values.posterUrl}
            onChange={handleChange}
            error={errors.posterUrl}
            placeholder="https://…"
            hint="Link to the poster image"
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            multiline
            rows={4}
            value={values.description}
            onChange={handleChange}
            error={errors.description}
            fullWidth
          />
        </FormGrid>
      </form>
    </Modal>
  )
}
