'use client'
import { Header, Footer } from '@/components/projects'
import ProjectsGrid from '@/components/projects/ProjectsGrid'

export default function Page() {
  return (
    <div className='w-screen h-screen flex flex-col min-h-0'>
      <Header />
      <ProjectsGrid />
      <Footer />
    </div>
  )
}
