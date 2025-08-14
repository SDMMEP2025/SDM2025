import { useState, useEffect, useRef } from 'react'

type Options = {
  tolerance?: number
  squareIsPortrait?: boolean
}

export function useIsLandscape(opts: Options = {}) {
  const { tolerance = 0.5, squareIsPortrait = true } = opts
  const [isLandscape, setIsLandscape] = useState(false)
  const rafRef = useRef<number | null>(null)
  const mqlRef = useRef<MediaQueryList | null>(null)

  useEffect(() => {
    const compute = () => {
      const w = Math.round(window.visualViewport?.width ?? window.innerWidth)
      const h = Math.round(window.visualViewport?.height ?? window.innerHeight)
      const delta = w - h

      if (Math.abs(delta) <= tolerance) {
        setIsLandscape(squareIsPortrait ? false : isLandscape)
        return
      }
      setIsLandscape(delta > 0)
    }

    const schedule = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(compute)
    }

    schedule()

    const vv = window.visualViewport
    vv?.addEventListener('resize', schedule, { passive: true } as any)
    window.addEventListener('resize', schedule, { passive: true })
    window.addEventListener('orientationchange', schedule, { passive: true })

    mqlRef.current = window.matchMedia?.('(orientation: landscape)') ?? null
    const onMQ = () => schedule()
    mqlRef.current?.addEventListener?.('change', onMQ)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      vv?.removeEventListener('resize', schedule as any)
      window.removeEventListener('resize', schedule as any)
      window.removeEventListener('orientationchange', schedule as any)
      mqlRef.current?.removeEventListener?.('change', onMQ)
    }
  }, [tolerance, squareIsPortrait])

  return isLandscape
}
