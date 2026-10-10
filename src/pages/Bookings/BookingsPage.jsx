import { useState } from 'react'
import { reportsApi } from '@/api/reports'
import DataTable from '@/components/DataTable/DataTable'
import FilterBar from '@/components/FilterBar/FilterBar'
import PageHeader from '@/components/PageHeader/PageHeader'
import Pagination from '@/components/Pagination/Pagination'
import SelectField from '@/components/SelectField/SelectField'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import TextField from '@/components/TextField/TextField'
import { BOOKING_STATUS_OPTIONS, PAGE_SIZE } from '@/constants/options'
import { useFetch } from '@/hooks/useFetch'
import { useListQuery } from '@/hooks/useListQuery'
import { formatCurrency, formatDateTime } from '@/utils/format'
import BookingDetailsModal from './BookingDetailsModal'
import styles from './BookingsPage.module.css'

const INITIAL_FILTERS = { status: '', bookingReference: '', userEmail: '', bookedFrom: '', bookedTo: '' }

export default function BookingsPage() {
  const { filters, setFilter, resetFilters, setPage, query, queryKey } = useListQuery(INITIAL_FILTERS, PAGE_SIZE)
  const { data, loading } = useFetch(() => reportsApi.bookings(query), queryKey)
  const [selected, setSelected] = useState(null)

  const columns = [
    { key: 'bookingReference', header: 'Reference', render: (b) => <span className={styles.reference}>{b.bookingReference}</span> },
    {
      key: 'customer',
      header: 'Customer',
      render: (b) => (
        <div className={styles.stack}>
          <span>{b.customerName}</span>
          <span className={styles.muted}>{b.customerEmail}</span>
        </div>
      ),
    },
    {
      key: 'show',
      header: 'Show',
      render: (b) => (
        <div className={styles.stack}>
          <span>{b.movieTitle}</span>
          <span className={styles.muted}>
            {b.theaterName} · {b.screenName} · {formatDateTime(b.showStartTime)}
          </span>
        </div>
      ),
    },
    { key: 'seats', header: 'Seats', render: (b) => b.seats.join(', ') },
    { key: 'totalAmount', header: 'Amount', align: 'right', render: (b) => formatCurrency(b.totalAmount) },
    { key: 'status', header: 'Status', render: (b) => <StatusBadge status={b.status} /> },
    { key: 'bookedAt', header: 'Booked', render: (b) => formatDateTime(b.bookedAt) },
  ]

  return (
    <>
      <PageHeader title="Bookings" description="Every booking made by customers. Click a row for details." />

      <FilterBar onClear={resetFilters}>
        <TextField
          label="Reference"
          placeholder="e.g. CB7X2K9QAB"
          value={filters.bookingReference}
          onChange={(e) => setFilter('bookingReference', e.target.value)}
        />
        <TextField label="Customer email" placeholder="Search email" value={filters.userEmail} onChange={(e) => setFilter('userEmail', e.target.value)} />
        <SelectField
          label="Status"
          value={filters.status}
          options={BOOKING_STATUS_OPTIONS}
          placeholder="Any status"
          onChange={(e) => setFilter('status', e.target.value)}
        />
        <TextField label="Booked from" type="date" value={filters.bookedFrom} onChange={(e) => setFilter('bookedFrom', e.target.value)} />
        <TextField label="Booked to" type="date" value={filters.bookedTo} onChange={(e) => setFilter('bookedTo', e.target.value)} />
      </FilterBar>

      <DataTable
        columns={columns}
        rows={data?.content}
        loading={loading}
        rowKey="bookingId"
        onRowClick={setSelected}
        emptyMessage="No bookings match these filters."
      />
      {data && <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onPageChange={setPage} />}

      {selected && <BookingDetailsModal booking={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
