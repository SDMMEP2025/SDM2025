'use client'

import classNames from 'classnames'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <div
      className={classNames(
        'absolute bottom-0 left-0 right-0 z-20',
        'w-full mix-blend-difference flex flex-col-reverse justify-between items-center gap-[12px] px-[61px] py-[14px]',
        'hidden md:block',
        'md:flex-row md:px-[40px] md:py-[12px]',
        'lg:px-[40px] lg:py-[28px]',
        className,
      )}
    >
      <div className='justify-start text-sm text-white text-center font-normal capitalize leading-normal md:text-left'>
        © 2025 Samsung Design Membership<span className='md:hidden'>.</span>
        <br className='md:hidden' />
        <span className='hidden md:inline'> </span>All rights reserved
      </div>
      <div className='w-fit h-6 inline-flex justify-center items-center gap-10'>
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
