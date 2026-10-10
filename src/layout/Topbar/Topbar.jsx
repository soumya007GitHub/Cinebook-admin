import { useState } from 'react'
import { LogOut, Menu } from 'lucide-react'
import Button from '@/components/Button/Button'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import { useNotify } from '@/hooks/useNotify'
import styles from './Topbar.module.css'

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const notify = useNotify()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await notify.track(logout(), { pending: 'Signing out…', success: 'Signed out' })
  }

  return (
    <header className={styles.topbar}>
      <button type="button" className={styles.menu} onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className={styles.user}>
        <div className={styles.identity}>
          <span className={styles.name}>{user?.fullName}</span>
          <span className={styles.email}>{user?.email}</span>
        </div>
        <ThemeToggle />
        <Button variant="secondary" size="sm" icon={LogOut} onClick={handleLogout} loading={loggingOut}>
          Log out
        </Button>
      </div>
    </header>
  )
}
