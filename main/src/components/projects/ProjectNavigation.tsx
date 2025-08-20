'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

interface Project {
  id: string
  title: string
  imageUrl: string
  englishName: string
  koreanName: string
  linkUrl: string
}

interface ProjectNavigationProps {
  leftProject?: Project
  rightProject?: Project
}

export function ProjectNavigation({
  leftProject = {
    id: '1',
    title: 'Project 1',
    imageUrl: '/images/previous_image.png',
    englishName: 'MEET',
    koreanName: '미트',
    linkUrl: '/projects/meet',
  },
  rightProject = {
    id: '2',
    title: 'Project 2',
    imageUrl: '/images/next_image.png',
    englishName: 'CONNECT',
    koreanName: '연결',
    linkUrl: '/projects/connect',
  },
}: ProjectNavigationProps) {
  const [isHovered, setIsHovered] = useState({
    left: false,
    right: false,
  })

  return (
    <div className='w-full flex flex-row justify-center items-center'>
      <Link
        href={leftProject.linkUrl}
        className='relative w-full aspect-[720/400] cursor-pointer group overflow-hidden'
      >
        <img
          className='object-cover w-full h-full scale-100 group-hover:scale-110 transition-all duration-300'
          src={leftProject.imageUrl}
          alt={leftProject.title}
        />
        {/* Hover overlay */}
        <div className='w-full h-full left-0 top-0 absolute bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center'>
          <div className='w-20 flex-col justify-center items-center hidden lg:flex'>
            <div className='text-center whitespace-nowrap justify-start text-white text-3xl font-bold leading-10'>
              {leftProject.englishName}
            </div>
            <div className='text-center whitespace-nowrap justify-start text-white text-lg font-bold leading-relaxed'>
              {leftProject.koreanName}
            </div>
          </div>
        </div>
      </Link>

      <Link
        href={rightProject.linkUrl}
        className='relative w-full aspect-[720/400] cursor-pointer group overflow-hidden'
      >
        <img
          className='object-cover w-full h-full scale-100 group-hover:scale-110 transition-all duration-300'
          src={rightProject.imageUrl}
          alt={rightProject.title}
        />
        {/* Hover overlay */}
        <div className='w-full h-full left-0 top-0 absolute bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center'>
          <div className='w-20 flex-col justify-center items-center hidden lg:flex'>
            <div className='text-center whitespace-nowrap justify-start text-white text-3xl font-bold leading-10'>
              {rightProject.englishName}
            </div>
            <div className='text-center whitespace-nowrap justify-start text-white text-lg font-bold leading-relaxed'>
              {rightProject.koreanName}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
