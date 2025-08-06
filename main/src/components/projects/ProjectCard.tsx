'use client'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { SetStateAction, useEffect, useState } from 'react'

interface Project {
  id: string
  title: string
  thumbnail: string
}

interface ProjectCardProps {
  projects: Project[]
  setIndex: React.Dispatch<SetStateAction<number | undefined>>
  index: number | undefined
}

export function ProjectCard({ projects, setIndex, index }: ProjectCardProps) {
  const total = projects.length

  // 확장 & 축소 비율 (퍼센트)
  const expandedDesktop = 69.76
  const collapsedDesktop = (100 - expandedDesktop) / (total - 1)
  const expandedMobile = 47.76
  const collapsedMobile = (100 - expandedMobile) / (total - 1)

  // grid-template 문자열 생성
  const desktopCols = projects.map((_, i) => (index === i ? `${expandedDesktop}%` : `${collapsedDesktop}%`)).join(' ')
  const mobileRows = projects.map((_, i) => (index === i ? `${expandedMobile}%` : `${collapsedMobile}%`)).join(' ')

  return (
    <div
      className={`
        w-full
        h-full

        overflow-hidden relative
        grid
        transition-all
        duration-500 ease-in-out
        justify-between
        /* 모바일: 1열 + 각 행 높이 */
        grid-cols-1
        [grid-template-rows:var(--mobile-rows)]
        md:grid-cols-1
        md:[grid-template-rows:var(--mobile-rows)]

        /* lg 이상: 1행 + 각 열 너비 */
        md-landscape:grid-rows-1
        md-landscape:[grid-template-columns:var(--desktop-cols)]
        lg:grid-rows-1
        lg:[grid-template-columns:var(--desktop-cols)]
      `}
      style={
        {
          '--desktop-cols': desktopCols,
          '--mobile-rows': mobileRows,
        } as React.CSSProperties
      }
    >
      {projects.map((project, i) => {
        const isExpanded = index === i
        const isNextToExpanded = index !== undefined && index + 1 === i
        const isPreviousToExpanded = index !== undefined && index - 1 === i

        const getBorderClasses = () => {
          if (isExpanded) {
            return 'rounded-[5px] border-none'
          }

          let classes = 'border-stone-300'

          // 기본: border-b (모바일에서 bottom border)
          classes += ' border-b'

          // md (태블릿 세로)에서의 처리 - portrait일 때만 적용
          if (isPreviousToExpanded) {
            classes += ' md:max-md-landscape:border-none' // md이면서 landscape가 아닐 때만
          } else {
            classes += ' md:max-md-landscape:border-b md:max-md-landscape:border-t-0 md:max-md-landscape:border-l-0'
          }

          // md-landscape (태블릿 가로)에서의 처리
          if (isNextToExpanded) {
            classes += ' md-landscape:border-none'
          } else {
            classes += ' md-landscape:border-b-0 md-landscape:border-l'
          }

          // lg (데스크톱)에서의 처리
          if (isNextToExpanded) {
            classes += ' lg:border-none'
          } else {
            classes += ' lg:border-b-0 lg:border-l'
          }

          return classes
        }

        return (
          <div
            key={project.id}
            className={`relative h-full cursor-pointer ${getBorderClasses()}`}
            onMouseEnter={() => setIndex(i)}
            onClick={() => setIndex(i)}
          >
            <Link href={`/projects/${project.id}`} aria-label={project.title}>
              <motion.div
                className={`w-full h-full absolute inset-0 origin-center bg-cover bg-center opacity-${isExpanded ? '100' : '0'} transition-all duration-500
              flex-shrink-0 origin-center object-clip `}
              >
                <motion.img src={project?.thumbnail} className={`w-full rounded-[5px]  h-full `} />
              </motion.div>
              <motion.h3
                className={`
              absolute font-semibold whitespace-nowrap transition-all duration-300
              text-2xl lg:text-3xl md:text-xl [writing-mode:horizontal-tb] md:[writing-mode:horizontal-tb] md-landscape:[writing-mode:vertical-rl] lg:[writing-mode:vertical-rl]
              top-auto md-landscape:top-5 
              bottom-[0.5vh] md:bottom-[1vh] md-landscape:bottom-auto
              left-3 md-landscape:left-auto
              right-auto md:right-[0.6vw] md-landscape:right-[0.35vw] lg:right-[0.4vw]
              ${index === i ? 'text-white mr-0' : 'text-zinc-600'}
            `}
              >
                {project.title}
              </motion.h3>
              <motion.button className='block lg:hidden absolute bottom-[0.5vh] md:bottom-[1vh] text-white right-3 z-10 hover:opacity-70 transition-all duration-300'>
                <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' viewBox='0 0 16 15' fill='currentColor'>
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
