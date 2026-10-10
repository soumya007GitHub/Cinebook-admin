import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import AuthProvider from '@/context/AuthProvider'
import NotificationProvider from '@/context/NotificationProvider'
import ThemeProvider from '@/context/ThemeProvider'
import AppRoutes from '@/routes/AppRoutes'

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <NotificationProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </NotificationProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
