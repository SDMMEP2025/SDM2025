// components/projects/MidTitle.tsx
'use client'
import React from 'react'
import classNames from 'classnames'

interface MidTitleProps {
  align?: 'center' | 'left' | 'right'
  text?: React.ReactNode | React.ReactNode[]
  padding?: boolean
  className?: string
}

export function MidTitle({
  align = 'center',
  text,
  padding = true,
  className = '',
}: MidTitleProps) {
  const nodes = React.Children.toArray(text).filter(Boolean)
  const hasText = nodes.length > 0

  return (
    <div
      className={classNames(
        'w-full bg-white flex justify-center items-center gap-2',
        padding ? 'py-[56px]' : 'pt-[56px] pb-0',
        'px-[4.10vw]',
        'md:px-[5.2vw]',
        padding ? 'lg:py-[84px]' : 'lg:pt-[84px] lg:pb-0',
        'lg:px-[14.10vw]',
        padding ? 'xl:py-[84px]' : 'xl:pt-[84px] xl:pb-0',
        'xl:px-[12.5vw]',
        className,
      )}
    >
      <div
        className={classNames(
          'w-full',
          align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right',
          hasText ? 'h-auto' : 'h-[0px]',
          'text-[20px] leading-[1.6] tracking-[-0.4px] font-bold',
          'md:text-[20px] md:leading-[1.5] md:tracking-[-0.4px] md:font-bold',
          'lg:text-[28px] lg:leading-[1.4] lg:tracking-[-0.56px] lg:font-bold',
          'xl:text-[28px] xl:leading-[1.4] xl:tracking-[-0.56px] xl:font-bold',
        )}
      >
        {nodes.map((node, i) => (
          <React.Fragment key={`midtitle-${i}`}>{node}</React.Fragment>
        ))}
      </div>
    </div>
  )
}
