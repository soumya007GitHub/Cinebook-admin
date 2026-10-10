import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { citiesApi } from '@/api/cities'
import Button from '@/components/Button/Button'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog'
import DataTable from '@/components/DataTable/DataTable'
import FilterBar from '@/components/FilterBar/FilterBar'
import PageHeader from '@/components/PageHeader/PageHeader'
import RowActions from '@/components/RowActions/RowActions'
import TextField from '@/components/TextField/TextField'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'
import { useNotify } from '@/hooks/useNotify'
import CityFormModal from './CityFormModal'

export default function CitiesPage() {
  const notify = useNotify()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { data: cities, loading, reload } = useFetch(() => citiesApi.list(debouncedSearch), [debouncedSearch])

  const [editing, setEditing] = useState(null) // null | 'new' | city
  const [deleting, setDeleting] = useState(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  async function confirmDelete() {
    setDeletingBusy(true)
    try {
      await notify.track(citiesApi.remove(deleting.id), { pending: 'Deleting city…', success: `${deleting.name} deleted` })
      setDeleting(null)
      reload()
    } catch {
      // The red toast already explains why (e.g. the city still has theaters)
    } finally {
      setDeletingBusy(false)
    }
  }

  const columns = [
    { key: 'name', header: 'City' },
    { key: 'state', header: 'State' },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (city) => (
        <RowActions>
          <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setEditing(city)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setDeleting(city)}>
            Delete
          </Button>
        </RowActions>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Cities"
        description="Areas customers choose from after logging in"
        actions={
          <Button icon={Plus} onClick={() => setEditing('new')}>
            Add city
          </Button>
        }
      />

      <FilterBar>
        <TextField placeholder="Search by name" value={search} onChange={(event) => setSearch(event.target.value)} />
      </FilterBar>

      <DataTable columns={columns} rows={cities} loading={loading} emptyMessage="No cities found." />

      {editing && (
        <CityFormModal
          city={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete city"
          message={`Delete ${deleting.name}, ${deleting.state}? This is only possible when the city has no theaters.`}
          loading={deletingBusy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
