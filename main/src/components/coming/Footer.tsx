//components/projects/Footer.tsx

'use client'

export function Footer() {
  return (
    <div className='w-full mix-blend-difference flex flex-col-reverse justify-between items-center gap-[12px] px-[61px] py-[14px] md:flex-row md:px-[40px] md:py-[12px] lg:px-[40px] lg:py-[28px]'>
      <div className='left-[40px] top-[28px] justify-start text-sm text-white mb-6 md:mb-0 text-center font-normal capitalize leading-normal md:text-left'>
        © 2025 Samsung Design Membership<span className='md:hidden'>.</span>
        <br className='md:hidden' />
        <span className='hidden md:inline'> </span>All rights reserved
      </div>
      <div className='w-fit h-6 left-[1089px] top-[28px] inline-flex justify-center items-center gap-10'>
        <a
          href='https://www.design.samsung.com/kr/contents/sdm/'
          target='_blank'
          rel='noopener noreferrer'
          className='justify-start text-white text-sm font-medium underline uppercase text-nowrap leading-tight hover:opacity-80 transition-opacity'
        >
          Official Page
        </a>
        <a
          href='https://www.instagram.com/samsungdesignmembership/'
          target='_blank'
          rel='noopener noreferrer'
          className='justify-start text-white text-sm font-medium underline uppercase leading-tight hover:opacity-80 transition-opacity'
        >
          Instagram
        </a>
        <a
          href='https://www.behance.net/Samsung_Design_Mem'
          target='_blank'
          rel='noopener noreferrer'
          className='justify-start text-white text-sm font-medium underline uppercase leading-tight hover:opacity-80 transition-opacity'
        >
          Behance
        </a>
      </div>
    </div>
  )
}
