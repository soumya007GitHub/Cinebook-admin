import { useState } from 'react'
import { Ban, Plus } from 'lucide-react'
import { citiesApi } from '@/api/cities'
import { moviesApi } from '@/api/movies'
import { showsApi } from '@/api/shows'
import { theatersApi } from '@/api/theaters'
import Button from '@/components/Button/Button'
import DataTable from '@/components/DataTable/DataTable'
import FilterBar from '@/components/FilterBar/FilterBar'
import PageHeader from '@/components/PageHeader/PageHeader'
import Pagination from '@/components/Pagination/Pagination'
import RowActions from '@/components/RowActions/RowActions'
import SelectField from '@/components/SelectField/SelectField'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import TextField from '@/components/TextField/TextField'
import { PAGE_SIZE, SHOW_STATUS_OPTIONS } from '@/constants/options'
import { useFetch } from '@/hooks/useFetch'
import { useListQuery } from '@/hooks/useListQuery'
import { formatCurrency, formatDateTime, toDateInput, toSelectOptions } from '@/utils/format'
import CancelShowDialog from './CancelShowDialog'
import ShowFormModal from './ShowFormModal'
import styles from './ShowsPage.module.css'

// Upcoming shows first by default
const INITIAL_FILTERS = {
  movieId: '',
  cityId: '',
  theaterId: '',
  status: '',
  from: toDateInput(new Date()),
  to: '',
  sort: 'startTime,asc',
}

export default function ShowsPage() {
  const { filters, setFilter, resetFilters, setPage, query, queryKey } = useListQuery(INITIAL_FILTERS, PAGE_SIZE)
  const { data, loading, reload } = useFetch(() => showsApi.list(query), queryKey)

  const { data: movies } = useFetch(() => moviesApi.list({ size: 100, sort: 'title,asc' }), [])
  const { data: cities } = useFetch(() => citiesApi.list(), [])
  const { data: theaters } = useFetch(
    () => (filters.cityId ? theatersApi.listByCity(filters.cityId) : Promise.resolve([])),
    [filters.cityId],
  )

  const [creating, setCreating] = useState(false)
  const [cancelling, setCancelling] = useState(null)

  const columns = [
    {
      key: 'movieTitle',
      header: 'Movie',
      render: (show) => <span className={styles.strong}>{show.movieTitle}</span>,
    },
    {
      key: 'theater',
      header: 'Theater',
      render: (show) => (
        <div className={styles.stack}>
          <span>{show.theaterName}</span>
          <span className={styles.muted}>{show.screenName}</span>
        </div>
      ),
    },
    { key: 'startTime', header: 'Starts', render: (show) => formatDateTime(show.startTime) },
    { key: 'basePrice', header: 'Base price', align: 'right', render: (show) => formatCurrency(show.basePrice) },
    {
      key: 'seats',
      header: 'Booked',
      render: (show) => <Occupancy booked={show.bookedSeats} total={show.totalSeats} />,
    },
    { key: 'status', header: 'Status', render: (show) => <StatusBadge status={show.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (show) =>
        show.status === 'SCHEDULED' && new Date(show.startTime) > new Date() ? (
          <RowActions>
            <Button variant="ghost" size="sm" icon={Ban} onClick={() => setCancelling(show)}>
              Cancel show
            </Button>
          </RowActions>
        ) : null,
    },
  ]

  return (
    <>
      <PageHeader
        title="Shows"
        description="Scheduled screenings across all theaters"
        actions={
          <Button icon={Plus} onClick={() => setCreating(true)}>
            Schedule show
          </Button>
        }
      />

      <FilterBar onClear={resetFilters}>
        <SelectField
          label="Movie"
          value={filters.movieId}
          options={toSelectOptions(movies?.content, (movie) => movie.title)}
          placeholder="All movies"
          onChange={(e) => setFilter('movieId', e.target.value)}
        />
        <SelectField
          label="City"
          value={filters.cityId}
          options={toSelectOptions(cities)}
          placeholder="All cities"
          onChange={(e) => {
            setFilter('cityId', e.target.value)
            setFilter('theaterId', '')
          }}
        />
        <SelectField
          label="Theater"
          value={filters.theaterId}
          options={toSelectOptions(theaters)}
          placeholder={filters.cityId ? 'All theaters' : 'Pick a city first'}
          disabled={!filters.cityId}
          onChange={(e) => setFilter('theaterId', e.target.value)}
        />
        <SelectField
          label="Status"
          value={filters.status}
          options={SHOW_STATUS_OPTIONS}
          placeholder="Any status"
          onChange={(e) => setFilter('status', e.target.value)}
        />
        <TextField label="From" type="date" value={filters.from} onChange={(e) => setFilter('from', e.target.value)} />
        <TextField label="To" type="date" value={filters.to} onChange={(e) => setFilter('to', e.target.value)} />
      </FilterBar>

      <DataTable columns={columns} rows={data?.content} loading={loading} emptyMessage="No shows match these filters." />
      {data && <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onPageChange={setPage} />}

      {creating && (
        <ShowFormModal
          movies={movies?.content ?? []}
          cities={cities ?? []}
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false)
            reload()
          }}
        />
      )}

      {cancelling && (
        <CancelShowDialog
          show={cancelling}
          onClose={() => setCancelling(null)}
          onCancelled={() => {
            setCancelling(null)
            reload()
          }}
        />
      )}
    </>
  )
}

function Occupancy({ booked, total }) {
  const percent = total ? Math.round((booked / total) * 100) : 0
  return (
    <div className={styles.occupancy} title={`${percent}% booked`}>
      <span>
        {booked ?? 0} / {total}
      </span>
      <span className={styles.bar}>
        <span className={styles.fill} style={{ width: `${percent}%` }} />
      </span>
    </div>
  )
}
