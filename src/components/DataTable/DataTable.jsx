import Spinner from '@/components/Spinner/Spinner'
import styles from './DataTable.module.css'

/**
 * columns: [{ key, header, render?: (row) => node, align?: 'left' | 'right', width? }]
 * Without `render` the cell shows row[key]. Scrolls sideways on small screens.
 */
export default function DataTable({ columns, rows, loading = false, emptyMessage = 'Nothing to show yet.', onRowClick, rowKey = 'id' }) {
  const hasRows = rows && rows.length > 0

  return (
    <div className={styles.wrapper}>
      <table className={`${styles.table} ${loading && hasRows ? styles.dimmed : ''}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ width: column.width, textAlign: column.align }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasRows &&
            rows.map((row) => (
              <tr
                key={row[rowKey]}
                className={onRowClick ? styles.clickable : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} style={{ textAlign: column.align }}>
                    {column.render ? column.render(row) : row[column.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {!hasRows && (
        <div className={styles.state}>{loading ? <Spinner /> : <span>{emptyMessage}</span>}</div>
      )}
    </div>
  )
}
