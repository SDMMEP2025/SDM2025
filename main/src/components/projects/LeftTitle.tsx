'use client'

import classNames from 'classnames'
import React from 'react'


interface LeftTitleProps {
  text?: string | React.ReactNode
  padding?: boolean
  className?: string
}

export function LeftTitle({
  text = '나를 몰입하는 방법',
  padding = true,
  className = ''
}: LeftTitleProps) {
  return (
    <div
      className={classNames(
        'w-full bg-white flex flex-col justify-start items-center',
        //mobile
        padding ? 'py-[56px]' : 'pt-[56px]',
        'px-[4.10vw]',
        //tablet
        padding ? 'md:py-[56px]' : 'md:pt-[56px]',
        'md:px-[5.2vw]',
        //desktop
        padding ? 'lg:py-[84px]' : 'lg:pt-[84px]',
        'lg:px-[14.10vw]',
        //large desktop
        padding ? 'xl:py-[84px]' : 'xl:pt-[84px]',
        'xl:px-[12.5vw]',
        className
      )}
    >
      <div
        className={classNames(
          '',
          //mobile
          'w-full text-[20px] tracking-[-0.4px] leading-[1.6] font-bold',
          //tablet
          'md:text-[20px] md:tracking-[-0.4px] md:leading-[1.5] md:whitespace-pre-line md:font-bold',
          //desktop
          'lg:text-[28px] lg:tracking-[-0.56px] lg:leading-[1.4] lg:whitespace-pre-line lg:font-bold',
          //large desktop
          'xl:text-[28px] xl:tracking-[-0.56px] xl:leading-[1.4] xl:whitespace-pre-line xl:font-bold',
        )}
      >
        {text}
      </div>
    </div>
  )
}
