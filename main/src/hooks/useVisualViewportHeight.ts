import { useEffect } from 'react'

export function useVisualViewportHeight() {
  useEffect(() => {
    const set = () => {
      const h = window.visualViewport?.height ?? window.innerHeight
      document.documentElement.style.setProperty('--vvh', `${h}px`)
    }
    set()
    window.visualViewport?.addEventListener('resize', set)
    window.addEventListener('orientationchange', set)
    window.addEventListener('resize', set)
    return () => {
      window.visualViewport?.removeEventListener('resize', set)
      window.removeEventListener('orientationchange', set)
      window.removeEventListener('resize', set)
    }
  }, [])
}
