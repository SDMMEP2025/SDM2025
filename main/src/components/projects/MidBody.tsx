'use client'

import classNames from 'classnames'
import React from 'react'

interface MidBodyProps {
  content: string | React.ReactNode | React.ReactNode[]
  className?: string
  align?: 'center' | 'left' | 'right'
  padding?: boolean
}

export function MidBody({
  content,
  className = '',
  align = 'center',
  padding = true,
}: MidBodyProps) {
  const contentNodes = React.Children.toArray(content)

  return (
    <div
      className={classNames(
        'w-full h-fit bg-white flex flex-col justify-center items-center',
        // mobile
        padding ? 'py-[56px]' : 'pt-[56px]',
        'px-[4.10vw] gap-[12px]',
        // tablet
        padding ? 'md:py-[48px]' : 'md:pt-[48px]',
        'md:px-[5.2vw] md:py-[48px] md:gap-[20px]',
        // desktop
        padding ? 'lg:py-[48px]' : 'lg:pt-[48px]',
        'lg:px-[14.10vw] lg:py-[84px] lg:gap-[24px]',
        className,
      )}
    >
      <div
        className={classNames(
          'break-keep',
          // mobile
          'w-full text-[17px] leading-[1.6] tracking-[-0.34px] font-regular text-left',
          // tablet
          'md:w-[66.67vw] md:text-[17px] md:leading-[1.5] md:tracking-[-0.34px] md:font-medium',
          align === 'center'
            ? 'md:text-center'
            : align === 'left'
            ? 'md:text-left'
            : 'md:text-right',
          // desktop
          'lg:w-[51.39vw] lg:text-[18px] lg:leading-[1.5] lg:tracking-[-0.36px] lg:font-medium',
          align === 'center'
            ? 'lg:text-center'
            : align === 'left'
            ? 'lg:text-left'
            : 'lg:text-right',
        )}
      >
        {contentNodes.map((node, i) => (
          <div key={`midbody-${i}`}>{node}</div>
        ))}
      </div>
    </div>
  )
}
