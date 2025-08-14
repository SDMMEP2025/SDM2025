'use client'

import classNames from 'classnames'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <div
      className={classNames(
        'absolute bottom-4 left-0 right-0 z-20',
        'w-full mix-blend-difference',
        'hidden md:flex md:flex-row md:justify-between md:items-center md:gap-[12px] md:px-[44px] md:py-[12px]',
        className,
      )}
    >
      <div className='text-sm text-white font-normal capitalize leading-normal'>
        © 2025 Samsung Design Membership All rights reserved
      </div>
      <div className='flex justify-center items-center gap-10'>
        <a
          href='https://www.design.samsung.com/kr/contents/sdm/'
          target='_blank'
          rel='noopener noreferrer'
          className='text-white text-sm font-medium underline uppercase whitespace-nowrap leading-tight hover:opacity-80 transition-opacity'
        >
          Official Page
        </a>
        <a
          href='https://www.instagram.com/samsungdesignmembership/'
          target='_blank'
          rel='noopener noreferrer'
          className='text-white text-sm font-medium underline uppercase leading-tight hover:opacity-80 transition-opacity'
        >
          Instagram
        </a>
        <a
          href='https://www.behance.net/Samsung_Design_Mem'
          target='_blank'
          rel='noopener noreferrer'
          className='text-white text-sm font-medium underline uppercase leading-tight hover:opacity-80 transition-opacity'
        >
          Behance
        </a>
      </div>
    </div>
  )
}
