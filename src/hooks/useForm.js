import { useCallback, useState } from 'react'

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }, [])

  const handleChange = useCallback((event) => setValue(event.target.name, event.target.value), [setValue])

  return { values, setValue, handleChange, errors, setErrors }
}
