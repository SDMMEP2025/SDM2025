'use client'
import ProjectCard from '@/components/projects/ProjectCard'
import { useState } from 'react'

interface Project {
  id: string
  title: string
  thumbnail: string
}

export default function ProjectsGrid() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const projects: Project[] = [
    {
      id: '1TF',
      title: 'Cruise',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: '2TF',
      title: 'Simul',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: '3TF',
      title: 'Politik',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: '4TF',
      title: 'Hotcake',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: '5TF',
      title: 'Newbe',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: '6TF',
      title: 'LavCon',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: '7TF',
      title: 'Merlin',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: '8TF',
      title: 'Mizi',
      thumbnail: '/images/projects/test.png',
    },
    {
      id: '9TF',
      title: 'Autonomy Practice',
      thumbnail: '/images/projects/test.png',
    },
  ]

  return (
    <div className="w-full flex-1 items-stretch min-h-0 px-[16px] md:px-[40px] lg:px-[48px] 
                    flex flex-col md:flex-col md-landscape:flex-row lg:flex-row">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          isExpanded={expandedIndex === index}
          isNextToExpanded={expandedIndex !== null && expandedIndex + 1 === index}
          isPreviousToExpanded={expandedIndex !== null && expandedIndex - 1 === index}
          onHover={() => setExpandedIndex(index)}
        />
      ))}
    </div>
  )
}