import { useState } from 'react'

export type Theme = 'light' | 'dark'
const THEME_KEY = 'baseball-manager-theme'

export function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // private mode 등 저장소 접근 불가 시 시스템 설정 사용
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem(THEME_KEY, next) } catch { /* 현재 탭에는 계속 적용 */ }
    applyTheme(next)
  }
  return (
    <button type="button" className={`bm-btn bm-btn-ghost text-xs ${className}`} onClick={toggle} aria-pressed={theme === 'dark'} aria-label={`${theme === 'dark' ? '라이트' : '다크'} 모드로 전환`}>
      {theme === 'dark' ? '☀️ 라이트' : '🌙 다크'}
    </button>
  )
}
