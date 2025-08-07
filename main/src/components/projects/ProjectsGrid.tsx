//ProjectGrid.tsx

'use client'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { useState } from 'react'

interface Project {
  id: string
  title: string
  thumbnail: {
    pc: string
    mobile: string
  }
}

export default function ProjectsGrid() {
  const [expandedIndex, setExpandedIndex] = useState<number>(0)

  const projects: Project[] = [
    {
      id: 'cruise',
      title: 'Cruise',
      thumbnail: {
        pc: '/images/projects/test.png',
        mobile: '/images/projects/test-m.png',
      },
    },
    {
      id: 'silmul',
      title: 'Silmul',
      thumbnail: {
        pc: '/images/projects/test.png',
        mobile: '/images/projects/test-m.png',
      },
    },
    {
      id: 'potrik',
      title: 'Potrik',
      thumbnail: {
        pc: '/images/projects/test.png',
        mobile: '/images/projects/test-m.png',
      },
    },
    {
      id: 'newbe',
      title: 'Newbe',
      thumbnail: {
        pc: '/images/projects/test.png',
        mobile: '/images/projects/test-m.png',
      },
    },
    {
      id: 'layon',
      title: 'Lay.On',
      thumbnail: {
        pc: '/images/projects/test.png',
        mobile: '/images/projects/test-m.png',
      },
    },
    {
      id: 'hotcake',
      title: 'Hotcake',
      thumbnail: {
        pc: '/images/projects/test.png',
        mobile: '/images/projects/test-m.png',
      },
    },
    {
      id: 'merlin',
      title: 'Merlin',
      thumbnail: {
        pc: '/images/projects/test.png',
        mobile: '/images/projects/test-m.png',
      },
    },
    {
      id: 'autonomy-practice',
      title: 'Autonomy Practice',
      thumbnail: {
        pc: '/images/projects/test.png',
        mobile: '/images/projects/test-m.png',
      },
    },
    {
      id: 'mizi',
      title: 'Mizi',
      thumbnail: {
        pc: '/images/projects/test.png',
        mobile: '/images/projects/test-m.png',
      },
    },
  ]

  return (
    <>
      <div className='w-full mb-[20px] px-[16px] md:px-[40px] lg:px-[48px] '>
        <ProjectCard projects={projects} index={expandedIndex} setIndex={setExpandedIndex} />
      </div>
    </>
  )
}
