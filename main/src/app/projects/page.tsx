//projects/page.tsx

'use client'
import { Header, Footer2 } from '@/components/projects'
import ProjectsGrid from '@/components/projects/ProjectsGrid'

export default function Page() {
  return (
    <>
      <Header />
      <div className='absolute w-full top-[58px] md:top-[68px] md-landscape-coming:top-[clamp(68px,20dvh,80px)] lg:h-[calc(100dvh-80px)] lg:-translate-y-0 lg:top-[80px] flex flex-col justify-between items-center'>
        <ProjectsGrid />
        <div className='block md:hidden'>
          <Footer2 />
        </div>
      </div>
      <div className='hidden md:absolute md:block w-full bottom-0'>
        <Footer2 />
      </div>
    </>
  )
}
