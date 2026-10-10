import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import AdminLayout from '@/layout/AdminLayout/AdminLayout'
import LoginPage from '@/pages/Login/LoginPage'
import FullPageSpinner from './FullPageSpinner'
import ProtectedRoute from './ProtectedRoute'

const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'))
const MoviesPage = lazy(() => import('@/pages/Movies/MoviesPage'))
const ShowsPage = lazy(() => import('@/pages/Shows/ShowsPage'))
const BookingsPage = lazy(() => import('@/pages/Bookings/BookingsPage'))
const CitiesPage = lazy(() => import('@/pages/Cities/CitiesPage'))
const TheatersPage = lazy(() => import('@/pages/Theaters/TheatersPage'))
const ScreensPage = lazy(() => import('@/pages/Screens/ScreensPage'))
const UsersPage = lazy(() => import('@/pages/Users/UsersPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="shows" element={<ShowsPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="cities" element={<CitiesPage />} />
          <Route path="theaters" element={<TheatersPage />} />
          <Route path="theaters/:theaterId/screens" element={<ScreensPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
