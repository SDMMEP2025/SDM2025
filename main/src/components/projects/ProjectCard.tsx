// ProjectCard.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

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

export function ProjectCard({ projects, setIndex, index }: ProjectCardProps) {
  const total = projects.length
  const boxRef = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(0)
  const [isClient, setIsClient] = useState(false)

  const [isMobile, setIsMobile] = useState(false)
  const [isMdLandscape, setIsMdLandscape] = useState(false)
  const [isMdPortrait, setIsMdPortrait] = useState(false)  
  const MOBILE_COLLAPSED_H = 60
  const MOBILE_EXPANDED_H = 446

  const DESKTOP_MIN_EXP_FRAC = 0.7
  const DESKTOP_COLLAPSED_MIN = 22
  const DESKTOP_COLLAPSED_MAX = 109

  const slide = { type: 'spring', stiffness: 420, damping: 42 }
  const fade = { duration: 0.22, ease: 'easeOut' }

  useEffect(() => {
    setIsClient(true)
    const onR = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const md = w >= 768 && w < 1440
      setIsMobile(w < 768)
      setIsMdLandscape(md && w > h)
      setIsMdPortrait(md && w <= h)
    }
    onR()
    window.addEventListener('resize', onR)
    return () => window.removeEventListener('resize', onR)
  }, [])

  // 컨테이너 폭 측정
  useEffect(() => {
    const update = () => {
      if (!boxRef.current) return
      setW(boxRef.current.getBoundingClientRect().width)
    }
    update()
    window.addEventListener('resize', update)
    const t = setTimeout(update, 80)
    return () => {
      window.removeEventListener('resize', update)
      clearTimeout(t)
    }
  }, [])

  const handleTapExpandThenNavigate = (e: React.MouseEvent, i: number) => {
    if (!(isMobile || isMdLandscape || isMdPortrait)) return true
    e.preventDefault()
    if (index === i) window.location.href = `/projects/${projects[i].id}`
    else setIndex(i)
    return false
  }

  if (!isClient || W === 0) {
    return (
      <div ref={boxRef} className='w-full h-96 flex items-center justify-center'>
        <div className='w-full h-full bg-gray-100 animate-pulse rounded' />
      </div>
    )
  }

  const desktopCollapsedW = Math.min(
    DESKTOP_COLLAPSED_MAX,
    Math.max(DESKTOP_COLLAPSED_MIN, (W * (1 - DESKTOP_MIN_EXP_FRAC)) / (total - 1 || 1)),
  )
  const desktopExpandedW = Math.max(W * DESKTOP_MIN_EXP_FRAC, W - desktopCollapsedW * (total - 1))
  const deltaW = desktopExpandedW - desktopCollapsedW

  const isRow = !isMobile && !isMdPortrait
  const collapsedW = desktopCollapsedW
  const expandedW = desktopExpandedW

  const aspectH = (() => {
    if (isMobile) return MOBILE_EXPANDED_H
    if (isMdPortrait) return MOBILE_EXPANDED_H
    const base = isMdLandscape ? 486 / 666 : 690 / 977
    return Math.round(expandedW * base)
  })()

  const positions = projects.map((_, i) => {
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

  const containerStyle: React.CSSProperties = isRow
    ? { position: 'relative', width: W, height: aspectH }
    : {
        position: 'relative',
        width: W,
        height: projects.length * MOBILE_COLLAPSED_H + (MOBILE_EXPANDED_H - MOBILE_COLLAPSED_H),
      }

  const getBorderClasses = (isExpanded: boolean) => {
    if (isExpanded) return 'rounded-[5px] border-none'
    let c = 'border-stone-300 border-b'
    c += ' md:border-b md:border-t-0 md:border-l-0'
    c += ' md-landscape-coming:border-b-0 md-landscape-coming:border-l'
    c += ' lg:border-b-0 lg:border-l'
    return c
  }

  const originSide = isRow ? 'right' : 'left'
  function getClipPath(isExpanded: boolean, originSide: 'left' | 'right') {
    if (isExpanded) return 'inset(0 0 0 0)'
    return originSide === 'right' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
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
          const imgH = isRow ? aspectH : MOBILE_EXPANDED_H

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
                      animate={{ clipPath: getClipPath(isExpanded, originSide) }}
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

                  {/* (선택) 약한 페이드 톤 */}
                  
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

                {/* 타이틀 */}
                <motion.h3
                  className={classNames(
                    'absolute font-semibold whitespace-nowrap pointer-events-none',
                    'text-2xl md:text-[22px] md-landscape-coming:text-[22px] lg:text-[28px] ',
                    isRow ? 'md-landscape-coming:right-0 lg:right-1 top-5 [writing-mode:vertical-rl]' : 'left-3 bottom-3',
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
