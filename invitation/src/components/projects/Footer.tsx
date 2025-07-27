'use client'

export function Footer() {
  return (
    <div className='w-full bg-white flex flex-col-reverse justify-between items-center gap-[12px] xs:px-[14px] xs:py-[61px] md:flex-row md:px-[40px] md:py-[12px] lg:px-[40px] lg:py-[28px]'>
      <div className="left-[40px] top-[28px] justify-start text-sm text-[#4B4F57] text-center font-normal capitalize leading-normal md:text-left">
        © 2025 Samsung Design Membership<span className="md:hidden">.</span><br className="md:hidden" />
        <span className="hidden md:inline"> </span>All rights reserved
      </div>
      <div className='w-fit h-6 left-[1089px] top-[28px] inline-flex justify-center items-center gap-10'>
        <div className="justify-start text-[#4B4F57] text-sm font-medium underline uppercase leading-tight">
          Official Page
        </div>
        <div className="justify-start text-[#4B4F57] text-sm font-medium underline uppercase leading-tight">
          Instagram
        </div>
        <div className="justify-start text-[#4B4F57] text-sm font-medium underline uppercase leading-tight">
          Behance
        </div>
      </div>
    </div>
  )
}