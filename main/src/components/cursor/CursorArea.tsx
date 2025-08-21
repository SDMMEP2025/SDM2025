'use client'
import React, { useEffect, useRef } from 'react'
import { useCursor, CursorVariant } from './CursorProvider'

export function CursorArea({
  variant,
  children,
  className,
  disabled = false,
}: {
  variant: CursorVariant
  children: React.ReactNode
  className?: string
  disabled?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const tokenRef = useRef<symbol | null>(null)
  const { push, pop, pos } = useCursor() 

  useEffect(() => {
    if (disabled && tokenRef.current) {
      pop(tokenRef.current)
      tokenRef.current = null
    }
  }, [disabled, pop])

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return

    const enter = () => {
      if (!tokenRef.current) tokenRef.current = push(variant)
    }
    const leave = () => {
      if (tokenRef.current) {
        pop(tokenRef.current)
        tokenRef.current = null
      }
    }

    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointercancel', leave)

    if (el.matches(':hover')) enter()
    const MARGIN = 4
    const within = () => {
      const r = el.getBoundingClientRect()
      const x = pos.x, y = pos.y
      if (x === -9999 && y === -9999) return false
      return (
        x >= r.left - MARGIN &&
        x <= r.right + MARGIN &&
        y >= r.top - MARGIN &&
        y <= r.bottom + MARGIN
      )
    }

    let raf = 0
    const recheck = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (within()) enter()
        else leave()
      })
    }

    window.addEventListener('scroll', recheck, { passive: true, capture: true })
    window.addEventListener('resize', recheck, { passive: true })
    document.addEventListener('wheel', recheck, { passive: true })

    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('pointercancel', leave)
      window.removeEventListener('scroll', recheck, true as any)
      window.removeEventListener('resize', recheck)
      document.removeEventListener('wheel', recheck)
      if (raf) cancelAnimationFrame(raf)
      leave()
    }
  }, [push, pop, variant, pos, disabled])

  return (
    <div ref={ref} className={className} data-cursor-disabled={disabled || undefined}>
      {children}
    </div>
  )
}
