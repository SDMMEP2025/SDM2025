'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Project {
  id: string
  title: string
  thumbnail: string
}

interface ProjectCardProps {
  project: Project
  isExpanded: boolean
  isNextToExpanded: boolean
  onHover: () => void
}

export default function ProjectCard({ project, isExpanded, isNextToExpanded, onHover }: ProjectCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden cursor-pointer 
        h-full lg:h-full
        md:h-20 md:landscape:h-full
        ${
          isExpanded 
            ? 'rounded-[5px] border-none' 
            : isNextToExpanded 
              ? 'border-none' 
              : 'border-b md:border-b-0 md:border-t md:landscape:border-t-0 md:landscape:border-l lg:border-t-0 lg:border-l border-stone-300'
        }`}
      onMouseEnter={onHover}
      initial={false}
      animate={{ 
        flex: isExpanded 
          ? '1 1 69.76%' 
          : '1 1 3.78%',
        height: isExpanded 
          ? 'auto'
          : undefined
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <Link href={`/projects/${project.id}`} aria-label={project.title}>
        <div className='relative w-full h-full'>
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${project.thumbnail})`,
              filter: 'brightness(0.8)',
            }}
          />
          <div
            className={`absolute inset-0 bg-zinc-600 bg-opacity-20 transition-opacity duration-500 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <h3
            className={`absolute font-semibold whitespace-nowrap transition-all duration-300 
              text-3xl lg:text-3xl
              md:text-lg md:landscape:text-3xl
              [writing-mode:horizontal-tb] md:[writing-mode:horizontal-tb] lg:[writing-mode:vertical-rl]
              ${
                isExpanded
                  ? 'top-1/2 -translate-y-1/2 left-[12px] text-white md:top-1/2 md:-translate-y-1/2 md:left-[12px] md:landscape:top-[5%] md:landscape:right-[12px] md:landscape:left-auto md:landscape:translate-y-0 lg:top-[5%] lg:right-[12px] lg:left-auto lg:translate-y-0'
                  : 'top-1/2 -translate-y-1/2 left-[12px] text-zinc-600 md:top-1/2 md:-translate-y-1/2 md:left-[12px] md:landscape:top-[5%] md:landscape:left-1/2 md:landscape:-translate-x-1/2 md:landscape:translate-y-0 lg:top-[5%] lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0'
              }`}
          >
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  )
}

