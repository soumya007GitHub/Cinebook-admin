import { useState } from 'react'
import { Film } from 'lucide-react'
import styles from './MoviePoster.module.css'

/** Poster thumbnail; falls back to a placeholder when there is no URL or it fails to load. */
export default function MoviePoster({ url, title, size = 'sm' }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const showImage = url && failedUrl !== url

  return (
    <div className={`${styles.poster} ${styles[size]}`}>
      {showImage ? (
        <img src={url} alt={`${title} poster`} loading="lazy" onError={() => setFailedUrl(url)} />
      ) : (
        <Film size={size === 'sm' ? 16 : 28} aria-hidden="true" />
      )}
    </div>
  )
}
