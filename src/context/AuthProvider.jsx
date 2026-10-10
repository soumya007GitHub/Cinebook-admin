import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { authApi } from '@/api/auth'
import { setUnauthorizedHandler, tokenStore } from '@/api/client'
import { useNotify } from '@/hooks/useNotify'
import { AuthContext } from './AuthContext'

// status: 'checking' (validating a saved token) | 'authenticated' | 'anonymous'
const initialState = { status: 'checking', user: null }

function authReducer(state, action) {
  switch (action.type) {
    case 'loggedIn':
      return { status: 'authenticated', user: action.user }
    case 'loggedOut':
      return { status: 'anonymous', user: null }
    default:
      return state
  }
}

const NOT_ADMIN_MESSAGE = 'This account does not have admin access.'

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const notify = useNotify()

  const clearSession = useCallback(() => {
    tokenStore.clear()
    dispatch({ type: 'loggedOut' })
  }, [])

  // A saved token from an earlier visit: check it is still valid and belongs to an admin
  useEffect(() => {
    if (!tokenStore.get()) {
      dispatch({ type: 'loggedOut' })
      return
    }
    authApi
      .me()
      .then((user) => (user.role === 'ADMIN' ? dispatch({ type: 'loggedIn', user }) : clearSession()))
      .catch(clearSession)
  }, [clearSession])

  // Any 401 from the API (expired or logged-out token) ends the session
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
      notify.fail('Your session has expired. Please log in again.')
    })
  }, [clearSession, notify])

  const login = useCallback(async (email, password) => {
    const { accessToken, user } = await authApi.login({ email, password })
    if (user.role !== 'ADMIN') throw new Error(NOT_ADMIN_MESSAGE)
    tokenStore.set(accessToken)
    dispatch({ type: 'loggedIn', user })
    return user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // The token is dropped locally either way
    }
    clearSession()
  }, [clearSession])

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
