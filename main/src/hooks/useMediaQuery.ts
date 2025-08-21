import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)

    setMatches(mql.matches)

    try {
      mql.addEventListener('change', onChange)
    } catch {
      ;(mql as any).addListener?.(onChange)
    }

    return () => {
      try {
        mql.removeEventListener('change', onChange)
      } catch {
        ;(mql as any).removeListener?.(onChange)
      }
    }
  }, [query])

  return matches
}
