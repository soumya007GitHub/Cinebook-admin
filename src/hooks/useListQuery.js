import { useCallback, useState } from 'react'
import { useDebounce } from './useDebounce'

export function useListQuery(initialFilters, pageSize = 20) {
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(0)
  const debouncedFilters = useDebounce(filters, 300)

  const setFilter = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
    setPage(0)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
    setPage(0)
  }, [initialFilters])

  return {
    filters,
    setFilter,
    resetFilters,
    page,
    setPage,
    query: { ...debouncedFilters, page, size: pageSize },
    queryKey: [debouncedFilters, page],
  }
}
