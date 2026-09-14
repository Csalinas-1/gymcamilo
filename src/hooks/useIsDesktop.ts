import { useEffect, useState } from 'react'

const DESKTOP_QUERY = '(min-width: 1024px)'

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(DESKTOP_QUERY).matches
  })

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  return isDesktop
}
