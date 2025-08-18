'use client'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { useState } from 'react'
import { Header, Footer2 } from '@/components/projects'


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
      thumbnail: { pc: '/images/projects/cruise/cruise1_thumbnail_1.jpg', mobile: '/images/projects/cruise/cruise1_thumbnail_2.jpg' },
    },
    {
      id: 'silmul',
      title: 'Silmul',
      thumbnail: { pc: '/images/projects/silmul/silmul_thumbnail_1.jpg', mobile: '/images/projects/silmul/silmul_thumbnail_2.jpg' },
    },
    {
      id: 'potrik',
      title: 'Potrik',
      thumbnail: { pc: '/images/projects/potrik/potrik_thumbnail_1.jpg', mobile: '/images/projects/potrik/potrik_thumbnail_2.jpg' },
    },
    {
      id: 'newbe',
      title: 'Newbe',
      thumbnail: { pc: '/images/projects/newbe/newbe_thumbnail_1.jpg', mobile: '/images/projects/newbe/newbe_thumbnail_2.jpg' },
    },
    {
      id: 'layon',
      title: 'Lay.On',
      thumbnail: { pc: '/images/projects/layon/layon_thumbnail_1.jpg', mobile: '/images/projects/layon/layon_thumbnail_2.jpg' },
    },
    {
      id: 'hotcake',
      title: 'Hotcake',
      thumbnail: { pc: '/images/projects/hotcake/hotcake_thumbnail_1.jpg', mobile: '/images/projects/hotcake/hotcake_thumbnail_2.jpg' },
    },
    {
      id: 'merlin',
      title: 'Merlin',
      thumbnail: { pc: '/images/projects/merlin/merlin_thumbnail_1.jpg', mobile: '/images/projects/merlin/merlin_thumbnail_2.jpg' },
    },
    {
      id: 'autonomy-practice',
      title: 'Autonomy Practice',
      thumbnail: { pc: '/images/projects/autonomy_practice/autonomy_practice_thumbnail_1.jpg', mobile: '/images/projects/autonomy_practice/autonomy_practice_thumbnail_2.jpg' },
    },
    {
      id: 'mizi',
      title: 'Mizi',
      thumbnail: { pc: '/images/projects/mizi/mizi_thumbnail_1.jpg', mobile: '/images/projects/mizi/mizi_thumbnail_2.jpg' },
    },
  ]

  return (
    <>
      <div className='w-full px-[16px] mb-[58px] md:px-[40px] md:mb-[90px] md-landscape-coming:mb-0 lg:mb-0 lg:px-[48px] lg:mb-[30px] relative'>
        <ProjectCard projects={projects} index={expandedIndex} setIndex={setExpandedIndex} />
      </div>
    </>
  )
}
