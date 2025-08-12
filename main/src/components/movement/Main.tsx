'use client'

import classNames from 'classnames'
import { useRef } from 'react'

interface MainProps {
  onUpload?: (files: FileList | null) => void
  className?: string
}

export function Main({ onUpload, className = '' }: MainProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (onUpload) {
      onUpload(files)
    }
    // 파일 선택 후 input을 리셋하여 같은 파일을 다시 선택할 수 있게 함
    event.target.value = ''
  }

  const REPEAT = 5
  const srcFront = {
    pc: 'images/movement/pc_front.svg',
    tab: 'images/movement/tab_front.svg',
    mo: 'images/movement/mo_front.svg',
  }
  const srcBack = {
    pc: 'images/movement/pc_back.svg',
    tab: 'images/movement/tab_back.svg',
    mo: 'images/movement/mo_back.svg',
  }

  return (
    <div
      className={classNames(
        'absolute inset-0 w-full h-full flex flex-col overflow-hidden  justify-center items-center z-10 bg-white',
        className,
      )}
    >
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type='file'
        multiple
        accept='image/*,video/*'
        onChange={handleFileChange}
        className='hidden'
      />

      <div className='animate-float-up-front absolute left-0 w-full'>
        {Array.from({ length: REPEAT }).map((_, i) => (
          <picture key={`front-${i}`}>
            {/* lg 이상 = PC (1440px) */}
            <source media='(min-width:1440px)' srcSet={srcFront.pc} />
            {/* md 이상 = Tablet (768px) */}
            <source media='(min-width:768px)' srcSet={srcFront.tab} />
            {/* 그 외 = Mobile */}
            <img src={srcFront.mo} className='w-full h-auto' alt='' />
          </picture>
        ))}
      </div>

      <div className='animate-float-up-back absolute left-0 w-full'>
        {Array.from({ length: REPEAT }).map((_, i) => (
          <picture key={`back-${i}`}>
            <source media='(min-width:1440px)' srcSet={srcBack.pc} />
            <source media='(min-width:768px)' srcSet={srcBack.tab} />
            <img src={srcBack.mo} className='w-full h-auto' alt='' />
          </picture>
        ))}
      </div>

      {/* Title Group */}
      <div
        className={classNames(
          'absolute flex  justify-center items-center mix-blend-difference w-full',
          //mobile
          'left-1/2 top-[30.72%] transform -translate-x-1/2',
          'gap-[14px] flex-col-reverse', // 모바일
          //tablet
          'md-landscape:top-[34.9%]',
          'md:left-1/2 md:top-[32.25%] transform -translate-x-1/2',
          'md:gap-[12px] md:flex-col',
          //desktop
          'lg:left-1/2 lg:top-[32.09%] transform -translate-x-1/2',
          'lg:gap-[clamp(12px,calc(-4.714285px+1.160714vw),25px)]',
          // large desktop
          '2xl:left-1/2 2xl:top-[32.12%] transform -translate-x-1/2',
          '2xl:gap-[25px]', // 2xl 이상 고정
        )}
      >
        <div
          className={classNames(
            'text-center text-white font-medium',
            //mobile
            'text-[17px] leading-[100%] letterSpacing-[0.34px]',
            // tablet
            'md:text-[clamp(18px,calc(11.142857px+0.892857vw),24px)] md:leading-[130%]',
            // desktop
            'lg:text-[clamp(24px,calc(3.428571px+1.428571vw),40px)] lg:leading-[130%] lg:letterSpacing-[0.48px]',
            // large desktop
            '2xl:text-[40px] 2xl:leading-[130%] 2xl:letterSpacing-[0.8px]',
          )}
        >
          나를 움직이게 하는 순간을 담아보세요
        </div>
        <div
          className={classNames(
            'text-center text-[#E8E8E8] font-semibold font-english capitalize',
            // 모바일→md : 34 → 54 (360~768 기준으로 선형 증가)
            'text-[clamp(34px,calc(16.352941px+4.901961vw),54px)] leading-[95%] letterSpacing-[-0.68px]',
            // md→lg : 54 → 64 (768~1440)
            'md:text-[clamp(54px,calc(42.571429px+1.488095vw),64px)] md:leading-[100%] md:letterSpacing-[-1.08px]',
            // lg→2xl : 64 → 110 (1440~2560)
            'lg:text-[clamp(64px,calc(4.857143px+4.107143vw),110px)] lg:leading-[100%] lg:letterSpacing-[-1.28px]',
            // 2xl 이상은 고정 110
            '2xl:text-[110px] 2xl:leading-[100%] 2xl:letterSpacing-[-2.2px]',
          )}
        >
          What's Your <br className='inline-block md:hidden' />
          Movement?
        </div>
      </div>

      {/* Disclaimer Text - 별도 위치 */}
      <div
        className={classNames(
          'absolute flex justify-center items-center w-full',
          'inset-x-0',
          'gap-[16px] flex-col',
          //mobile
          'bottom-[15.67%]',
          //tablet
          'md-landscape:bottom-[35.2%]',
          'md:bottom-[27.55%]',
          //desktop
          'lg:bottom-[25.18%]',
          // large desktop
          '2xl:bottom-[25.45%]',
        )}
      >
        <div
          className={classNames(
            'text-center text-gray-200 font-medium capitalize mix-blend-difference',
            //mobile
            'text-[14px] leading-[100%] letterSpacing-[-0.28px]',
            // tablet
            'md:text-[14px] md:leading-[100%] md:letterSpacing-[-0.28px]',
            // desktop
            'lg:text-[clamp(14px,calc(1.142857px+0.892857vw),24px)] lg:leading-[100%] lg:letterSpacing-[-0.28px]',
            // large desktop
            '2xl:text-[24px] 2xl:leading-[100%] 2xl:letterSpacing-[-0.48px]',
          )}
        >
          *업로드한 이미지는 데이터에 저장되지 않습니다
        </div>
        <button
          style={{ isolation: 'isolate' /* 새로운 레이어 생성 */ }}
          onClick={handleUploadClick}
          className={classNames(
            'bg-neutral-800 rounded-[100px] inline-flex justify-center items-center gap-[5.11px] overflow-hidden transition-all duration-200 hover:bg-neutral-700',
            // 모바일
            'w-[184px] h-[56px]',
            // tablet
            'md:w-[clamp(160px,calc(211.429px-3.57143vw),184px)] md:h-[48px]',
            // desktop
            'lg:w-[clamp(160px,calc(31.714px+8.92857vw),260px)] lg:h-[clamp(46px,calc(10px+2.5vw),74px)]',
            // large desktop
            '2xl:w-[260px] 2xl:h-[74px]',
          )}
        >
          <span
            className={classNames(
              'text-white font-medium',
              // 모바일
              'text-[17px]',
              // tablet
              'md:text-[clamp(17px,calc(15.857px+0.14881vw),18px)]',
              // desktop
              'lg:text-[clamp(18px,calc(2.571px+1.07143vw),30px)]',
              // large desktop
              '2xl:text-[30px]',
            )}
          >
            Upload
          </span>
        </button>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-20%);
          }
        }

        .animate-float-up-back {
          animation: float-up 30s linear infinite;
        }

        .animate-float-up-front {
          animation: float-up 25s linear infinite;
        }
      `}</style>
    </div>
  )
}
