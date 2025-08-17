'use client'
import { useEffect } from 'react'

export function useStableVh() {
  useEffect(() => {
    const set = () => {
      const h1 = window.innerHeight
      const h2 = window.visualViewport?.height ?? h1
      const vh = Math.floor(Math.min(h1, h2) / 100)
      document.documentElement.style.setProperty('--vh-stable', `${vh}px`)
    }
    const on = () => requestAnimationFrame(set)
    set()
    window.addEventListener('resize', on)
    window.visualViewport?.addEventListener('resize', on)
    window.addEventListener('orientationchange', on)
    return () => {
      window.removeEventListener('resize', on)
      window.visualViewport?.removeEventListener('resize', on)
      window.removeEventListener('orientationchange', on)
    }
  }, [])
}
