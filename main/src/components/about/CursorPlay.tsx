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
  const [inView, setInView] = useState(false)
  const CURSOR_SIZE = 168
  const HALF = CURSOR_SIZE / 2
  const STEP_PX = 80
  const GHOST_EVERY_PX = 100
  const GHOST_FADE_MS = 1000
  const GHOST_MAX = 10
  const posRef = useRef({ x: 0, y: 0 })
  const smoothRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const travelAccumRef = useRef(0)
  const ghostAccumRef = useRef(0)
  const ghostPoolRef = useRef<HTMLDivElement[]>([])
  const ghostIdxRef = useRef(0)
  const poolReadyRef = useRef(false)

  const isInitializedRef = useRef(false)

  useEffect(() => {
    IMAGES.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

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

  useEffect(() => {
    ensurePool()
  }, [ensurePool])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && !isInitializedRef.current) {
          const rect = wrapRef.current?.getBoundingClientRect()
          if (rect) {
            const x = rect.width / 2
            const y = rect.height / 2
            posRef.current.x = x
            posRef.current.y = y
            smoothRef.current.x = x
            smoothRef.current.y = y
            lastPosRef.current = { x, y }
            isInitializedRef.current = true
            setVisible(true)
          }
        }
      },
      { threshold: 0.3 }
    )
    
    if (wrapRef.current) {
      observer.observe(wrapRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

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

      const gx = x - HALF
      const gy = y - HALF
      wrapper.style.transform = `translate(${gx}px, ${gy}px)`

      inner.style.animation = 'none'
      inner.offsetHeight
      inner.style.animation = `ghostFade ${GHOST_FADE_MS}ms ease forwards`
    },
    [HALF, GHOST_FADE_MS, CURSOR_SIZE, ensurePool],
  )

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

  const handleMousePosition = useCallback((e: MouseEvent) => {
    if (!wrapRef.current || !visible) return
    const rect = wrapRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      posRef.current.x = x
      posRef.current.y = y
      if (!isInitializedRef.current) {
        smoothRef.current.x = x
        smoothRef.current.y = y
        lastPosRef.current = { x, y }
        isInitializedRef.current = true
      }
    }
  }, [visible])

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousemove', handleMousePosition)
      return () => document.removeEventListener('mousemove', handleMousePosition)
    }
  }, [visible, handleMousePosition])

  const onEnter: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!inView) return
    const rect = wrapRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      posRef.current.x = x
      posRef.current.y = y
      lastPosRef.current = { x, y }
    }
  }

  const onLeave = () => {
    if (inView) {
      const rect = wrapRef.current?.getBoundingClientRect()
      if (rect) {
        const x = rect.width / 2
        const y = rect.height / 2
        posRef.current.x = x
        posRef.current.y = y
        lastPosRef.current = { x, y }
      }
    } else {
      setVisible(false)
      isInitializedRef.current = false
    }
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
        className={`pointer-events-none absolute z-50 overflow-hidden transition-opacity duration-200 ${
          visible && inView ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: 0,
          top: 0,
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          transform: `translate(-${HALF}px, -${HALF}px)`,
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