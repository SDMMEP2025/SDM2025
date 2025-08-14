//projects/page.tsx

'use client'
import { Header, Footer2 } from '@/components/projects'
import ProjectsGrid from '@/components/projects/ProjectsGrid'

export default function Page() {
  return (
    <div className='w-screen flex flex-col h-[100dvh] w-full justify-between items-center'>
      <Header />
      <ProjectsGrid />
      <Footer2 />
    </div>
  )
}
