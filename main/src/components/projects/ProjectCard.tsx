'use client'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { SetStateAction, useEffect, useState } from 'react'

interface Project {
  id: string
  title: string
  thumbnail: {
    pc: string
    mobile: string
  }
}

interface ProjectCardProps {
  projects: Project[]
  setIndex: React.Dispatch<SetStateAction<number | undefined>>
  index: number | undefined
}

export function ProjectCard({ projects, setIndex, index }: ProjectCardProps) {
  const total = projects.length

  const desktopImageRatio = 710 / 977
  const mobileImageRatio = 446 / 358

  const expandedDesktop = 69.76
  const collapsedDesktop = (100 - expandedDesktop) / (total - 1)
  const expandedMobile = 47.76
  const collapsedMobile = (100 - expandedMobile) / (total - 1)

  const desktopCols = projects.map((_, i) => (index === i ? `${expandedDesktop}%` : `${collapsedDesktop}%`)).join(' ')
  const mobileRows = projects.map((_, i) => (index === i ? `${expandedMobile}%` : `${collapsedMobile}%`)).join(' ')

  const collapsedItemHeight = 30
  const collapsedItemHeightTablet = 0 // 타블렛용 높이를 50px로 조정

  const getHeightStyles = () => {
    if (index === undefined) {
      return {
        '--desktop-height': `calc((100vw - 140px) * ${desktopImageRatio} * ${expandedDesktop / 100})`,
        '--mobile-height': `calc((100vh - 32px) * ${mobileImageRatio} * ${expandedMobile / 100} + ${total - 1} * ${collapsedItemHeight}px)`,
        '--tablet-height': `calc((100vh - 80px) * ${mobileImageRatio} * ${expandedMobile / 100} + ${total - 1} * ${collapsedItemHeightTablet}px)`,
      }
    }

    const desktopHeight = `calc((100vw - 160px) * ${expandedDesktop / 100} * ${desktopImageRatio})`

    const expandedMobileHeight = `calc((100vh - 32px) * ${mobileImageRatio})`
    const collapsedItemsHeight = `calc(${total - 1} * ${collapsedItemHeight}px)`
    const mobileHeight = `calc(${expandedMobileHeight} + ${collapsedItemsHeight})`
    
    // 타블렛 높이 계산 수정 - 80px 패딩과 더 큰 collapsed 높이 적용
    const expandedTabletHeight = `calc((100vh - 80px) * ${mobileImageRatio})`
    const collapsedItemsHeightTablet = `calc(${total - 1} * ${collapsedItemHeightTablet}px)`
    const tabletHeight = `calc(${expandedTabletHeight} + ${collapsedItemsHeightTablet})`

    return {
      '--desktop-height': desktopHeight,
      '--mobile-height': mobileHeight,
      '--tablet-height': tabletHeight,
    }
  }

  return (
    <div
      className={`
        w-full
        overflow-hidden relative
        grid
        transition-all
        duration-500 ease-in-out
        justify-between
        grid-cols-1
        [grid-template-rows:var(--mobile-rows)]
        h-[var(--mobile-height)]
        
        md:grid-cols-1
        md:[grid-template-rows:var(--mobile-rows)]
        md:h-[var(--tablet-height)]

        md-landscape:grid-rows-1
        md-landscape:[grid-template-columns:var(--desktop-cols)]
        md-landscape:h-[var(--desktop-height)]
        lg:grid-rows-1
        lg:[grid-template-columns:var(--desktop-cols)]
        lg:h-[var(--desktop-height)]
      `}
      style={
        {
          '--desktop-cols': desktopCols,
          '--mobile-rows': mobileRows,
          ...getHeightStyles(),
        } as React.CSSProperties
      }
    >
      {projects.map((project, i) => {
        const isExpanded = index === i
        const isNextToExpanded = index !== undefined && index + 1 === i
        const isPreviousToExpanded = index !== undefined && index - 1 === i

        const collapsedItemHeightMobile = 30
        const collapsedItemHeightTablet = 50 // 타블렛에서 50px 높이

        const getBorderClasses = () => {
          if (isExpanded) {
            return 'rounded-[5px] border-none'
          }

          let classes = 'border-stone-300'

          classes += ' border-b'

          if (isPreviousToExpanded) {
            classes += ' md:max-md-landscape:border-none'
          } else {
            classes += ' md:max-md-landscape:border-b md:max-md-landscape:border-t-0 md:max-md-landscape:border-l-0'
          }

          if (isNextToExpanded) {
            classes += ' md-landscape:border-none lg:border-none'
          } else {
            classes += ' md-landscape:border-b-0 md-landscape:border-l lg:border-b-0 lg:border-l'
          }

          return classes
        }

        const getItemHeightClass = () => {
          if (isExpanded) {
            return `
              h-full
              md:h-full
              md-landscape:h-full
              lg:h-full
            `
          } else {
            return `
              h-[${collapsedItemHeightMobile}px]
              md:h-[${collapsedItemHeightTablet}px]
              md-landscape:h-full
              lg:h-full
            `
          }
        }

        return (
          <div
            key={project.id}
            className={`relative cursor-pointer ${getBorderClasses()} ${getItemHeightClass()}`}
            onMouseEnter={() => setIndex(i)}
            onClick={() => setIndex(i)}
          >
            <Link href={`/projects/${project.id}`} aria-label={project.title}>
              <motion.div
                className={`w-full h-full absolute origin-center bg-cover bg-center opacity-${isExpanded ? '100' : '0'} transition-all duration-500
              flex-shrink-0 origin-center object-clip `}
              >
                <motion.img
                  src={project?.thumbnail.mobile}
                  className={`w-full rounded-[5px] h-full object-cover block md:hidden`}
                />
                <motion.img
                  src={project?.thumbnail.pc}
                  className={`w-full rounded-[5px] h-full object-cover hidden md:block`}
                />
              </motion.div>
              <motion.h3
                className={`
              absolute font-semibold whitespace-nowrap transition-all duration-300
              text-2xl lg:text-3xl md:text-[22px] [writing-mode:horizontal-tb] md:[writing-mode:horizontal-tb] md-landscape:[writing-mode:vertical-rl] lg:[writing-mode:vertical-rl]
              ${isExpanded 
                ? 'top-5 md:top-3 md-landscape:top-5 lg:top-5' 
                : 'top-5 md:top-3 md-landscape:top-5 lg:top-5'
              }
              bottom-auto
              left-3 md-landscape:left-auto
              right-auto md:right-[0.6vw] md-landscape:right-[0.35vw] lg:right-[0.4vw]
              ${index === i ? 'text-white mr-0' : 'text-zinc-600'}
            `}
              >
                {project.title}
              </motion.h3>
              <motion.button className='block lg:hidden absolute bottom-[2vh] md:bottom-[2vh] text-white right-3 z-10 hover:opacity-70 transition-all duration-300'>
                <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' viewBox='0 0 16 15' fill='currentColor'>
                  <path d='M9.30741 14.4639L7.78994 12.8917L9.58033 11.0098C9.9879 10.5814 10.3991 10.1682 10.814 9.77042C11.2361 9.36496 11.5527 9.0666 11.7637 8.87534L12.0803 8.58846C11.1124 8.68791 9.98063 8.73764 8.68514 8.73764H0.966797L0.966797 6.16715H8.68514C9.2601 6.16715 9.83143 6.18245 10.3991 6.21305C10.9668 6.24365 11.3889 6.27425 11.6655 6.30485L12.0803 6.33928C11.338 5.68135 10.5046 4.87425 9.58033 3.91797L7.81178 2.036L9.32924 0.463867L15.9668 7.46387L9.30741 14.4639Z' />
                </svg>
              </motion.button>
            </Link>
          </div>
        )
      })}
    </div>
  )
}