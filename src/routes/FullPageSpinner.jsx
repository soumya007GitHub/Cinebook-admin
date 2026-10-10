import Spinner from '@/components/Spinner/Spinner'
import styles from './FullPageSpinner.module.css'

export default function FullPageSpinner() {
  return (
    <div className={styles.page}>
      <Spinner size="lg" />
    </div>
  )
}
