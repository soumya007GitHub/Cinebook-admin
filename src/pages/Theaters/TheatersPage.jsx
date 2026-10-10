import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { MonitorPlay, Pencil, Plus, Trash2 } from 'lucide-react'
import { citiesApi } from '@/api/cities'
import { theatersApi } from '@/api/theaters'
import Button from '@/components/Button/Button'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog'
import DataTable from '@/components/DataTable/DataTable'
import FilterBar from '@/components/FilterBar/FilterBar'
import PageHeader from '@/components/PageHeader/PageHeader'
import RowActions from '@/components/RowActions/RowActions'
import SelectField from '@/components/SelectField/SelectField'
import { useFetch } from '@/hooks/useFetch'
import { useNotify } from '@/hooks/useNotify'
import { toSelectOptions } from '@/utils/format'
import TheaterFormModal from './TheaterFormModal'

export default function TheatersPage() {
  const notify = useNotify()
  const navigate = useNavigate()
  // City lives in the URL so "back" from the screens page returns to the same list
  const [searchParams, setSearchParams] = useSearchParams()

  const { data: cities } = useFetch(() => citiesApi.list(), [])
  const cityId = searchParams.get('cityId') ?? (cities?.[0] ? String(cities[0].id) : '')

  const { data: theaters, loading, reload } = useFetch(
    () => (cityId ? theatersApi.listByCity(cityId) : Promise.resolve([])),
    [cityId],
  )

  const [editing, setEditing] = useState(null) // null | 'new' | theater
  const [deleting, setDeleting] = useState(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  async function confirmDelete() {
    setDeletingBusy(true)
    try {
      await notify.track(theatersApi.remove(deleting.id), { pending: 'Deleting theater…', success: `${deleting.name} deleted` })
      setDeleting(null)
      reload()
    } catch {
      // Explained by the red toast
    } finally {
      setDeletingBusy(false)
    }
  }

  const columns = [
    { key: 'name', header: 'Theater' },
    { key: 'address', header: 'Address' },
    { key: 'pincode', header: 'Pincode' },
    { key: 'screenCount', header: 'Screens', align: 'right' },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (theater) => (
        <RowActions>
          <Button
            variant="ghost"
            size="sm"
            icon={MonitorPlay}
            onClick={() => navigate(`/theaters/${theater.id}/screens`, { state: { theaterName: theater.name, cityId } })}
          >
            Screens
          </Button>
          <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setEditing(theater)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setDeleting(theater)}>
            Delete
          </Button>
        </RowActions>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Theaters"
        description="Film halls in each city and their screens"
        actions={
          <Button icon={Plus} onClick={() => setEditing('new')} disabled={!cities?.length}>
            Add theater
          </Button>
        }
      />

      <FilterBar>
        <SelectField
          label="City"
          value={cityId}
          options={toSelectOptions(cities, (city) => `${city.name}, ${city.state}`)}
          onChange={(event) => setSearchParams({ cityId: event.target.value })}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        rows={theaters}
        loading={loading}
        emptyMessage={cities?.length === 0 ? 'Add a city first.' : 'No theaters in this city yet.'}
      />

      {editing && (
        <TheaterFormModal
          theater={editing === 'new' ? null : editing}
          defaultCityId={cityId}
          cities={cities ?? []}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setEditing(null)
            if (String(saved.city.id) !== cityId) setSearchParams({ cityId: String(saved.city.id) })
            else reload()
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete theater"
          message={`Delete ${deleting.name} and all its screens? This is only possible when no show was ever scheduled there.`}
          loading={deletingBusy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
