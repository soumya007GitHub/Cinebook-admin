import styles from './Card.module.css'

/** White panel with an optional title row. */
export default function Card({ title, actions, className = '', children }) {
  return (
    <section className={`${styles.card} ${className}`}>
      {(title || actions) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {actions}
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  )
}
