import { useCallback, useEffect, useMemo, useReducer } from 'react'
import ToastContainer from '@/components/Toast/ToastContainer'
import { NotificationContext } from './NotificationContext'

const AUTO_DISMISS_MS = { success: 3000, fail: 6000 }

let nextId = 1

function toastsReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.toast]
    case 'update':
      return state.map((toast) => (toast.id === action.id ? { ...toast, ...action.changes } : toast))
    case 'remove':
      return state.filter((toast) => toast.id !== action.id)
    default:
      return state
  }
}

export default function NotificationProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastsReducer, [])

  const dismiss = useCallback((id) => dispatch({ type: 'remove', id }), [])

  const autoDismiss = useCallback(
    (id, status) => {
      if (AUTO_DISMISS_MS[status]) setTimeout(() => dismiss(id), AUTO_DISMISS_MS[status])
    },
    [dismiss],
  )

  const show = useCallback(
    (status, message) => {
      const id = nextId++
      dispatch({ type: 'add', toast: { id, status, message } })
      autoDismiss(id, status)
      return id
    },
    [autoDismiss],
  )

  const update = useCallback(
    (id, status, message) => {
      dispatch({ type: 'update', id, changes: { status, message } })
      autoDismiss(id, status)
    },
    [autoDismiss],
  )

  const track = useCallback(
    async (promise, { pending = 'Working…', success = 'Done' } = {}) => {
      const id = show('pending', pending)
      try {
        const result = await promise
        update(id, 'success', success)
        return result
      } catch (error) {
        update(id, 'fail', error?.message || 'Something went wrong')
        if (error && typeof error === 'object') error.notified = true
        throw error
      }
    },
    [show, update],
  )

  useEffect(() => {
    function handleUnhandledRejection(event) {
      const error = event.reason
      if (error?.notified || error?.name === 'AbortError') {
        event.preventDefault()
        return
      }
      show('fail', error?.message || 'Unexpected error')
    }
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }, [show])

  const value = useMemo(
    () => ({
      success: (message) => show('success', message),
      fail: (message) => show('fail', message),
      pending: (message) => show('pending', message),
      update,
      dismiss,
      track,
    }),
    [show, update, dismiss, track],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  )
}
