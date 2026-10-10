import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import Button from '@/components/Button/Button'
import TextField from '@/components/TextField/TextField'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from '@/hooks/useForm'
import { useNotify } from '@/hooks/useNotify'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { status, login } = useAuth()
  const notify = useNotify()
  const navigate = useNavigate()
  const location = useLocation()
  const { values, handleChange, errors, setErrors } = useForm({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const destination = location.state?.from ?? '/dashboard'
  if (status === 'authenticated') return <Navigate to={destination} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      const user = await notify.track(login(values.email.trim(), values.password), {
        pending: 'Signing in…',
        success: 'Signed in',
      })
      if (user) navigate(destination, { replace: true })
    } catch (error) {
      setErrors(error.fieldErrors ?? {})
      setFormError(error.message)
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">C</span>
          <div>
            <h1 className={styles.title}>Cinebook Admin</h1>
            <p className={styles.subtitle}>Sign in with your admin account</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {formError && <p className={styles.formError}>{formError}</p>}
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="username"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoFocus
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <Button type="submit" loading={submitting} className={styles.submit}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
