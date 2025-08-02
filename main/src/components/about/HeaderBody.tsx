//components/about/HeaderBody.tsx

'use client'

import classNames from 'classnames'

interface HeaderBodyProps {
  title: string | string[]
  description: string
  className?: string
}

export function HeaderBody({ title, description, className = '' }: HeaderBodyProps) {
  const titleLines = Array.isArray(title) ? title : [title]

  return (
    <div
      className={classNames(
        'w-full h-fit bg-white flex flex-col justify-center items-center ',
        //mobile
        'px-[4.10vw] py-[56px] gap-[12px]',
        //tablet
        'md:px-[5.2vw] md:py-[48px] md:gap-[20px]',
        //desktop
        'lg:px-[14.10vw] lg:py-[84px] lg:gap-[24px]',
        className,
      )}
    >
      <div
        className={classNames(
          'font-english font-semibold',
          //mobile
          'w-full text-[28px] tracking-[-0.56px] leading-[1.1] text-left',
          //tablet
          'md:w-[68vw] md:text-[24px] md:tracking-[-0.48px] md:leading-[1.1] md:text-center',
          //desktop
          'lg:w-[790px] lg:text-[40px] lg:tracking-[-0.8px] lg:leading-[1.1] lg:text-center',
        )}
      >
        {titleLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div
        className={classNames(
          'break-keep',
          //mobile
          'w-full text-[17px] leading-[1.6] tracking-[-0.34px] font-regular text-left',
          //tablet
          'md:w-[68vw] md:text-[17px] md:leading-[1.5] md:tracking-[-0.34px] md:font-medium md:text-center',
          //desktop
          'lg:w-[780px] lg:text-[18px] lg:leading-[1.5] lg:tracking-[-0.36px] lg:font-medium lg:text-center',
        )}
      >
        {description}
      </div>
    </div>
  )
}
