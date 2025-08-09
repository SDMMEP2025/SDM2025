import { useState, useEffect } from 'react'

export function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    check()
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  return isLandscape
}
