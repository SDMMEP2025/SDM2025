//components/projects/MobileNavigation.tsx

'use client'
import Link from 'next/link'

interface NavigationItem {
  label: string
  url: string
}

interface MobileNavigationProps {
  previousItem?: NavigationItem
  nextItem?: NavigationItem
}

export function MobileNavigation({
  previousItem = { label: 'Previous', url: '/previous' },
  nextItem = { label: 'Next', url: '/next' },
}: MobileNavigationProps) {
  return (
    <>
      {/* Mobile Navigation */}
      <div className='w-full px-4 py-[30px] bg-white flex flex-row justify-between items-center overflow-hidden md:hidden lg:hidden'>
        <Link href={previousItem.url} className='flex justify-start items-center cursor-pointer'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <g clipPath='url(#clip0_50_2186)'>
              <path d='M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z' fill='#4B4F57' />
            </g>
            <defs>
              <clipPath id='clip0_50_2186'>
                <rect width='24' height='24' fill='white' />
              </clipPath>
            </defs>
          </svg>
          <div className="justify-start text-zinc-600 text-base font-medium font-['Pretendard'] uppercase leading-relaxed">
            {previousItem.label}
          </div>
        </Link>
        <Link href={nextItem.url} className='flex justify-start items-center cursor-pointer'>
          <div className="justify-start text-zinc-600 text-base font-medium font-['Pretendard'] uppercase leading-relaxed">
            {nextItem.label}
          </div>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <g clipPath='url(#clip0_55_2588)'>
              <path
                d='M8.58984 16.59L13.1698 12L8.58984 7.41L9.99984 6L15.9998 12L9.99984 18L8.58984 16.59Z'
                fill='#4B4F57'
              />
            </g>
            <defs>
              <clipPath id='clip0_55_2588'>
                <rect width='24' height='24' fill='white' />
              </clipPath>
            </defs>
          </svg>
        </Link>
      </div>

      {/* Tablet Navigation */}
      <div className='w-full px-4 py-[30px] bg-white flex-row justify-between items-center overflow-hidden hidden md:flex lg:hidden'>
        <Link href={previousItem.url} className='flex justify-start items-center cursor-pointer'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <g clipPath='url(#clip0_50_2186)'>
              <path d='M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z' fill='#4B4F57' />
            </g>
            <defs>
              <clipPath id='clip0_50_2186'>
                <rect width='24' height='24' fill='white' />
              </clipPath>
            </defs>
          </svg>
          <div className="justify-start text-zinc-600 text-base font-medium font-['Pretendard'] uppercase leading-normal">
            {previousItem.label}
          </div>
        </Link>
        <Link href={nextItem.url} className='flex justify-start items-center cursor-pointer'>
          <div className="justify-start text-zinc-600 text-base font-medium font-['Pretendard'] uppercase leading-normal">
            {nextItem.label}
          </div>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <g clipPath='url(#clip0_55_2588)'>
              <path
                d='M8.58984 16.59L13.1698 12L8.58984 7.41L9.99984 6L15.9998 12L9.99984 18L8.58984 16.59Z'
                fill='#4B4F57'
              />
            </g>
            <defs>
              <clipPath id='clip0_55_2588'>
                <rect width='24' height='24' fill='white' />
              </clipPath>
            </defs>
          </svg>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className='w-full px-4 py-[30px] bg-white flex-row justify-between items-center overflow-hidden hidden md:hidden lg:flex'>
        <Link href={previousItem.url} className='flex justify-start items-center cursor-pointer'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <g clipPath='url(#clip0_50_2186)'>
              <path d='M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z' fill='#4B4F57' />
            </g>
            <defs>
              <clipPath id='clip0_50_2186'>
                <rect width='24' height='24' fill='white' />
              </clipPath>
            </defs>
          </svg>
          <div className="justify-start text-zinc-600 text-[18px] font-medium font-['Pretendard'] uppercase leading-[1.5] tracking-[-0.36px]">
            {previousItem.label}
          </div>
        </Link>
        <Link href={nextItem.url} className='flex justify-start items-center cursor-pointer'>
          <div className="justify-start text-zinc-600 text-[18px] font-medium font-['Pretendard'] uppercase leading-[1.5] tracking-[-0.36px]">
            {nextItem.label}
          </div>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <g clipPath='url(#clip0_55_2588)'>
              <path
                d='M8.58984 16.59L13.1698 12L8.58984 7.41L9.99984 6L15.9998 12L9.99984 18L8.58984 16.59Z'
                fill='#4B4F57'
              />
            </g>
            <defs>
              <clipPath id='clip0_55_2588'>
                <rect width='24' height='24' fill='white' />
              </clipPath>
            </defs>
          </svg>
        </Link>
      </div>
    </>
  )
}
