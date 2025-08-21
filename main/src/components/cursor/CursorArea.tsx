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
  const { push, pop, pos } = useCursor() // pos: {x,y}

  // disabled가 되면 즉시 pop
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

    // 기본 포인터 경계 감지
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointercancel', leave)

    // 마운트 시 이미 hover면 즉시 적용
    if (el.matches(':hover')) enter()

    // 스크롤/리사이즈 보정 (경계 근처 떨림 완화용)
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

    // 🔥 iframe-safe: :hover 폴링(부모 matches(':hover')로 감지)
    let rafHover = 0
    let wasHover = el.matches(':hover')
    const pollHover = () => {
      const hov = el.matches(':hover')
      if (hov !== wasHover) {
        wasHover = hov
        hov ? enter() : leave()
      }
      rafHover = requestAnimationFrame(pollHover)
    }
    rafHover = requestAnimationFrame(pollHover)

    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('pointercancel', leave)
      window.removeEventListener('scroll', recheck, true as any)
      window.removeEventListener('resize', recheck)
      document.removeEventListener('wheel', recheck)
      if (raf) cancelAnimationFrame(raf)
      if (rafHover) cancelAnimationFrame(rafHover)
      leave()
    }
  }, [push, pop, variant, pos, disabled])

  return (
    <div ref={ref} className={className} data-cursor-disabled={disabled || undefined}>
      {children}
    </div>
  )
}
