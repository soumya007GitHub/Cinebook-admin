import Spinner from '@/components/Spinner/Spinner'
import styles from './Button.module.css'

/**
 * variant: 'primary' | 'secondary' | 'danger' | 'ghost'
 * size: 'md' | 'sm'
 * icon: optional lucide icon component shown before the label
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : Icon && <Icon size={size === 'sm' ? 14 : 16} aria-hidden="true" />}
      {children}
    </button>
  )
}
