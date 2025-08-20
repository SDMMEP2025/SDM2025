'use client'
import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'

type Cut = { start: number; end: number }

type SnapOptions = {
  duration?: number
  nearPct?: number
  scrollerRef?: React.RefObject<HTMLElement | null>
  ignore?: number[]
  durationTable?: Partial<Record<`${number}->${number}`, number>>
  getDuration?: (
    fromIdx: number,
    toIdx: number,
    ctx: { direction: 'forward' | 'backward'; pointer: 'coarse' | 'fine'; fastSwipe: boolean },
  ) => number | undefined
}

export function useSnapP0toP4(
  wrapRef: React.RefObject<HTMLElement | null>,
  scrollYProgress: MotionValue<number>,
  cuts: readonly Cut[],
  opts: SnapOptions = {},
) {
  const DUR = opts?.duration ?? 280
  const NEAR = opts?.nearPct ?? 0.05
  const ignoreSet = new Set(opts?.ignore ?? [])

  const animating = useRef(false)
  const touchStartY = useRef<number | null>(null)
  const snapRaf = useRef<number | null>(null)
  const prevOverscroll = useRef<string | null>(null)

  // i->j로 이어지는 스냅 밴드 목록
  const snapBands: [number, number][] = []
  for (let i = 0; i < cuts.length - 1; i++) {
    if (ignoreSet.has(i) || ignoreSet.has(i + 1)) continue
    snapBands.push([i, i + 1])
  }

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
    const startY = (wrap as HTMLElement).offsetTop
    const total = wrap.offsetHeight
    return startY + p * total
  }

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

  const animateTo = (targetTop: number, dur = DUR) => {
    if (animating.current) return
    const scroller = scrollerEl()
    if (!scroller) return
    const startTop = scroller.scrollTop
    if (Math.abs(targetTop - startTop) < 1) return

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

  // 구간별/방향별 지속시간 결정
  const resolveDuration = (
    fromIdx: number,
    toIdx: number,
    ctx: { direction: 'forward' | 'backward'; pointer: 'coarse' | 'fine'; fastSwipe: boolean },
  ) => {
    // 1) 사용자 함수가 있으면 최우선
    const byFn = opts.getDuration?.(fromIdx, toIdx, ctx)
    if (typeof byFn === 'number' && !Number.isNaN(byFn)) return Math.max(0, byFn)

    // 2) durationTable "i->j"
    const key = `${fromIdx}->${toIdx}` as const
    const byTable = opts.durationTable?.[key]
    let base = typeof byTable === 'number' ? byTable : DUR

    // 3) 포인터/스와이프 보정 (기존 동작 유지 + 약간의 유틸리티)
    if (ctx.pointer === 'coarse') {
      // 터치 기본 단축
      base = Math.max(200, Math.round(base * 0.9))
      if (ctx.fastSwipe) {
        base = Math.max(60, base - 120)
      }
    }
    return base
  }

  useEffect(() => {
    const box = (opts?.scrollerRef?.current as unknown as HTMLElement) || window

    const isCoarsePointer = typeof matchMedia !== 'undefined' ? matchMedia('(pointer: coarse)').matches : false
    const DY_MIN = isCoarsePointer ? 1 : 2

    const onWheel = (e: WheelEvent) => {
      const band = getActiveBand()
      if (!band) return
      e.preventDefault()
      if (animating.current) return

      const [i, j] = band
      const p = scrollYProgress.get()
      const a = cuts[i].start
      const b = cuts[j].start

      if (e.deltaY > 0) {
        // 아래로 스크롤 → forward: i -> j
        const dur = resolveDuration(i, j, { direction: 'forward', pointer: 'fine', fastSwipe: false })
        animateTo(progressToTop(b), dur)
      } else if (e.deltaY < 0) {
        // 위로 스크롤 → backward: j의 시작점 쪽으로 갈지, 이전(prev)로 갈지
        const prev = i - 1 >= 0 ? i - 1 : null
        let toIdx = i
        if (prev != null && p - a <= NEAR) toIdx = prev
        const target = toIdx === i ? a : cuts[toIdx].start
        const dur = resolveDuration(i, toIdx, { direction: 'backward', pointer: 'fine', fastSwipe: false })
        animateTo(progressToTop(target), dur)
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
      if (Math.abs(dy) < DY_MIN) return
      e.preventDefault()
      if (animating.current) return

      const [i, j] = band
      const p = scrollYProgress.get()
      const a = cuts[i].start
      const b = cuts[j].start

      const fastSwipe = Math.abs(dy) > 20

      if (dy > 0) {
        // 위로 스와이프(아래로 스크롤) → forward
        const dur = resolveDuration(i, j, { direction: 'forward', pointer: 'coarse', fastSwipe })
        animateTo(progressToTop(b), dur)
      } else {
        // 아래로 스와이프(위로 스크롤) → backward
        const prev = i - 1 >= 0 ? i - 1 : null
        let toIdx = i
        if (prev != null && p - a <= NEAR) toIdx = prev
        const target = toIdx === i ? a : cuts[toIdx].start
        const dur = resolveDuration(i, toIdx, { direction: 'backward', pointer: 'coarse', fastSwipe })
        animateTo(progressToTop(target), dur)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const band = getActiveBand()
      if (!band) return

      const downKeys = [' ', 'PageDown', 'ArrowDown', 'End']
      const upKeys = ['PageUp', 'ArrowUp', 'Home']
      if (![...downKeys, ...upKeys].includes(e.key)) return

      e.preventDefault()
      if (animating.current) return

      const [i, j] = band
      const p = scrollYProgress.get()
      const a = cuts[i].start
      const b = cuts[j].start

      if (downKeys.includes(e.key)) {
        const dur = resolveDuration(i, j, { direction: 'forward', pointer: 'fine', fastSwipe: false })
        animateTo(progressToTop(b), dur)
      } else {
        const prev = i - 1 >= 0 ? i - 1 : null
        let toIdx = i
        if (prev != null && p - a <= NEAR) toIdx = prev
        const target = toIdx === i ? a : cuts[toIdx].start
        const dur = resolveDuration(i, toIdx, { direction: 'backward', pointer: 'fine', fastSwipe: false })
        animateTo(progressToTop(target), dur)
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
  }, [wrapRef, scrollYProgress, cuts, DUR, NEAR, opts?.scrollerRef, opts.durationTable, opts.getDuration])
}
