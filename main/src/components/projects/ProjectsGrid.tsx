'use client'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { useState } from 'react'

interface Project {
  id: string
  title: string
  thumbnail: string
}

export default function ProjectsGrid() {
  const [expandedIndex, setExpandedIndex] = useState<number>(0)

  const projects: Project[] = [
    {
      id: 'cruise',
      title: 'Cruise',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: 'silmul',
      title: 'Silmul',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: 'potrik',
      title: 'Potrik',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: 'newbe',
      title: 'Newbe',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: 'layon',
      title: 'Lay.On',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: 'hotcake',
      title: 'Hotcake',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: 'merlin',
      title: 'Merlin',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: 'autonomy-practice',
      title: 'Autonomy Practice',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: 'mizi',
      title: 'Mizi',
      thumbnail: '/images/projects/test.png',
    },
  ]

  return (
    <>
      <div className='w-full flex-1 min-h-0 px-[16px] md:px-[40px] lg:px-[48px] relative'>
        <ProjectCard projects={projects} index={expandedIndex} setIndex={setExpandedIndex} />
      </div>
    </>
  )
}
