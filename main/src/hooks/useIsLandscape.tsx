import { useState, useEffect } from 'react'

export function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState(false)

  useEffect(() => {
    let raf = 0

    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const w = window.visualViewport?.width ?? window.innerWidth
        const h = window.visualViewport?.height ?? window.innerHeight
        setIsLandscape(w > h)
      })
    }

    update()
    window.visualViewport?.addEventListener('resize', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    return () => {
      cancelAnimationFrame(raf)
      window.visualViewport?.removeEventListener('resize', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return isLandscape
}
