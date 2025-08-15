// hooks/useSnapP0toP5.ts
'use client'
import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'

type Cut = { start: number; end: number }

export function useSnapP0toP5(
  wrapRef: React.RefObject<HTMLDivElement | null>,
  scrollYProgress: MotionValue<number>,
  cuts: readonly Cut[],
  opts?: { duration?: number; nearPct?: number },
) {
  const DUR = opts?.duration ?? 500
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

  const setOverscroll = (on: boolean) => {
    const el = document.documentElement
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

  // progress -> document scrollTop
  const progressToTop = (p: number) => {
    const el = wrapRef.current!
    const rect = el.getBoundingClientRect()
    const docTop = window.scrollY + rect.top
    const total = rect.height
    return docTop + p * total
  }

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

  const animateTo = (targetTop: number, dur = DUR) => {
    if (animating.current) return
    animating.current = true
    setOverscroll(true)
    const startTop = window.scrollY
    const delta = targetTop - startTop
    const t0 = performance.now()

    const step = (now: number) => {
      const k = Math.min((now - t0) / dur, 1)
      const y = startTop + delta * ease(k)
      window.scrollTo(0, y)
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
    const el = wrapRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const band = getActiveBand()
      if (!band) return // 스냅 영역 밖 → 네이티브
      e.preventDefault()

      const [i, j] = band
      const p = scrollYProgress.get()
      const a = cuts[i].start
      const b = cuts[j].start

      if (animating.current) return
      if (e.deltaY > 0) {
        // 앞으로: 항상 다음 컷 시작점(b)으로
        animateTo(progressToTop(b))
      } else if (e.deltaY < 0) {
        // 뒤로: 시작점 근처면 이전 컷으로, 아니면 현재 컷 시작점(a)
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
        // 위로 스와이프(스크롤 다운) → 다음 컷
        animateTo(progressToTop(b))
      } else {
        // 아래로 스와이프(스크롤 업) → 이전/현재 시작
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

    const onScroll = () => {
      // 스냅 중엔 브라우저 관성/바운스로 대충 멈추는 거 방지
      if (!getActiveBand() || !animating.current) return
      // 아무 것도 안 해도 됨 (animateTo가 주도)
    }

    window.addEventListener('wheel', onWheel as any, { passive: false })
    window.addEventListener('touchstart', onTouchStart as any, { passive: true })
    window.addEventListener('touchmove', onTouchMove as any, { passive: false })
    window.addEventListener('keydown', onKeyDown as any, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel as any)
      window.removeEventListener('touchstart', onTouchStart as any)
      window.removeEventListener('touchmove', onTouchMove as any)
      window.removeEventListener('keydown', onKeyDown as any)
      window.removeEventListener('scroll', onScroll)
      if (snapRaf.current) cancelAnimationFrame(snapRaf.current)
      setOverscroll(false)
    }
  }, [wrapRef, scrollYProgress, cuts, DUR, NEAR])
}
