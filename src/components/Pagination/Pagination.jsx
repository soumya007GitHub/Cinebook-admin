import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/Button/Button'
import { formatNumber } from '@/utils/format'
import styles from './Pagination.module.css'

/** Works with the backend's PageResponse: { page, totalPages, totalElements } (page is 0-based). */
export default function Pagination({ page, totalPages, totalElements, onPageChange }) {
  if (!totalElements) return null
  return (
    <div className={styles.pagination}>
      <span className={styles.summary}>
        {formatNumber(totalElements)} result{totalElements === 1 ? '' : 's'} · page {page + 1} of {Math.max(totalPages, 1)}
      </span>
      <div className={styles.buttons}>
        <Button variant="secondary" size="sm" icon={ChevronLeft} disabled={page === 0} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
          <ChevronRight size={14} aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
