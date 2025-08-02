'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Project {
  id: string
  title: string
  thumbnail: string
}

interface ProjectCardProps {
  project: Project
  isExpanded: boolean
  isNextToExpanded: boolean
  isPreviousToExpanded: boolean
  onHover: () => void
}

export default function ProjectCard({
  project,
  isExpanded,
  isNextToExpanded,
  isPreviousToExpanded,
  onHover,
}: ProjectCardProps) {
  const [isLg, setIsLg] = useState(false)

  useEffect(() => {
    const checkIsLg = () => {
      setIsLg(window.innerWidth >= 1440)
    }

    checkIsLg()
    window.addEventListener('resize', checkIsLg)

    return () => window.removeEventListener('resize', checkIsLg)
  }, [])

  const flexValues = isLg
    ? {
        expanded: '1 1 69.76%', // lg (1440px+ 데스크톱) 확장 비율
        collapsed: '1 1 3.78%', // lg (1440px+ 데스크톱) 축소 비율
      }
    : {
        expanded: '1 1 47.76%', // md (768px~1439px 태블릿) 확장 비율
        collapsed: '1 1 6.53%', // md (768px~1439px 태블릿) 축소 비율
      }


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
    <motion.div
      className={`relative overflow-hidden cursor-pointer 
        h-full lg:h-full
        md:h-20 md-landscape:h-full
        ${getBorderClasses()}`}
      onMouseEnter={onHover}
      initial={false}
      animate={{
        flex: isExpanded ? flexValues.expanded : flexValues.collapsed,
        height: isExpanded ? 'auto' : undefined,
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Link href={`/projects/${project.id}`} aria-label={project.title}>
        <div className='relative w-full h-full'>
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${project.thumbnail})`
            }}
          />
          <div
            className={`absolute inset-0 bg-zinc-600 bg-opacity-0 transition-opacity duration-500 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <h3
            className={`absolute font-semibold whitespace-nowrap transition-all duration-300 
              text-2xl lg:text-3xl
              md:text-xl md-landscape:text-xl
              [writing-mode:horizontal-tb] md:[writing-mode:horizontal-tb] lg:[writing-mode:vertical-rl]
              ${
                isExpanded
                  ? 'bottom-[12px] left-[12px] text-white md:bottom-[12px] md:left-[12px] lg:top-[5%] lg:right-[12px] lg:left-auto'
                  : 'top-1/2 -translate-y-1/2 left-[12px] text-zinc-600 md:top-1/2 md:-translate-y-1/2 md:left-[12px] lg:top-[5%] lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0'
              }`}
          >
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  )
}