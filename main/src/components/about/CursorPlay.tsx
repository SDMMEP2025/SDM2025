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
  '/images/about/group/10.jpg',
  '/images/about/group/11.jpg',
  '/images/about/group/12.jpg',
  '/images/about/group/13.jpg',
  '/images/about/group/14.jpg',
  '/images/about/group/15.jpg',
  '/images/about/group/16.jpg',
  '/images/about/group/17.jpg',
  '/images/about/group/18.jpg',
  '/images/about/group/19.jpg',
  '/images/about/group/20.jpg',
]

export function CursorPlay() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [inView, setInView] = useState(false)

  // 고스트/커서 공통 표시 비율(래퍼 너비 대비)
  const GHOST_WIDTH_RATIO = 0.15
  const STEP_PX = 100
  const GHOST_EVERY_PX = 100
  const GHOST_FADE_MS = 1000
  const GHOST_MAX = 10

  // 이미지 메타(원본 크기 및 비율)
  const metasRef = useRef<{ w: number; h: number; ar: number }[]>(
    Array(IMAGES.length).fill({ w: 0, h: 0, ar: 1 }),
  )
  // 커서 크기(현재 이미지 기준으로 계산한 표시 크기)
  const cursorSizeRef = useRef<{ w: number; h: number }>({ w: 1, h: 1 })

  // 위치/애니메이션 상태
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

  // 이미지 프리로드 + natural size 저장
  useEffect(() => {
    IMAGES.forEach((src, i) => {
      const img = new window.Image()
      img.decoding = 'async'
      img.onload = () => {
        const w = img.naturalWidth || 1
        const h = img.naturalHeight || 1
        metasRef.current[i] = { w, h, ar: w / h }
        // activeIndex의 메타가 갱신되면 커서 크기도 갱신
        if (i === activeIndex) updateCursorSize()
      }
      img.src = src
    })
  }, []) // 한번만

  // ghost 페이드 키프레임 주입
  useEffect(() => {
    const id = 'cursor-ghost-fade-style'
    if (!document.getElementById(id)) {
      const style = document.createElement('style')
      style.id = id
      style.textContent = `
        @keyframes ghostFade {
          0%   { opacity: 1; }
          80%  { opacity: 0.9; }
          100% { opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  // 래퍼 기준 표시 크기 계산: width = 래퍼폭 * ratio, height = width / aspect
  const getDisplaySize = useCallback(
    (index: number): { w: number; h: number } => {
      const wrap = wrapRef.current
      if (!wrap) return { w: 1, h: 1 }
      const rect = wrap.getBoundingClientRect()
      const meta = metasRef.current[index] || { ar: 1 }
      const dispW = Math.max(1, rect.width * GHOST_WIDTH_RATIO)
      const dispH = Math.max(1, dispW / (meta.ar || 1))
      return { w: dispW, h: dispH }
    },
    [GHOST_WIDTH_RATIO],
  )

  // 커서 컨테이너 크기 갱신
  const updateCursorSize = useCallback(() => {
    const { w, h } = getDisplaySize(activeIndex)
    cursorSizeRef.current = { w, h }
    const el = cursorRef.current
    if (el) {
      el.style.width = `${w}px`
      el.style.height = `${h}px`
    }
  }, [activeIndex, getDisplaySize])

  // ResizeObserver로 래퍼 폭 변하면 커서 크기 갱신
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(() => {
      updateCursorSize()
    })
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [updateCursorSize])

  // 고스트 풀 생성(크기는 스폰 시 이미지별로 설정)
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
      inner.className = 'overflow-hidden rounded-[2px]'
      inner.style.width = '100%'
      inner.style.height = '100%'
      inner.style.opacity = '0'
      inner.style.willChange = 'opacity, transform'

      const img = document.createElement('img')
      img.style.width = '100%'
      img.style.height = '100%'
      img.style.objectFit = 'cover'
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
  }, [GHOST_MAX])

  useEffect(() => {
    ensurePool()
  }, [ensurePool])

  // 섹션 inView 감시 + 초기화
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
            updateCursorSize()
          }
        }
      },
      { threshold: 0.3 },
    )

    if (wrapRef.current) observer.observe(wrapRef.current)
    return () => observer.disconnect()
  }, [updateCursorSize])

  // 고스트 스폰(이미지별 표시 크기로 wrapper 크기 지정)
  const spawnGhost = useCallback(
    (x: number, y: number, imgSrc: string, index: number) => {
      if (!poolReadyRef.current) {
        ensurePool()
        if (!poolReadyRef.current) return
      }
      const pool = ghostPoolRef.current
      if (pool.length === 0) return

      const i = ghostIdxRef.current
      ghostIdxRef.current = (i + 1) % pool.length

      const wrapper = pool[i]
      const inner = (wrapper.firstElementChild as HTMLDivElement)!
      const img = (inner.firstElementChild as HTMLImageElement)!

      const { w, h } = getDisplaySize(index)
      wrapper.style.width = `${w}px`
      wrapper.style.height = `${h}px`

      img.src = imgSrc

      const gx = x - w / 2
      const gy = y - h / 2
      wrapper.style.transform = `translate(${gx}px, ${gy}px)`

      inner.style.animation = 'none'
      // reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      inner.offsetHeight
      inner.style.animation = `ghostFade ${GHOST_FADE_MS}ms ease forwards`
    },
    [ensurePool, getDisplaySize, GHOST_FADE_MS],
  )

  // 커서 따라다니는 루프(현재 커서 크기 기준 중앙 보정)
  const loop = useCallback(() => {
    const lerp = 0.2
    smoothRef.current.x += (posRef.current.x - smoothRef.current.x) * lerp
    smoothRef.current.y += (posRef.current.y - smoothRef.current.y) * lerp
    const el = cursorRef.current
    if (el) {
      const { w, h } = cursorSizeRef.current
      el.style.transform = `translate(${smoothRef.current.x - w / 2}px, ${smoothRef.current.y - h / 2}px)`
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loop])

  // 래퍼 내부 마우스 좌표 업데이트
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
        setActiveIndex((p) => {
          const next = (p + steps) % IMAGES.length
          // 인덱스 바뀌면 커서 크기 재계산
          queueMicrotask(updateCursorSize)
          return next
        })
        travelAccumRef.current %= STEP_PX
      }

      ghostAccumRef.current += dist
      if (ghostAccumRef.current >= GHOST_EVERY_PX) {
        spawnGhost(x, y, IMAGES[activeIndex], activeIndex)
        ghostAccumRef.current = 0
      }
    }
    lastPosRef.current = { x, y }
  }

  // 뷰 밖에서도 자연스럽게 좌표 갱신
  const handleMousePosition = useCallback(
    (e: MouseEvent) => {
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
          updateCursorSize()
        }
      }
    },
    [visible, updateCursorSize],
  )

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
      updateCursorSize()
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
          Steady movement
          <br />
          makes us
          <br /> New Formative
        </h1>
      </div>

      {/* 커서 프리뷰: 현재 이미지의 표시 크기로 동기화 */}
      <div
        ref={cursorRef}
        className={`pointer-events-none absolute z-50 overflow-hidden transition-opacity duration-200 ${
          visible && inView ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: 0,
          top: 0,
          // width/height는 updateCursorSize()가 주입
          transform: `translate(-50%,-50%)`, // 초기값; 루프에서 정확 좌표로 덮어씀
          willChange: 'transform, opacity, width, height',
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
