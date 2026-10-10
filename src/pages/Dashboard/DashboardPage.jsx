import { useState } from 'react'
import { reportsApi } from '@/api/reports'
import Card from '@/components/Card/Card'
import PageHeader from '@/components/PageHeader/PageHeader'
import Spinner from '@/components/Spinner/Spinner'
import StatCard from '@/components/StatCard/StatCard'
import TextField from '@/components/TextField/TextField'
import { useFetch } from '@/hooks/useFetch'
import { formatCurrency, formatNumber, toDateInput } from '@/utils/format'
import RevenueChart from './RevenueChart'
import styles from './DashboardPage.module.css'

function defaultRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 29)
  return { from: toDateInput(from), to: toDateInput(to) }
}

export default function DashboardPage() {
  const [range, setRange] = useState(defaultRange)
  const { data, loading } = useFetch(() => reportsApi.dashboard(range), [range])

  const updateRange = (event) => {
    const { name, value } = event.target
    if (value) setRange((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Sales and catalogue overview"
        actions={
          <div className={styles.range}>
            <TextField label="From" type="date" name="from" value={range.from} max={range.to} onChange={updateRange} />
            <TextField label="To" type="date" name="to" value={range.to} min={range.from} onChange={updateRange} />
          </div>
        }
      />
      {!data ? (
        <div className={styles.loading}>{loading && <Spinner size="lg" />}</div>
      ) : (
        <div className={loading ? styles.refreshing : undefined}>
          <h2 className={styles.sectionTitle}>Sales in this period</h2>
          <div className={styles.stats}>
            <StatCard label="Revenue" value={formatCurrency(data.revenue)} hint="Confirmed bookings" />
            <StatCard label="Tickets sold" value={formatNumber(data.ticketsSold)} />
            <StatCard label="Confirmed bookings" value={formatNumber(data.confirmedBookings)} />
            <StatCard
              label="Cancelled bookings"
              value={formatNumber(data.cancelledBookings)}
              hint={`${formatCurrency(data.refundedAmount)} refunded`}
            />
          </div>

          <h2 className={styles.sectionTitle}>Catalogue</h2>
          <div className={styles.stats}>
            <StatCard label="Users" value={formatNumber(data.totalUsers)} />
            <StatCard label="Movies" value={formatNumber(data.totalMovies)} />
            <StatCard label="Theaters" value={formatNumber(data.totalTheaters)} />
            <StatCard label="Upcoming shows" value={formatNumber(data.upcomingShows)} />
          </div>

          <div className={styles.charts}>
            <Card title="Revenue by movie">
              <RevenueChart items={data.revenueByMovie} />
            </Card>
            <Card title="Revenue by theater">
              <RevenueChart items={data.revenueByTheater} />
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
