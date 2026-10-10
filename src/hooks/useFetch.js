import { useCallback, useEffect, useRef, useState } from 'react'
import { useNotify } from './useNotify'

export function useFetch(fetcher, deps) {
  const notify = useNotify()
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const latestRequest = useRef(0)

  const load = useCallback(fetcher, deps)

  const reload = useCallback(async () => {
    const requestId = ++latestRequest.current
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await load()
      if (requestId === latestRequest.current) setState({ data, loading: false, error: null })
    } catch (error) {
      if (requestId !== latestRequest.current) return
      setState((prev) => ({ ...prev, loading: false, error }))
      notify.fail(error.message)
    }
  }, [load, notify])

  useEffect(() => {
    reload()
  }, [reload])

  return { ...state, reload }
}
