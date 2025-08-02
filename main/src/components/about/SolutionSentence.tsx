//components/about/SolutionSentence.tsx

'use client'

import classNames from 'classnames'

interface SolutionSentenceProps {
  text: string
  type?: 'default' | 'section'
}

export function SolutionSentence({ text, type = 'default' }: SolutionSentenceProps) {
  if (type === 'section') {
    return (
      <div
        className={classNames(
          'font-semibold text-center font-english',
          //mobile
          'px-[4.10vw] py-[56px] text-[28px] tracking-[-0.56px] leading-[1.1] w-[80%] mx-auto',
          //tablet
          'md:px-[5.2vw] md:py-[48px] md:text-[24px] md:tracking-[-0.48px] md:leading-[1.1] md:w-full',
          //desktop
          'lg:px-[14.10vw] lg:py-[84px] lg:text-[40px] lg:tracking-[-0.8px] lg:leading-[1.1] lg:w-full',
          // 'xl:px-[12.50vw]',
        )}
      >
        {text}
      </div>
    )
  } else
    return (
      <div
        className={classNames(
          'font-semibold text-center font-english',
          //mobile
          'px-[16px] py-[56px] text-[36px] leading-[0.95] w-[80%] mx-auto',
          //tablet
          'md:px-[40px] md:py-[48px] md:text-[40px] md:leading-[1] md:w-full',
          //desktop
          'lg:px-[160px] lg:py-[84px] lg:text-[76px] lg:leading-[1] lg:w-full',
          // 'xl:px-[12.50vw]',
        )}
      >
        {text}
      </div>
    )
}
