import { reportsApi } from '@/api/reports'
import DataTable from '@/components/DataTable/DataTable'
import FilterBar from '@/components/FilterBar/FilterBar'
import PageHeader from '@/components/PageHeader/PageHeader'
import Pagination from '@/components/Pagination/Pagination'
import SelectField from '@/components/SelectField/SelectField'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import TextField from '@/components/TextField/TextField'
import { PAGE_SIZE, ROLE_OPTIONS, YES_NO_OPTIONS } from '@/constants/options'
import { useFetch } from '@/hooks/useFetch'
import { useListQuery } from '@/hooks/useListQuery'
import { formatDate } from '@/utils/format'

const INITIAL_FILTERS = { search: '', role: '', emailVerified: '' }

export default function UsersPage() {
  const { filters, setFilter, resetFilters, setPage, query, queryKey } = useListQuery(INITIAL_FILTERS, PAGE_SIZE)
  const { data, loading } = useFetch(() => reportsApi.users(query), queryKey)

  const columns = [
    { key: 'fullName', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phoneNumber', header: 'Phone' },
    { key: 'role', header: 'Role', render: (user) => <StatusBadge status={user.role} /> },
    {
      key: 'emailVerified',
      header: 'Verified',
      render: (user) =>
        user.emailVerified ? <StatusBadge tone="success">Yes</StatusBadge> : <StatusBadge tone="warning">Pending</StatusBadge>,
    },
    { key: 'googleLinked', header: 'Google', render: (user) => (user.googleLinked ? 'Linked' : '—') },
    { key: 'city', header: 'City', render: (user) => user.preferredCity?.name ?? '—' },
    { key: 'createdAt', header: 'Joined', render: (user) => formatDate(user.createdAt) },
  ]

  return (
    <>
      <PageHeader title="Users" description="Everyone with a Cinebook account" />

      <FilterBar onClear={resetFilters}>
        <TextField label="Search" placeholder="Name or email" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
        <SelectField label="Role" value={filters.role} options={ROLE_OPTIONS} placeholder="Any role" onChange={(e) => setFilter('role', e.target.value)} />
        <SelectField
          label="Email verified"
          value={filters.emailVerified}
          options={YES_NO_OPTIONS}
          placeholder="Any"
          onChange={(e) => setFilter('emailVerified', e.target.value)}
        />
      </FilterBar>

      <DataTable columns={columns} rows={data?.content} loading={loading} emptyMessage="No users match these filters." />
      {data && <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onPageChange={setPage} />}
    </>
  )
}
