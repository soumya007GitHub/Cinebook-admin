import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { ThemeContext } from './ThemeContext'

const STORAGE_KEY = 'cinebook_admin_theme'
const THEMES = ['light', 'dark']

function initialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (THEMES.includes(saved)) return saved
  } catch {
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function themeReducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return state === 'dark' ? 'light' : 'dark'
    case 'set':
      return THEMES.includes(action.theme) ? action.theme : state
    default:
      return state
  }
}

export default function ThemeProvider({ children }) {
  const [theme, dispatch] = useReducer(themeReducer, undefined, initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
    }
  }, [theme])

  const toggleTheme = useCallback(() => dispatch({ type: 'toggle' }), [])
  const setTheme = useCallback((value) => dispatch({ type: 'set', theme: value }), [])

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
