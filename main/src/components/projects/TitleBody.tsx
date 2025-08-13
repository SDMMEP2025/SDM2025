//components/projects/TitleBody.tsx

'use client'

import classNames from 'classnames'

interface TitleBody {
  title: string | React.ReactNode
  text?: string | React.ReactNode
}

export function TitleBody({
  title = "나의 순간'에 몰입하는 방법",
  text = "Slac은 언제나 소리와 함께하는 Z세대가 소리로 '나의 순간'에 몰입하는 방법을 제안합니다. 모든 순간 나를 가장 가까이서 이해하는 웨어러블 오디오를 통해 나와 닮아가는 소리는 마치 나에게 딱 맞는 옷을 입는 것처럼 변화합니다. Slac과 함께 디렉터가 되어, 소리로 완성되는 나만의 #Scene을 만나보세요!",
}: TitleBody) {
  return (
    <div
      className={classNames(
        'w-full bg-white flex flex-col justify-center items-center',
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
          'w-full flex',
          !title ? 'gap-[0px]' : '',
          //mobile
          'flex-col gap-[20px] justify-start items-center',
          //tablet
          'md:flex-row md:gap-[80px] md:justify-between md:items-start',
          //desktop
          'lg:flex-row lg:gap-[210px] lg:justify-between lg:items-start',
          //large desktop
          'xl:flex-row xl:gap-[210px] xl:justify-between xl:items-start',
        )}
      >
        <div
          className={classNames(
            '',
            !title ? 'h-[0px]' : 'h-auto',
            //mobile
            'w-full text-[20px] tracking-[-0.4px] leading-[1.6] font-bold',
            //tablet
            'md:w-[30%] md:text-[20px] md:tracking-[-0.4px] md:leading-[1.5] md:whitespace-pre-line md:font-bold',
            //desktop
            'lg:w-[30%] lg:text-[28px] lg:tracking-[-0.56px] lg:leading-[1.4] lg:whitespace-pre-line lg:font-bold',
            //large desktop
            'xl:w-[30%] xl:text-[28px] xl:tracking-[-0.56px] xl:leading-[1.4] xl:whitespace-pre-line xl:font-bold',
          )}
        >
          {title}
        </div>
        <div
          className={classNames(
            '',
            !text ? 'h-[0px]' : 'h-auto',
            //mobile
            'w-full text-[17px] tracking-[-0.34px] leading-[1.6] font-normal',
            //tablet
            'md:w-[70%] md:text-[17px] md:tracking-[-0.34px] md:leading-[1.5] md:font-medium',
            //desktop
            'lg:w-[70%] lg:text-[18px] lg:tracking-[-0.36px] lg:leading-[1.5] lg:font-medium',
            //large desktop
            'xl:w-[70%] xl:text-[18px] xl:tracking-[-0.36px] xl:leading-[1.5] xl:font-medium',
          )}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
