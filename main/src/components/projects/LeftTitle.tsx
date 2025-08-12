'use client'

import classNames from 'classnames'
import React from 'react'

export function LeftTitle({ text = '나를 몰입하는 방법' }: { text: string | React.ReactNode }) {
  return (
    <div
      className={classNames(
        'w-full bg-white flex flex-col justify-start items-center',
        //mobile
        'px-[4.10vw] py-[56px]',
        //tablet
        'md:px-[5.2vw] md:py-[56px]',
        //desktop
        'lg:px-[14.10vw] lg:py-[84px]',
        //large desktop
        'xl:px-[12.5vw] xl:py-[84px]',
      )}
    >
      <div
        className={classNames(
          '',
          //mobile
          'w-full text-[20px] tracking-[-0.4px] leading-[1.6] whitespace-nowrap font-normal',
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
