'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import NextImage from 'next/image'

const IMAGES = [
  '/images/about/group/1.jpg',
  '/images/about/group/2.jpg',
  '/images/about/group/3.jpg',
  '/images/about/group/4.jpg',
  '/images/about/group/5.jpg',
  '/images/about/group/6.jpg',
  '/images/about/group/7.jpg',
  '/images/about/group/8.jpg',
  '/images/about/group/9.jpg',
]

export function CursorPlay() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // ===== params =====
  const CURSOR_SIZE = 168
  const HALF = CURSOR_SIZE / 2
  const STEP_PX = 40
  const GHOST_EVERY_PX = 100
  const GHOST_FADE_MS = 1000
  const GHOST_MAX = 10

  // ===== refs =====
  const posRef = useRef({ x: 0, y: 0 })
  const smoothRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const travelAccumRef = useRef(0)
  const ghostAccumRef = useRef(0)

  const ghostPoolRef = useRef<HTMLDivElement[]>([])
  const ghostIdxRef = useRef(0)
  const poolReadyRef = useRef(false)

  // preload (브라우저 네이티브 Image)
  useEffect(() => {
    IMAGES.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

  // keyframes (한 번)
  useEffect(() => {
    const id = 'cursor-ghost-fade-style'
    if (!document.getElementById(id)) {
      const style = document.createElement('style')
      style.id = id
      style.textContent = `
        @keyframes ghostFade {
          0%   { opacity: 1;}
          80% { opacity: 0.9;  }
          100% { opacity: 0;}
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const ensurePool = useCallback(() => {
    if (poolReadyRef.current) return
    const wrap = wrapRef.current
    if (!wrap) return
    const pool: HTMLDivElement[] = []
    for (let i = 0; i < GHOST_MAX; i++) {
      const wrapper = document.createElement('div')
      wrapper.className = 'pointer-events-none absolute'
      wrapper.style.left = '0px'
      wrapper.style.top = '0px'
      wrapper.style.willChange = 'transform'
      wrapper.style.zIndex = '45'

      const inner = document.createElement('div')
      inner.className = 'overflow-hidden rounded-[2px] w-[60%]'
      inner.style.opacity = '0'
      inner.style.willChange = 'opacity, transform'

      const img = document.createElement('img')
      img.style.width = '100%'
      img.style.height = 'auto'
      img.style.aspectRatio = 'auto'
      img.decoding = 'async'
      img.loading = 'eager'
      inner.appendChild(img)
      wrapper.appendChild(inner)
      wrap.appendChild(wrapper)
      pool.push(wrapper)
    }
    ghostPoolRef.current = pool
    poolReadyRef.current = true
  }, [CURSOR_SIZE, GHOST_MAX])

  // 마운트 시 한 번 시도 (StrictMode 2회 대비 OK)
  useEffect(() => {
    ensurePool()
  }, [ensurePool])

  // 반드시 존재하게: 못 만들었으면 리턴, 비어있으면 즉시 만들기
  const spawnGhost = useCallback(
    (x: number, y: number, imgSrc: string) => {
      if (!poolReadyRef.current) {
        ensurePool()
        if (!poolReadyRef.current) return
      }
      const pool = ghostPoolRef.current
      if (pool.length === 0) return

      const i = ghostIdxRef.current
      ghostIdxRef.current = (i + 1) % pool.length

      const wrapper = pool[i]

      // 안전가드: inner/img가 없으면 즉석 생성
      let inner = wrapper.firstElementChild as HTMLDivElement | null
      if (!inner) {
        inner = document.createElement('div')
        inner.className = 'overflow-hidden'
        inner.style.opacity = '0'
        inner.style.willChange = 'opacity, transform'
        wrapper.appendChild(inner)
      }
      let img = inner.firstElementChild as HTMLImageElement | null
      if (!img) {
        img = document.createElement('img')
        img.style.height = 'auto'
        img.style.aspectRatio = 'auto'
        img.decoding = 'async'
        img.loading = 'eager'
        inner.appendChild(img)
      }

      img.src = imgSrc

      // 위치 고정: wrapper(translate만)
      const gx = x - HALF
      const gy = y - HALF
      wrapper.style.transform = `translate(${gx}px, ${gy}px)`

      // 애니메이션: inner(opacity/scale만)
      inner.style.animation = 'none'
      // reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      inner.offsetHeight
      inner.style.animation = `ghostFade ${GHOST_FADE_MS}ms ease forwards`
    },
    [HALF, GHOST_FADE_MS, CURSOR_SIZE, ensurePool],
  )

  // 커서 미리보기 부드럽게
  const loop = useCallback(() => {
    const lerp = 0.2
    smoothRef.current.x += (posRef.current.x - smoothRef.current.x) * lerp
    smoothRef.current.y += (posRef.current.y - smoothRef.current.y) * lerp
    const el = cursorRef.current
    if (el) {
      el.style.transform = `translate(${smoothRef.current.x - HALF}px, ${smoothRef.current.y - HALF}px)`
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [HALF])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loop])

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    posRef.current.x = x
    posRef.current.y = y

    const last = lastPosRef.current
    if (last) {
      const dx = x - last.x
      const dy = y - last.y
      const dist = Math.hypot(dx, dy)

      travelAccumRef.current += dist
      if (travelAccumRef.current >= STEP_PX) {
        const steps = Math.floor(travelAccumRef.current / STEP_PX)
        setActiveIndex((p) => (p + steps) % IMAGES.length)
        travelAccumRef.current %= STEP_PX
      }

      ghostAccumRef.current += dist
      if (ghostAccumRef.current >= GHOST_EVERY_PX) {
        spawnGhost(x, y, IMAGES[activeIndex])
        ghostAccumRef.current = 0
      }
    }
    lastPosRef.current = { x, y }
  }

  const onEnter = () => {
    ensurePool()
    setVisible(true)
  }
  const onLeave = () => {
    setVisible(false)
    lastPosRef.current = null
    travelAccumRef.current = 0
    ghostAccumRef.current = 0
  }

  return (
    <section
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      className='relative w-full h-[100dvh] overflow-hidden bg-[#FAFAFA]'
    >
      <div className='absolute flex flex-col w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center select-none'>
        <h1 className='text-[9.86vw] leading-none text-center font-semibold font-english text-[#E1E1E1]'>
          Steady movement<br/>makes us<br/> New Formative
        </h1>
      </div>
      <div
        ref={cursorRef}
        className={`pointer-events-none absolute z-50 overflow-hidden transition-opacity ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: 0,
          top: 0,
          willChange: 'transform, opacity',
        }}
        aria-hidden
      >
        <NextImage
          key={activeIndex}
          src={IMAGES[activeIndex]}
          alt='cursor-preview'
          fill
          className='object-cover'
          priority
        />
      </div>
    </section>
  )
}
