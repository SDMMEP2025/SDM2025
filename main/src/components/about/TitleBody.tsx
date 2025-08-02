//components/about/TitleBody.tsx

'use client'

import classNames from 'classnames'

interface TitleBody {
  title?: string
  text: string
}

export function TitleBody({
  title,
  text = "Slac은 언제나 소리와 함께하는 Z세대가 소리로 '나의 순간'에 몰입하는 방법을 제안합니다. 모든 순간 나를 가장 가까이서 이해하는 웨어러블 오디오를 통해 나와 닮아가는 소리는 마치 나에게 딱 맞는 옷을 입는 것처럼 변화합니다. Slac과 함께 디렉터가 되어, 소리로 완성되는 나만의 #Scene을 만나보세요!",
}: TitleBody) {
  return (
    <div
      className={classNames(
        'w-full bg-white flex flex-col justify-center items-center',
        //mobile
        // 'px-[3.90vw] py-[13.66vw] overflow-visible',
        'px-[4.10vw] py-[56px]',
        //tablet
        // 'md:px-[5.21vw] md:py-[7.29vw] md:overflow-hidden',
        'md:px-[5.2vw] md:py-[56px]',
        //desktop
        // 'lg:px-[14.10vw] lg:py-84 lg:overflow-hidden',
        'lg:px-[14.10vw] lg:py-[84px]',
      )}
    >
      <div
        className={classNames(
          'w-full flex',
          !title ? 'gap-[0px]' : '',
          //mobile
          'flex-col gap-[20px] justify-start items-center',
          //tablet
          'md:flex-row md:gap-[80px] md:justify-between md:items-start',
          //desktop
          'lg:flex-row lg:gap-[210px] lg:justify-between lg:items-start',
        )}
      >
        <div
          className={classNames(
            ' font-semibold',
            !title ? 'h-[0px]' : 'h-auto',
            //mobile
            'w-full text-[24px] tracking-[-0.48px] leading-[1.1] whitespace-nowrap',
            //tablet
            'md:w-[30%] md:text-[24px] md:tracking-[-0.48px] md:leading-[1.1] md:whitespace-pre-line',
            //desktop
            'lg:w-[30%] lg:text-[40px] lg:tracking-[-0.8px] lg:leading-[1.1] lg:whitespace-pre-line',
          )}
        >
          {title}
        </div>
        <div
          className={classNames(
            'text-neutral-800',
            //mobile
            'w-full text-[17px] tracking-[-0.34px] leading-[1.6] font-normal',
            //tablet
            'md:w-[70%] md:text-[17px] md:tracking-[-0.34px] md:leading-[1.5] md:font-medium',
            //desktop
            'lg:w-[70%] lg:text-[18px] lg:tracking-[-0.36px] lg:leading-[1.5] lg:font-medium',
          )}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
