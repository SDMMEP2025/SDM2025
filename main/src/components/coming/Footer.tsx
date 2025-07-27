'use client'

export function Footer() {
  return (
    <div className='w-full flex flex-col-reverse justify-between items-center gap-[12px] px-[61px] py-[14px] md:flex-row md:px-[40px] md:py-[12px] lg:px-[40px] lg:py-[28px] z-0 pointer-events-none mix-blend-difference' style={{ mixBlendMode: 'difference' }}>
      <div className="text-white justify-start text-sm text-center font-normal capitalize leading-normal md:text-left">
        © 2025 Samsung Design Membership<span className="md:hidden">.</span><br className="md:hidden" />
        <span className="hidden md:inline"> </span>All rights reserved
      </div>
      <div className='w-fit h-6 inline-flex justify-center items-center gap-10 text-white'>
        <div className="justify-start text-sm font-medium underline uppercase text-nowrap leading-tight">
          Official Page
        </div>
        <div className="justify-start text-sm font-medium underline uppercase leading-tight">
          Instagram
        </div>
        <div className="justify-start hidden landscape:md:block lg:block text-sm font-medium underline uppercase leading-tight">
          Behance
        </div>
      </div>
    </div>
  )
}
