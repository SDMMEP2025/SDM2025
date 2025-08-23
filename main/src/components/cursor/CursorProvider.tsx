'use client'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type CursorVariant = 'base' | 'right' | 'click' | 'drag' | 'down'
type CursorToken = symbol

type CursorCtx = {
  current: CursorVariant
  push: (v: CursorVariant) => CursorToken
  pop: (t: CursorToken) => void
  pos: { x: number; y: number }
}

const Ctx = createContext<CursorCtx | null>(null)
export function useCursor() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useCursor must be used within <CursorProvider>')
  return v
}

type RendererMap = Partial<Record<CursorVariant, (args: { active: boolean }) => React.ReactNode>>

export function CursorProvider({
  children,
  renderers,
  smoothMs = 60,
  disabledOnCoarse = true,
}: {
  children: React.ReactNode
  renderers?: RendererMap
  smoothMs?: number
  disabledOnCoarse?: boolean
}) {
  const [mounted, setMounted] = useState(false)
  const stackRef = useRef<{ token: CursorToken; v: CursorVariant }[]>([])
  const [current, setCurrent] = useState<CursorVariant>('base')
  const pos = useRef({ x: -9999, y: -9999 })
  const elRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(true) // 커서 가시성 상태
  
  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const api = useMemo<CursorCtx>(
    () => ({
      current,
      pos: pos.current,
      push: (v) => {
        const token = Symbol()
        stackRef.current.push({ token, v })
        setCurrent(stackRef.current[stackRef.current.length - 1].v)
        return token
      },
      pop: (token) => {
        const s = stackRef.current
        const i = s.findIndex((x) => x.token === token)
        if (i >= 0) s.splice(i, 1)
        setCurrent(s.length ? s[s.length - 1].v : 'base')
      },
    }),
    [current],
  )

  useEffect(() => setMounted(true), [])

  const isCoarse = typeof window !== 'undefined' ? (window.matchMedia?.('(pointer: coarse)').matches ?? false) : false
  const enabled = !(disabledOnCoarse && isCoarse)

  const isInViewport = (x: number, y: number) => {
    const margin = 10 
    return x >= -margin && x <= window.innerWidth + margin && y >= -margin && y <= window.innerHeight + margin
  }

  useEffect(() => {
    if (!mounted || !enabled) return
    const el = elRef.current
    if (!el) return

    const onMove = (e: PointerEvent | MouseEvent | DragEvent) => {
      const any = e as any
      const x = any.clientX ?? 0
      const y = any.clientY ?? 0
      
      if (typeof x === 'number' && typeof y === 'number') {
        pos.current.x = x
        pos.current.y = y
        
        const inView = isInViewport(x, y)
        setIsVisible(inView)

      }
    }

    const onBodyMouseLeave = () => {
      setIsVisible(false)
    }

    const onBodyMouseEnter = () => {
      setIsVisible(true)
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    const onWindowBlur = () => setIsVisible(false)
    const onWindowFocus = () => setIsVisible(true)

    const preventDragStart = (e: DragEvent) => e.preventDefault()

    let raf = 0
    let cx = pos.current.x
    let cy = pos.current.y
    const step = () => {
      const ease = prefersReduced ? 1 : smoothMs <= 0 ? 1 : Math.min(1, 16 / smoothMs)
      cx += (pos.current.x - cx) * ease
      cy += (pos.current.y - cy) * ease
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(step)
    }

    document.addEventListener('pointermove', onMove as any, { passive: true })
    document.addEventListener('mousemove', onMove as any, { passive: true })
    document.addEventListener('dragover', onMove as any, { passive: true })
    
    document.body.addEventListener('mouseleave', onBodyMouseLeave, { passive: true })
    document.body.addEventListener('mouseenter', onBodyMouseEnter, { passive: true })
    
    document.addEventListener('visibilitychange', onVisibilityChange, { passive: true })
    window.addEventListener('blur', onWindowBlur, { passive: true })
    window.addEventListener('focus', onWindowFocus, { passive: true })
    document.addEventListener('dragstart', preventDragStart)
    document.documentElement.classList.add('cursor-none')

    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('pointermove', onMove as any)
      document.removeEventListener('mousemove', onMove as any)
      document.removeEventListener('dragover', onMove as any)
      document.body.removeEventListener('mouseleave', onBodyMouseLeave)
      document.body.removeEventListener('mouseenter', onBodyMouseEnter)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('blur', onWindowBlur)
      window.removeEventListener('focus', onWindowFocus)
      document.removeEventListener('dragstart', preventDragStart)
      document.documentElement.classList.remove('cursor-none')
    }
  }, [mounted, enabled, smoothMs, prefersReduced])

  const Default = {
    base: () => (
      <div
        className='w-4 h-4 z-[50] rounded-full bg-white mix-blend-difference'
        style={{ transform: 'translate(-50%,-50%)' }}
      />
    ),
    drag: () => (
      <div className='w-14 h-14 z-[50] -translate-x-1/2 -translate-y-1/2 px-3 py-4 bg-white rounded-[30px] inline-flex flex-col justify-center items-center gap-2.5'>
        <div className="text-center justify-start text-black text-base font-medium font-english leading-snug">
          Drag
        </div>
      </div>
    ),
    click: () => (
      <div className='w-14 h-14 z-[50] -translate-x-1/2 -translate-y-1/2 px-3 py-4 bg-white rounded-[30px] inline-flex flex-col justify-center items-center gap-2.5'>
        <div className="text-center justify-start text-black text-base font-medium font-english leading-snug">
          Click
        </div>
      </div>
    ),
    right: () => (
      <div className='w-14 h-14 -translate-x-1/2 -translate-y-1/2 z-[50]'>
        <svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60' fill='none'>
          <g clipPath='url(#clip0_903_2721)'>
            <rect width='60' height='60' rx='30' fill='white' />
            <path
              d='M28.9995 22.2478L31.6225 24.9324C32.9121 26.2523 34.1361 27.4044 35.2946 28.3888C33.7864 28.2545 32.1252 28.1874 30.311 28.1874L18.9995 28.1874L18.9995 31.8452L30.311 31.8451C32.1033 31.8451 33.7645 31.7669 35.2946 31.6103C34.1361 32.617 32.9121 33.7691 31.6225 35.0666L29.0323 37.7512L31.2618 39.9995L40.9995 29.9995L31.229 19.9995L28.9995 22.2478Z'
              fill='black'
            />
          </g>
          <defs>
            <clipPath id='clip0_903_2721'>
              <rect width='60' height='60' rx='30' fill='white' />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
    down: () => (
      <div className='w-14 h-14 z-[50]'>
        <svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60' fill='none'>
          <g clipPath='url(#clip0_903_2713)'>
            <rect width='60' height='60' rx='30' fill='white' />
            <path
              d='M37.7517 30L35.0671 32.623C33.7472 33.9126 32.5951 35.1366 31.6107 36.2951C31.745 34.7869 31.8121 33.1257 31.8121 31.3115L31.8121 20L28.1544 20L28.1544 31.3115C28.1544 33.1038 28.2327 34.765 28.3893 36.2951C27.3825 35.1366 26.2304 33.9126 24.9329 32.623L22.2483 30.0328L20 32.2623L30 42L40 32.2295L37.7517 30Z'
              fill='black'
            />
          </g>
          <defs>
            <clipPath id='clip0_903_2713'>
              <rect width='60' height='60' rx='30' fill='white' />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
  } as RendererMap

  const R = (renderers ?? {}) as RendererMap

  return (
    <Ctx.Provider value={api}>
      {children}
      {mounted &&
        enabled &&
        createPortal(
          <div
            ref={elRef}
            aria-hidden
            data-variant={current}
            className={[
              'fixed top-0 left-0 z-[50] pointer-events-none will-change-transform mix-blend-difference transition-opacity duration-200',
              isVisible ? 'opacity-100' : 'opacity-0'
            ].join(' ')}
          >
            {(R[current] ?? Default[current])!({ active: true })}
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  )
}