import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { moviesApi } from '@/api/movies'
import Button from '@/components/Button/Button'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog'
import DataTable from '@/components/DataTable/DataTable'
import FilterBar from '@/components/FilterBar/FilterBar'
import PageHeader from '@/components/PageHeader/PageHeader'
import Pagination from '@/components/Pagination/Pagination'
import RowActions from '@/components/RowActions/RowActions'
import TextField from '@/components/TextField/TextField'
import { PAGE_SIZE } from '@/constants/options'
import { useFetch } from '@/hooks/useFetch'
import { useListQuery } from '@/hooks/useListQuery'
import { useNotify } from '@/hooks/useNotify'
import { formatDate } from '@/utils/format'
import MovieFormModal from './MovieFormModal'
import MoviePoster from './MoviePoster'
import styles from './MoviesPage.module.css'

const INITIAL_FILTERS = { title: '', language: '', genre: '', sort: 'title,asc' }

export default function MoviesPage() {
  const notify = useNotify()
  const { filters, setFilter, resetFilters, setPage, query, queryKey } = useListQuery(INITIAL_FILTERS, PAGE_SIZE)
  const { data, loading, reload } = useFetch(() => moviesApi.list(query), queryKey)

  const [editing, setEditing] = useState(null) // null | 'new' | movie
  const [deleting, setDeleting] = useState(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  async function confirmDelete() {
    setDeletingBusy(true)
    try {
      await notify.track(moviesApi.remove(deleting.id), { pending: 'Deleting movie…', success: `${deleting.title} deleted` })
      setDeleting(null)
      reload()
    } catch {
      // Explained by the red toast
    } finally {
      setDeletingBusy(false)
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Movie',
      render: (movie) => (
        <div className={styles.movie}>
          <MoviePoster url={movie.posterUrl} title={movie.title} />
          <div className={styles.movieText}>
            <span className={styles.title}>{movie.title}</span>
            <span className={styles.meta}>{[movie.genre, movie.certificate].filter(Boolean).join(' · ')}</span>
          </div>
        </div>
      ),
    },
    { key: 'language', header: 'Language' },
    { key: 'durationMinutes', header: 'Duration', render: (movie) => `${movie.durationMinutes} min` },
    { key: 'releaseDate', header: 'Release', render: (movie) => formatDate(movie.releaseDate) },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (movie) => (
        <RowActions>
          <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setEditing(movie)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setDeleting(movie)}>
            Delete
          </Button>
        </RowActions>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Movies"
        description="The full movie catalogue"
        actions={
          <Button icon={Plus} onClick={() => setEditing('new')}>
            Add movie
          </Button>
        }
      />

      <FilterBar onClear={resetFilters}>
        <TextField label="Title" placeholder="Search title" value={filters.title} onChange={(e) => setFilter('title', e.target.value)} />
        <TextField label="Language" placeholder="e.g. Hindi" value={filters.language} onChange={(e) => setFilter('language', e.target.value)} />
        <TextField label="Genre" placeholder="e.g. Action" value={filters.genre} onChange={(e) => setFilter('genre', e.target.value)} />
      </FilterBar>

      <DataTable columns={columns} rows={data?.content} loading={loading} emptyMessage="No movies match these filters." />
      {data && <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onPageChange={setPage} />}

      {editing && (
        <MovieFormModal
          movie={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete movie"
          message={`Delete "${deleting.title}"? This is only possible when the movie never had shows.`}
          loading={deletingBusy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
