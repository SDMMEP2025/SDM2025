'use client'

import { Header, Footer2 } from '@/components/projects'
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import { useIsLandscape } from '@/hooks/useIsLandscape'

export default function Page() {
  const isLandscape = useIsLandscape()

  return (
    <>
      <Header />
      <div className='overflow-x-hidden  absolute w-full top-[58px] md:top-[68px] md-landscape-coming:top-1/2 md-landscape-coming:-translate-y-1/2 lg:h-[calc(100dvh-80px)] lg:-translate-y-0 lg:top-[80px] flex flex-col justify-between items-center'>
        <ProjectsGrid />
        {!isLandscape && (
          <div className='block w-full'>
            <Footer2 />
          </div>
        )}
      </div>
      {isLandscape && (
        <div className='hidden md:absolute md:block w-full bottom-0'>
          <Footer2 />
        </div>
      )}
    </>
  )
}
