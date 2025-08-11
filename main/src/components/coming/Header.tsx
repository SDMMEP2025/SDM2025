'use client'

export default function Header() {
  return (
    <>
      {/* 데스크톱 버전 (lg 이상) */}
      <div className='hidden lg:block lg:flex px-[39px] py-[41px] font-english w-full justify-between z-500'>
        <div className='text-left text-neutral-800 text-lg font-medium leading-snug'>
          Membership Emergence<br/>
          Project 2025 
        </div>
        <div className='text-left text-neutral-800 text-lg font-medium leading-snug'>
          New Formative
        </div>
        <div className='text-left text-neutral-800 text-lg font-medium leading-snug'>
          Samsung R&D Campus
          <br />
          Tower A 2F, Gallery 1, 2
          <br />
          Aug 22 (Fri) – Aug 27 (Tue)
        </div>
      </div>

      {/* 태블릿/모바일 버전 (md 이상 lg 미만) */}
      <div className='hidden md:flex lg:hidden flex-col font-english items-center justify-center px-[39px] py-[41px] w-full z-20'>
        <div className="text-center text-neutral-800 text-xl font-medium">
          New Formative
        </div>
        <div className="text-center text-neutral-800 text-lg font-medium">
          Aug 22 (Fri) – Aug 27 (Tue)
        </div>
      </div>

      {/* 작은 모바일 버전 (md 미만) */}
      <div className='flex md:hidden flex-col items-center font-english justify-center pt-7 py-[5.8dvh] w-full z-[600]'>
        <div className="text-center text-neutral-800 text-[20px] font-medium">
          New Formative
        </div>
        <div className="text-center text-neutral-800 text-[18px] font-medium">
          Aug 22 (Fri) – Aug 27 (Tue)
        </div>
      </div>
    </>
  )
}