// ProjectCard.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState, useLayoutEffect, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { useIsLandscape } from '@/hooks/useIsLandscape'
import { useIsPhone } from '@/hooks/useIsPhone'

type Project = {
  id: string
  title: string
  thumbnail: { pc: string; mobile: string }
}

interface ProjectCardProps {
  projects: Project[]
  index: number
  setIndex: (i: number) => void
}

function useViewportSize() {
  const [size, setSize] = useState({ w: 0, h: 0 })
  
  const updateSize = useCallback(() => {
    const w = Math.round(window.visualViewport?.width ?? window.innerWidth)
    const h = Math.round(window.visualViewport?.height ?? window.innerHeight)
    setSize(prev => {
      // 값이 실제로 변경된 경우에만 상태 업데이트
      if (prev.w !== w || prev.h !== h) {
        return { w, h }
      }
      return prev
    })
  }, [])

  useLayoutEffect(() => {
    updateSize()
    
    const handleResize = () => {
      // orientationchange의 경우 약간의 지연을 두어 정확한 값 확보
      setTimeout(updateSize, 100)
    }

    const handleOrientationChange = () => {
      // 화면 회전 시 더 긴 지연으로 안정적인 값 확보
      setTimeout(updateSize, 300)
    }
    
    window.visualViewport?.addEventListener('resize', updateSize, { passive: true })
    window.addEventListener('resize', updateSize, { passive: true })
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true })
    
    return () => {
      window.visualViewport?.removeEventListener('resize', updateSize as any)
      window.removeEventListener('resize', updateSize as any)
      window.removeEventListener('orientationchange', handleOrientationChange as any)
    }
  }, [updateSize])
  
  return size
}

function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
  const [w, setW] = useState(0)
  
  const updateWidth = useCallback((el: HTMLElement) => {
    const newWidth = Math.round(el.getBoundingClientRect().width)
    setW(prev => prev !== newWidth ? newWidth : prev)
  }, [])
  
  useEffect(() => {
    if (!ref.current) return
    
    const el = ref.current
    updateWidth(el)
    
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect
      if (cr) {
        const newWidth = Math.round(cr.width)
        setW(prev => prev !== newWidth ? newWidth : prev)
      }
    })
    
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, updateWidth])
  
  return w
}

export function ProjectCard({ projects, setIndex, index }: ProjectCardProps) {
  const total = projects.length
  const boxRef = useRef<HTMLDivElement>(null)

  // 모든 Hook을 최상단에 배치
  const { w: vw, h: vh } = useViewportSize()
  const isLandscape = useIsLandscape()
  const isPhone = useIsPhone()
  const W = useElementWidth(boxRef)
  
  // 반응형 조건들을 useMemo로 최적화
  const layoutConfig = useMemo(() => {
    const md = vw >= 768 && vw < 1440
    const isMdLandscape = isLandscape
    const isMdPortrait = !isLandscape
    const isMobile = isPhone || (!md && vw < 768)
    
    return {
      md,
      isMdLandscape,
      isMdPortrait,
      isMobile,
      isRow: !isMobile && !isMdPortrait
    }
  }, [vw, isLandscape, isPhone])

  // 레이아웃 계산을 useMemo로 최적화
  const dimensions = useMemo(() => {
    const MOBILE_COLLAPSED_H = 60
    const MOBILE_EXPANDED_H = 446
    const DESKTOP_MIN_EXP_FRAC = 0.7
    const DESKTOP_COLLAPSED_MIN = 22
    const DESKTOP_COLLAPSED_MAX = 109

    const { isMobile, isMdPortrait, isMdLandscape } = layoutConfig

    const desktopCollapsedW = Math.min(
      DESKTOP_COLLAPSED_MAX,
      Math.max(DESKTOP_COLLAPSED_MIN, (W * (1 - DESKTOP_MIN_EXP_FRAC)) / (total - 1 || 1)),
    )
    const desktopExpandedW = Math.max(W * DESKTOP_MIN_EXP_FRAC, W - desktopCollapsedW * (total - 1))
    const deltaW = desktopExpandedW - desktopCollapsedW

    const collapsedW = desktopCollapsedW
    const expandedW = desktopExpandedW

    const aspectH = (() => {
      if (isMobile) return MOBILE_EXPANDED_H
      if (isMdPortrait) return MOBILE_EXPANDED_H
      const base = isMdLandscape ? 486 / 666 : 690 / 977
      return Math.round(expandedW * base)
    })()

    return {
      collapsedW,
      expandedW,
      deltaW,
      aspectH,
      MOBILE_COLLAPSED_H,
      MOBILE_EXPANDED_H
    }
  }, [W, total, layoutConfig])

  const positions = useMemo(() => {
    const { isRow } = layoutConfig
    const { collapsedW, expandedW, deltaW, aspectH, MOBILE_COLLAPSED_H, MOBILE_EXPANDED_H } = dimensions
    
    return projects.map((_, i) => {
      if (isRow) {
        const left = i * collapsedW + (i > index ? deltaW : 0)
        const width = i === index ? expandedW : collapsedW
        const top = 0
        const height = aspectH
        return { left, top, width, height }
      } else {
        const deltaH = MOBILE_EXPANDED_H - MOBILE_COLLAPSED_H
        const top = i * MOBILE_COLLAPSED_H + (i > index ? deltaH : 0)
        const height = i === index ? MOBILE_EXPANDED_H : MOBILE_COLLAPSED_H
        const left = 0
        const width = W
        return { left, top, width, height }
      }
    })
  }, [projects, layoutConfig, dimensions, index, W])

  const containerStyle = useMemo((): React.CSSProperties => {
    const { isRow } = layoutConfig
    const { aspectH, MOBILE_COLLAPSED_H, MOBILE_EXPANDED_H } = dimensions
    
    return isRow
      ? { position: 'relative', width: W, height: aspectH }
      : {
          position: 'relative',
          width: W,
          height: projects.length * MOBILE_COLLAPSED_H + (MOBILE_EXPANDED_H - MOBILE_COLLAPSED_H),
        }
  }, [layoutConfig, dimensions, W, projects.length])

  const handleTapExpandThenNavigate = useCallback((e: React.MouseEvent, i: number) => {
    const { isMobile, isMdLandscape, isMdPortrait } = layoutConfig
    if (!(isMobile || isMdLandscape || isMdPortrait)) return true
    e.preventDefault()
    if (index === i) window.location.href = `/projects/${projects[i].id}`
    else setIndex(i)
    return false
  }, [layoutConfig, index, projects, setIndex])

  const getBorderClasses = useCallback((isExpanded: boolean) => {
    if (isExpanded) return 'rounded-[5px] border-none'
    let c = 'border-stone-300 border-b'
    c += ' md:border-b md:border-t-0 md:border-l-0'
    c += ' md-landscape-coming:border-b-0 md-landscape-coming:border-l'
    c += ' lg:border-b-0 lg:border-l'
    return c
  }, [])

  const getClipPath = useCallback((isExpanded: boolean, origin: 'left' | 'right') =>
    isExpanded ? 'inset(0 0 0 0)' : origin === 'right' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
  , [])

  // 상수들
  const slide = { type: 'spring', stiffness: 420, damping: 42 }
  const fade = { duration: 0.22, ease: 'easeOut' }
  const { isMdLandscape, isMdPortrait, isMobile, isRow } = layoutConfig
  const { expandedW, aspectH } = dimensions
  const originSide = isRow ? 'right' : 'left'

  // 로딩 상태 처리
  if (W === 0 || vw === 0 || vh === 0) {
    return (
      <div ref={boxRef} className='w-full h-96 flex items-center justify-center'>
        <div className='w-full h-full bg-gray-100 animate-pulse rounded' />
      </div>
    )
  }

  const Wrapper = ({ children, i, href }: { children: React.ReactNode; i: number; href: string }) =>
    isMobile || isMdLandscape || isMdPortrait ? (
      <div
        role='button'
        tabIndex={0}
        className='cursor-pointer w-full h-full block outline-none'
        onClick={(e) => handleTapExpandThenNavigate(e, i)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleTapExpandThenNavigate(e as any, i)
        }}
      >
        {children}
      </div>
    ) : (
      <Link
        href={href}
        className='cursor-pointer w-full h-full block'
        onMouseEnter={() => setIndex(i)}
        onClick={() => setIndex(i)}
      >
        {children}
      </Link>
    )

  return (
    <div ref={boxRef} id='projects-grid' className='w-full' style={{ position: 'relative' }}>
      <div style={containerStyle}>
        {projects.map((project, i) => {
          const isExpanded = index === i
          const p = positions[i]
          const imgW = isRow ? expandedW : W
          const imgH = isRow ? aspectH : dimensions.MOBILE_EXPANDED_H
          return (
            <motion.div
              key={project.id}
              className={classNames('absolute', 'overflow-hidden', getBorderClasses(isExpanded))}
              animate={{ left: p.left, top: p.top, width: p.width, height: p.height }}
              transition={slide}
            >
              <Wrapper i={i} href={`/projects/${project.id}`}>
                <div className='relative w-full h-full overflow-hidden will-change-transform'>
                  <div
                    className={classNames('absolute top-0', originSide === 'right' ? 'right-0' : 'left-0')}
                    style={{ width: imgW, height: imgH }}
                  >
                    <motion.div
                      className='w-full h-full'
                      initial={false}
                      animate={{ clipPath: getClipPath(isExpanded, originSide as 'left' | 'right') }}
                      transition={slide}
                    >
                      <img
                        src={project.thumbnail.pc}
                        alt={project.title}
                        className='block w-full h-full object-cover'
                        loading='lazy'
                        draggable={false}
                      />
                    </motion.div>
                  </div>
                  {(isMobile || isMdLandscape || isMdPortrait) && isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.18, duration: 0.16 }}
                      className='text-[24px] text-white absolute bottom-2 right-2'
                    >
                      →
                    </motion.div>
                  )}
                </div>
                <motion.h3
                  className={classNames(
                    'absolute font-semibold whitespace-nowrap pointer-events-none',
                    'text-2xl md:text-[22px] md-landscape-coming:text-[22px] lg:text-[28px]',
                    isRow ? 'md-landscape-coming:right-0 lg:right-1 top-7 [writing-mode:vertical-rl]' : 'left-3 bottom-3',
                    isExpanded ? 'text-white' : 'text-zinc-[#666666]',
                  )}
                  initial={false}
                  animate={{ opacity: isExpanded ? 1 : 0.75 }}
                  transition={fade}
                >
                  {project.title}
                </motion.h3>
              </Wrapper>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}