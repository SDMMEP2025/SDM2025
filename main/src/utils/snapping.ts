'use client'
import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'

type Cut = { start: number; end: number }

// 섹션별 규칙 타입
type SectionDurationRule =
  | number
  | {
      /** 해당 섹션으로 "들어갈 때"(toIdx===섹션) 우선 적용 */
      enter?: number
      /** 해당 섹션에서 "나갈 때"(fromIdx===섹션) 우선 적용 */
      leave?: number
      /** 방향별 보정(enter/leave와 함께 쓰면 더 높은 우선순위로 병합) */
      forward?: number
      backward?: number
      /** 최종적으로 컨텍스트 기반으로 직접 계산하고 싶을 때 */
      fn?: (
        fromIdx: number,
        toIdx: number,
        ctx: { direction: 'forward' | 'backward'; pointer: 'coarse' | 'fine'; fastSwipe: boolean },
      ) => number | undefined
    }

type SnapOptions = {
  duration?: number
  nearPct?: number
  scrollerRef?: React.RefObject<HTMLElement | null>
  ignore?: number[]
  /** i->j 구간 쌍 기준 */
  durationTable?: Partial<Record<`${number}->${number}`, number>>
  /** 완전 커스텀 */
  getDuration?: (
    fromIdx: number,
    toIdx: number,
    ctx: { direction: 'forward' | 'backward'; pointer: 'coarse' | 'fine'; fastSwipe: boolean },
  ) => number | undefined
  sectionDurations?: Partial<Record<number, SectionDurationRule>>
}

export function useSnapP0toP4(
  wrapRef: React.RefObject<HTMLElement | null>,
  scrollYProgress: MotionValue<number>,
  cuts: readonly Cut[],
  opts: SnapOptions = {},
) {
  const DUR = opts?.duration ?? 900
  const NEAR = opts?.nearPct ?? 0.01
  const ignoreSet = new Set(opts?.ignore ?? [])

  const animating = useRef(false)
  const touchStartY = useRef<number | null>(null)
  const snapRaf = useRef<number | null>(null)
  const prevOverscroll = useRef<string | null>(null)
  const prevTouchAction = useRef<string | null>(null)

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

    const target = el as HTMLElement

    if (on) {
      if (prevOverscroll.current == null) prevOverscroll.current = target.style.overscrollBehavior || ''
      if (prevTouchAction.current == null) prevTouchAction.current = target.style.touchAction || ''
      target.style.overscrollBehavior = 'contain'
      target.style.touchAction = 'none'
    } else {
      if (prevOverscroll.current != null) {
        target.style.overscrollBehavior = prevOverscroll.current
        prevOverscroll.current = null
      } else {
        target.style.overscrollBehavior = ''
      }

      if (prevTouchAction.current != null) {
        target.style.touchAction = prevTouchAction.current
        prevTouchAction.current = null
      } else {
        target.style.touchAction = ''
      }
    }
  }

  const progressToTop = (p: number) => {
    const wrap = wrapRef.current!
    const startY = (wrap as HTMLElement).offsetTop
    const total = wrap.offsetHeight
    return startY + p * total
  }

  const ease = (t: number) => t

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
      if (p >= a - 0.00015 && p < b - 0.00015) return [i, j]
    }
    return null
  }

  // ★ 섹션 규칙 해석
  const resolveBySectionRule = (
    rule: SectionDurationRule | undefined,
    fromIdx: number,
    toIdx: number,
    ctx: { direction: 'forward' | 'backward'; pointer: 'coarse' | 'fine'; fastSwipe: boolean },
  ): number | undefined => {
    if (rule == null) return undefined
    if (typeof rule === 'number') return rule

    // fn이 있으면 최우선
    const byFn = rule.fn?.(fromIdx, toIdx, ctx)
    if (typeof byFn === 'number' && !Number.isNaN(byFn)) return Math.max(0, byFn)

    // enter/leave 우선
    let candidate: number | undefined
    if (toIdx in (opts.sectionDurations ?? {})) {
      if (rule.enter != null && toIdx !== fromIdx) candidate = rule.enter
    }
    if (fromIdx in (opts.sectionDurations ?? {})) {
      if (rule.leave != null && toIdx !== fromIdx) candidate = rule.leave
    }

    // 방향별 보정이 있으면 그걸로 치환
    if (ctx.direction === 'forward' && rule.forward != null) candidate = rule.forward
    if (ctx.direction === 'backward' && rule.backward != null) candidate = rule.backward

    return typeof candidate === 'number' ? Math.max(0, candidate) : undefined
  }

  // 구간별/방향별 지속시간 결정
  const resolveDuration = (
    fromIdx: number,
    toIdx: number,
    ctx: { direction: 'forward' | 'backward'; pointer: 'coarse' | 'fine'; fastSwipe: boolean },
  ) => {
    let base = DUR

    // 포인터/스와이프 보정(기존 로직 유지)
    if (ctx.pointer === 'coarse') {
      base = Math.max(200, Math.round(base * 0.9))
      if (ctx.fastSwipe) {
        base = Math.max(60, base - 120)
      }
    }
    return base
  }
  useEffect(() => {
    let targetEl: HTMLElement | Window | null = null
    let rafId: number | null = null

    const getScroller = () => (opts?.scrollerRef?.current as HTMLElement | null) || null // 컨테이너 준비 전엔 null 반환

    const bind = (el: HTMLElement | Window) => {
      // wheel/touch는 요소에, keyboard는 window에
      const wheelTarget = (el as HTMLElement) ?? window
      const touchTarget = (el as HTMLElement) ?? window

      wheelTarget.addEventListener('wheel', onWheel as EventListener, { passive: false } as any)
      touchTarget.addEventListener('touchstart', onTouchStart as EventListener, { passive: true } as any)
      touchTarget.addEventListener('touchmove', onTouchMove as EventListener, { passive: false } as any)
      window.addEventListener('keydown', onKeyDown as EventListener, { passive: false } as any)

      targetEl = el
    }

    const unbind = () => {
      if (!targetEl) return
      const wheelTarget = (targetEl as HTMLElement) ?? window
      const touchTarget = (targetEl as HTMLElement) ?? window

      wheelTarget.removeEventListener('wheel', onWheel as EventListener)
      touchTarget.removeEventListener('touchstart', onTouchStart as EventListener)
      touchTarget.removeEventListener('touchmove', onTouchMove as EventListener)
      window.removeEventListener('keydown', onKeyDown as EventListener)
      targetEl = null
    }

    const ensureBound = () => {
      const scroller = getScroller()
      if (scroller && targetEl !== scroller) {
        unbind()
        bind(scroller)
        return
      }
      if (!scroller && targetEl !== window) {
        // 초기 로딩 단계: 임시로 window에 바인딩
        unbind()
        bind(window)
      }
      rafId = requestAnimationFrame(ensureBound)
    }

    // 핸들러들은 기존 함수(onWheel/onTouch*/onKeyDown)를 그대로 참조하도록
    const onWheel = (e: WheelEvent) => {
      const band = getActiveBand()
      if (!band) return
      e.preventDefault()
      if (animating.current) return
      const [i, j] = band
      if (e.deltaY > 0) {
        const dur = resolveDuration(i, j, { direction: 'forward', pointer: 'fine', fastSwipe: false })
        animateTo(progressToTop(cuts[j].start), dur)
      } else if (e.deltaY < 0) {
        const p = scrollYProgress.get()
        const a = cuts[i].start
        const prev = i - 1 >= 0 ? i - 1 : null
        const toIdx = prev != null && p - a <= NEAR ? prev : i
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
      const DY_MIN = 1
      if (Math.abs(dy) < DY_MIN) return
      e.preventDefault()
      if (animating.current) return
      const [i, j] = band
      const a = cuts[i].start
      const fastSwipe = Math.abs(dy) > 80
      if (dy > 0) {
        const dur = resolveDuration(i, j, { direction: 'forward', pointer: 'coarse', fastSwipe })
        animateTo(progressToTop(cuts[j].start), dur)
      } else {
        const p = scrollYProgress.get()
        const prev = i - 1 >= 0 ? i - 1 : null
        const toIdx = prev != null && p - a <= NEAR ? prev : i
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
      const a = cuts[i].start
      if (downKeys.includes(e.key)) {
        const dur = resolveDuration(i, j, { direction: 'forward', pointer: 'fine', fastSwipe: false })
        animateTo(progressToTop(cuts[j].start), dur)
      } else {
        const p = scrollYProgress.get()
        const prev = i - 1 >= 0 ? i - 1 : null
        const toIdx = prev != null && p - a <= NEAR ? prev : i
        const target = toIdx === i ? a : cuts[toIdx].start
        const dur = resolveDuration(i, toIdx, { direction: 'backward', pointer: 'fine', fastSwipe: false })
        animateTo(progressToTop(target), dur)
      }
    }

    ensureBound()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      unbind()
      if (snapRaf.current) cancelAnimationFrame(snapRaf.current)
      setOverscroll(false)
    }
    // wrapRef, cuts, scrollYProgress 등 의존성은 동일
  }, [
    wrapRef,
    scrollYProgress,
    cuts,
    DUR,
    NEAR,
    opts?.scrollerRef,
    opts.durationTable,
    opts.getDuration,
    opts.sectionDurations,
  ])
}
