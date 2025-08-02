//components/projects/Summary.tsx

'use client'

import classNames from 'classnames'

export function Summary() {
  return (
    <div
      className={classNames(
        'w-full bg-white flex justify-center items-center ',
        //mobile
        'px-[4.10vw] py-[56px]',
        //tablet
        'md:px-[5.2vw] md:py-[56px] ',
        //desktop
        'lg:px-[11.1vw] lg:py-[84px]',
        //large desktop
        'xl:px-[12.5vw] xl:py-[84px]',
      )}
    >
      <div
        className={classNames(
          'flex justify-between items-start w-full ',
          //mobile
          'flex-col gap-[20px]',
          //tablet
          'md:flex-row md:gap-0',
          //desktop
          'lg:flex-row lg:gap-0',
          //large desktop
          'xl:flex-row xl:gap-0',
        )}
      >
        {/* Left */}
        <div
          className={classNames(
            'h-full flex flex-col justify-start items-start ',
            //mobile
            'w-full',
            //tablet
            'md:w-[40%]',
            //desktop
            'lg:w-[40%]',
            //large desktop
            'xl:w-[35%]',
          )}
        >
          <SVGLogo
            className={classNames(
              'w-auto aspect-[152/73] ',
              //mobile
              'h-[40px]',
              //tablet
              'md:h-[60px]',
              //desktop
              'lg:h-[74px]',
              //large desktop
              'xl:h-[72px]',
            )}
          />
        </div>

        {/* Right */}
        <div
          className={classNames(
            'flex flex-col ',
            //mobile
            'w-full gap-[16px]',
            //tablet
            'md:w-[60%] md:gap-[8px]',
            //desktop
            'lg:w-[60%] lg:gap-[16px]',
            //large desktop
            'xl:w-[65%] xl:gap-[16px]',
          )}
        >
          <div className='flex flex-col'>
            {['슬랙', 'Slate for Own Scene'].map((text, index) => (
              <span
                key={index}
                className={classNames(
                  'font-bold ',
                  //mobile
                  'text-[28px] leading-[1.4] tracking-[-0.56px]',
                  //tablet
                  'md:text-[24px] md:leading-[1.5] md:tracking-[-0.48px]',
                  //desktop
                  'lg:text-[28px] lg:leading-[1.4] lg:tracking-[-0.56px]',
                  //large desktop
                  'xl:text-[28px] xl:leading-[1.5] xl:tracking-[-0.56px]',
                )}
              >
                {text}
              </span>
            ))}
          </div>

          <p
            className={classNames(
              '',
              //mobile
              'text-[17px] leading-[1.6] tracking-[-0.34px] font-normal mt-[20px]',
              //tablet
              'md:text-[18px] md:leading-[1.5] md:tracking-[-0.36px] md:font-medium md:mt-0',
              //desktop
              'lg:text-[22px] lg:leading-[1.5] lg:tracking-[-0.44px] lg:font-medium lg:mt-0',
              //large desktop
              'xl:text-[22px] xl:leading-[1.5] xl:tracking-[-0.44px] xl:font-medium xl:mt-0',
            )}
          >
            Slac은 언제나 소리와 함께하는 Z세대가 소리로 '나의 순간'에 몰입하는 방법을 제안합니다. 모든 순간 나를 가장
            가까이서 이해하는 웨어러블 오디오를 통해 나와 닮아가는 소리는 마치 나에게 딱 맞는 옷을 입는 것처럼
            변화합니다. Slac과 함께 디렉터가 되어, 소리로 완성되는 나만의 #Scene을 만나보세요!
          </p>

          <p
            className={classNames(
              'text-zinc-600 ',
              //mobile
              'text-[14px] leading-[1.6] tracking-[-0.28px] mt-0',
              //tablet
              'md:text-[14px] md:leading-[1.5] md:tracking-[-0.28px] md:mt-[8px]',
              //desktop
              'lg:text-[18px] lg:leading-[1.5] lg:tracking-[-0.36px] lg:mt-0',
              //large desktop
              'xl:text-[18px] xl:leading-[1.5] xl:tracking-[-0.36px] xl:mt-0',
            )}
          >
            김민채, 김민채, 김민채, 김민채, 김민채
          </p>
        </div>
      </div>
    </div>
  )
}

const SVGLogo = ({ className }: { className?: string }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' className={className} viewBox='0 0 152 73' fill='currentColor'>
      <path d='M139.217 66.1061H141.184V70.5135H142.677V66.1061H144.641V65.0894H139.217V66.1061Z' />
      <path d='M148.902 65.0894L147.808 68.5295L146.704 65.0894H144.641V70.5135H145.986V66.7717L147.118 70.5135H148.479L149.62 66.7691V70.5135H150.969V65.0894H148.902Z' />
      <path d='M14.0122 72.3214C22.8779 72.3214 28.0243 67.3308 28.0243 58.6748V47.3659C28.0243 40.4389 25.6161 36.2644 19.7027 32.6986L13.7893 29.1327C10.6169 27.1963 9.40995 25.0578 9.40995 21.1877V14.4654C9.40995 9.57445 10.6169 7.74035 13.7893 7.74035C16.9616 7.74035 18.1686 9.57445 18.1686 14.4654V22.2084H27.2573V13.2453C27.2573 4.89091 22.1167 0 13.5751 0C5.0335 0 0 4.89092 0 13.2399V21.6967C0 28.6264 2.4111 32.8036 8.32452 36.3641L14.235 39.9299C17.4074 41.8636 18.6144 44.0021 18.6144 47.8722V57.2447C18.6144 62.5396 17.2974 64.5784 13.798 64.5784C10.2986 64.5784 9.09155 62.5423 9.09155 57.2447V46.6495H0.0028973V58.6721C0.0028973 67.3308 5.15218 72.3214 14.018 72.3214H14.0122Z' />
      <path d='M78.9954 50.8065C84.5759 63.6382 99.0061 72.3214 114.907 72.3214C131.893 72.3214 145.414 62.0319 151.325 44.7165L151.564 43.9951C151.63 43.7887 151.702 43.5849 151.768 43.3784L151.875 43.0378H150.879L149.544 43.0298L149.48 43.2175C144.251 58.7335 132.284 68.374 118.47 68.374C110.731 68.374 100.989 65.1802 95.5007 59.6158C89.313 53.3434 86.0465 44.6093 86.0465 34.3627C86.0465 13.3466 102.132 2.98199 116.853 2.98199C127.901 2.98199 132.518 9.6754 131.7 16.712C130.799 24.4647 127.993 30.2142 127.383 31.2547H130.359L141.88 9.3536L141.946 9.21683L141.851 9.09616C140.294 7.0286 137.399 4.98519 133.899 3.48883C129.274 1.50977 123.852 0 117.785 0C106.408 0 95.0201 3.70068 87.6841 10.4236C81.6921 15.9129 77.8932 23.2258 76.693 31.4155C76.6355 31.5738 76.5635 31.6059 76.4887 31.2627L72.7243 1.00562H60.205L52.4315 63.4881H39.1985V1.00562H29.8335V70.9887H60.4208L62.162 54.762H70.2204L71.9616 70.9887H81.4302L78.9235 50.8521M62.8038 47.2587L66.0732 10.7427H66.2891L69.5585 47.2587H62.8067H62.8038ZM78.9206 50.8521L78.8803 50.5277C78.9177 50.6189 78.9551 50.7127 78.9925 50.8065' />
    </svg>
  )
}
