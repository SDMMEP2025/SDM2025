// hooks/useSnapP0toP4.ts
'use client'
import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'

type Cut = { start: number; end: number }

export function useSnapP0toP4(
  wrapRef: React.RefObject<HTMLElement | null>,
  scrollYProgress: MotionValue<number>,
  cuts: readonly Cut[],
  opts?: {
    duration?: number
    nearPct?: number
    scrollerRef?: React.RefObject<HTMLElement | null> // ★ 추가
  },
) {
  const DUR = opts?.duration ?? 280
  const NEAR = opts?.nearPct ?? 0.05

  const snapBands: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ]

  const animating = useRef(false)
  const touchStartY = useRef<number | null>(null)
  const snapRaf = useRef<number | null>(null)
  const prevOverscroll = useRef<string | null>(null)

  const scrollerEl = () =>
    (opts?.scrollerRef?.current as HTMLElement | null) ||
    (document.scrollingElement as unknown as HTMLElement) ||
    (document.documentElement as HTMLElement)

  const setOverscroll = (on: boolean) => {
    const el = scrollerEl()
    if (!el) return
    if (on) {
      if (prevOverscroll.current == null) prevOverscroll.current = el.style.overscrollBehavior || ''
      el.style.overscrollBehavior = 'contain'
      document.body.style.pointerEvents = 'none'
    } else {
      if (prevOverscroll.current != null) el.style.overscrollBehavior = prevOverscroll.current
      prevOverscroll.current = null
      document.body.style.pointerEvents = ''
    }
  }

  const progressToTop = (p: number) => {
    const wrap = wrapRef.current!
    const startY = (wrap as HTMLElement).offsetTop // ★ 안정 기준
    const total = wrap.offsetHeight
    return startY + p * total
  }

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

  const animateTo = (targetTop: number, dur = DUR) => {
    if (animating.current) return
    const scroller = scrollerEl()
    if (!scroller) return
    const startTop = scroller.scrollTop
    if (Math.abs(targetTop - startTop) < 1) return // 이동량 미미하면 생략

    animating.current = true
    setOverscroll(true)

    const delta = targetTop - startTop
    const t0 = performance.now()

    const step = (now: number) => {
      const k = Math.min((now - t0) / dur, 1)
      const y = startTop + delta * ease(k)
      scroller.scrollTo({ top: y, behavior: 'auto' })
      if (k < 1) {
        snapRaf.current = requestAnimationFrame(step)
      } else {
        animating.current = false
        setOverscroll(false)
      }
    }
    snapRaf.current = requestAnimationFrame(step)
  }

  const getActiveBand = (): [number, number] | null => {
    const p = scrollYProgress.get()
    for (const [i, j] of snapBands) {
      const a = cuts[i].start
      const b = cuts[j].start
      if (p >= a - 0.0005 && p < b - 0.0005) return [i, j]
    }
    return null
  }

  useEffect(() => {
    const box = opts?.scrollerRef?.current || window // 이벤트는 box에

    const onWheel = (e: WheelEvent) => {
      const band = getActiveBand()
      if (!band) return
      e.preventDefault()

      const [i, j] = band
      const p = scrollYProgress.get()
      const a = cuts[i].start
      const b = cuts[j].start

      if (animating.current) return
      if (e.deltaY > 0) {
        animateTo(progressToTop(b))
      } else if (e.deltaY < 0) {
        const prev = i - 1 >= 0 ? cuts[i - 1].start : null
        if (prev != null && p - a <= NEAR) animateTo(progressToTop(prev))
        else animateTo(progressToTop(a))
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      if (!getActiveBand()) return
      touchStartY.current = e.touches[0]?.clientY ?? null
    }

    const onTouchMove = (e: TouchEvent) => {
      const band = getActiveBand()
      if (!band) return
      const y0 = touchStartY.current
      if (y0 == null) return
      const dy = y0 - (e.touches[0]?.clientY ?? y0)
      if (Math.abs(dy) < 6) return
      e.preventDefault()

      const [i, j] = band
      const p = scrollYProgress.get()
      const a = cuts[i].start
      const b = cuts[j].start

      if (animating.current) return
      if (dy > 0) {
        animateTo(progressToTop(b))
      } else {
        const prev = i - 1 >= 0 ? cuts[i - 1].start : null
        if (prev != null && p - a <= NEAR) animateTo(progressToTop(prev))
        else animateTo(progressToTop(a))
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const band = getActiveBand()
      if (!band) return
      const downKeys = [' ', 'PageDown', 'ArrowDown', 'End']
      const upKeys = ['PageUp', 'ArrowUp', 'Home']
      if (![...downKeys, ...upKeys].includes(e.key)) return
      e.preventDefault()

      const [i, j] = band
      const p = scrollYProgress.get()
      const a = cuts[i].start
      const b = cuts[j].start

      if (animating.current) return
      if (downKeys.includes(e.key)) {
        animateTo(progressToTop(b))
      } else {
        const prev = i - 1 >= 0 ? cuts[i - 1].start : null
        if (prev != null && p - a <= NEAR) animateTo(progressToTop(prev))
        else animateTo(progressToTop(a))
      }
    }

    box.addEventListener('wheel', onWheel as EventListener, { passive: false } as any)
    box.addEventListener('touchstart', onTouchStart as EventListener, { passive: true } as any)
    box.addEventListener('touchmove', onTouchMove as EventListener, { passive: false } as any)
    box.addEventListener('keydown', onKeyDown as EventListener, { passive: false } as any)

    return () => {
      box.removeEventListener('wheel', onWheel as EventListener)
      box.removeEventListener('touchstart', onTouchStart as EventListener)
      box.removeEventListener('touchmove', onTouchMove as EventListener)
      box.removeEventListener('keydown', onKeyDown as EventListener)
      if (snapRaf.current) cancelAnimationFrame(snapRaf.current)
      setOverscroll(false)
    }
  }, [wrapRef, scrollYProgress, cuts, DUR, NEAR, opts?.scrollerRef])
}
