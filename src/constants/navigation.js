import { Building2, CalendarClock, Film, LayoutDashboard, MapPin, Ticket, Users } from 'lucide-react'

/** Sidebar entries; the order here is the order on screen. */
export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/movies', label: 'Movies', icon: Film },
  { to: '/shows', label: 'Shows', icon: CalendarClock },
  { to: '/bookings', label: 'Bookings', icon: Ticket },
  { to: '/cities', label: 'Cities', icon: MapPin },
  { to: '/theaters', label: 'Theaters', icon: Building2 },
  { to: '/users', label: 'Users', icon: Users },
]
