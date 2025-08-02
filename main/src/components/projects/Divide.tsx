//components/projects/Divide.tsx

'use client'

import classNames from 'classnames'

interface DivideProps {
  title: string
  number: string
  className?: string
}

export function Divide({ title, number, className = '' }: DivideProps) {
  return (
    <div
      className={classNames(
        'w-full bg-white flex justify-between items-center overflow-hidden',
        //mobile
        'px-[4.10vw] pt-[36px]',
        //tablet
        'md:px-[5.2vw] md:py-[56px]',
        //desktop
        'lg:px-[14.10vw] lg:py-[36px]',
        //large desktop
        'xl:px-[12.5vw] xl:py-[84px]',
        className,
      )}
    >
      <div
        className={classNames(
          'font-semibold',
          //mobile
          'text-[14px] tracking-[-0.28px] leading-[1.6]',
          //tablet
          'md:text-[14px] md:tracking-[-0.28px] md:leading-[1.5]',
          //desktop
          'lg:text-[18px] lg:tracking-[-0.36px] lg:leading-[1.5]',
        )}
      >
        {title}
      </div>
      <div
        className={classNames(
          'text-right font-semibold',
          //mobile
          'text-[14px] tracking-[-0.28px] leading-[1.6]',
          //tablet
          'md:text-[14px] md:tracking-[-0.28px] md:leading-[1.5]',
          //desktop
          'lg:text-[18px] lg:tracking-[-0.36px] lg:leading-[1.5]',
          className,
        )}
      >
        {number}
      </div>
    </div>
  )
}
