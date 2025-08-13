//components/projects/MidTitle.tsx

'use client'

import classNames from 'classnames'

interface MidTitleProps {
  align?: 'center' | 'left' | 'right'
  text?: string | React.ReactNode
  padding?: boolean
  className?: string
}

export function MidTitle({ align = 'center', text, padding = true, className = ''  }: MidTitleProps) {
  return (
    <div
      className={classNames(
        'w-full bg-white flex justify-center items-center gap-2',
        //mobile
        padding ? 'py-[56px]' : 'pt-[56px] pb-0',
        'px-[4.10vw]',
        //tablet
        'md:px-[5.2vw]',
        //desktop
        padding ? 'lg:py-[84px]' : 'lg:pt-[84px] lg:pb-0',
        'lg:px-[14.10vw]',
        //large desktop
        padding ? 'xl:py-[84px]' : 'xl:pt-[84px] xl:pb-0',
        'xl:px-[12.5vw]',
        className,
      )}
    >
      <div
        className={classNames(
          'w-full',
          align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right',
          //mobile
          'text-[20px] leading-[1.6] tracking-[-0.4px] font-bold',
          //tablet
          'md:text-[20px] md:leading-[1.5] md:tracking-[-0.4px] md:font-bold',
          //desktop
          'lg:text-[28px] lg:leading-[1.4] lg:tracking-[-0.56px] lg:font-bold',
          //large desktop
          'xl:text-[28px] xl:leading-[1.4] xl:tracking-[-0.56px] xl:font-bold',
        )}
      >
        {text}
      </div>
    </div>
  )
}
