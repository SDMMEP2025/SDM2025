'use client'

interface MobileNavigationProps {
  onPrevious?: () => void
  onNext?: () => void
}

export function MobileNavigation({ onPrevious, onNext }: MobileNavigationProps) {
  return (
    <>
      <div className='w-full px-4 py-[30px] bg-white flex flex-row justify-between items-center overflow-hidden md:hidden'>
        <div className='flex justify-start items-center cursor-pointer' onClick={onPrevious}>
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
            Previous
          </div>
        </div>
        <div className='flex justify-start items-center cursor-pointer' onClick={onNext}>
          <div className="justify-start text-zinc-600 text-base font-medium font-['Pretendard'] uppercase leading-relaxed">
            Next
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
        </div>
      </div>

      <div className='w-full px-4 py-[30px] bg-white flex flex-row justify-between items-center overflow-hidden hidden md:flex'>
        <div className='flex justify-start items-center cursor-pointer' onClick={onPrevious}>
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
            Previous
          </div>
        </div>
        <div className='flex justify-start items-center cursor-pointer' onClick={onNext}>
          <div className="justify-start text-zinc-600 text-base font-medium font-['Pretendard'] uppercase leading-normal">
            Next
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
        </div>
      </div>
    </>
  )
}
