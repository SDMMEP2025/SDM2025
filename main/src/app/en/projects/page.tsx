//projects/page.tsx

'use client'
import { Header, Footer2 } from '@/components/projects'
import ProjectsGrid from '@/components/en/ProjectsGrid'

export default function Page() {
  return (
    <div className='w-screen flex flex-col min-h-0 '>
      <Header />
      <ProjectsGrid />
      <Footer2 />
    </div>
  )
}
