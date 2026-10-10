import { Component } from 'react'
import Button from '@/components/Button/Button'
import styles from './ErrorBoundary.module.css'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Render error:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className={styles.fallback} role="alert">
        <h2 className={styles.title}>Something went wrong on this page</h2>
        <p className={styles.text}>{this.state.error.message}</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
    )
  }
}
