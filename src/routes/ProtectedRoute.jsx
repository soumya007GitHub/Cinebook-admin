import { Navigate, useLocation } from 'react-router'
import FullPageSpinner from '@/routes/FullPageSpinner'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'checking') return <FullPageSpinner />
  if (status !== 'authenticated') return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
