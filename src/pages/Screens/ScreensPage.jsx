import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { screensApi } from '@/api/screens'
import Button from '@/components/Button/Button'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog'
import DataTable from '@/components/DataTable/DataTable'
import PageHeader from '@/components/PageHeader/PageHeader'
import RowActions from '@/components/RowActions/RowActions'
import { useFetch } from '@/hooks/useFetch'
import { useNotify } from '@/hooks/useNotify'
import { formatNumber } from '@/utils/format'
import ScreenFormModal from './ScreenFormModal'
import styles from './ScreensPage.module.css'

export default function ScreensPage() {
  const { theaterId } = useParams()
  const location = useLocation()
  const notify = useNotify()
  const { data: screens, loading, reload } = useFetch(() => screensApi.listByTheater(theaterId), [theaterId])

  const theaterName = location.state?.theaterName ?? screens?.[0]?.theaterName ?? `Theater #${theaterId}`
  const cityId = location.state?.cityId
  const backTo = cityId ? `/theaters?cityId=${cityId}` : '/theaters'

  const [editing, setEditing] = useState(null) // null | 'new' | screen
  const [deleting, setDeleting] = useState(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  async function confirmDelete() {
    setDeletingBusy(true)
    try {
      await notify.track(screensApi.remove(deleting.id), { pending: 'Deleting screen…', success: `${deleting.name} deleted` })
      setDeleting(null)
      reload()
    } catch {
      // Explained by the red toast
    } finally {
      setDeletingBusy(false)
    }
  }

  const columns = [
    { key: 'name', header: 'Screen' },
    { key: 'totalSeats', header: 'Seats', align: 'right', render: (screen) => formatNumber(screen.totalSeats) },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (screen) => (
        <RowActions>
          <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setEditing(screen)}>
            Edit layout
          </Button>
          <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setDeleting(screen)}>
            Delete
          </Button>
        </RowActions>
      ),
    },
  ]

  return (
    <>
      <Link to={backTo} className={styles.back}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to theaters
      </Link>
      <PageHeader
        title={`Screens · ${theaterName}`}
        description="Auditoriums and their seat layouts"
        actions={
          <Button icon={Plus} onClick={() => setEditing('new')}>
            Add screen
          </Button>
        }
      />

      <DataTable columns={columns} rows={screens} loading={loading} emptyMessage="No screens yet. Add the first one." />

      {editing && (
        <ScreenFormModal
          screenId={editing === 'new' ? null : editing.id}
          theaterId={Number(theaterId)}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete screen"
          message={`Delete ${deleting.name}? This is only possible when no show was ever scheduled on it.`}
          loading={deletingBusy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
