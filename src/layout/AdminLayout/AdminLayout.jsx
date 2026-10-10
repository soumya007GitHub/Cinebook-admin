import { Suspense, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Spinner from '@/components/Spinner/Spinner'
import Sidebar from '@/layout/Sidebar/Sidebar'
import Topbar from '@/layout/Topbar/Topbar'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className={styles.shell}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.content}>
          <ErrorBoundary key={location.pathname}>
            <Suspense
              fallback={
                <div className={styles.pageLoading}>
                  <Spinner size="lg" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
