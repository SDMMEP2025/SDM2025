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

  return (
    <div
      className={classNames('absolute inset-0 w-full h-full flex flex-col justify-center items-center z-10 bg-white', className)}
    >
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className='absolute inset-0 w-full h-full overflow-hidden -z-10'>
        <div className='animate-float-up'>
          <img src='images/movement/PC.svg' className='w-full h-auto block' />
          <img src='images/movement/PC.svg' className='w-full h-auto block' />
          <img src='images/movement/PC.svg' className='w-full h-auto block' />
          <img src='images/movement/PC.svg' className='w-full h-auto block' />
          <img src='images/movement/PC.svg' className='w-full h-auto block' />
        </div>
      </div>

      {/* Title Group */}
      <div 
        className={classNames(
          'absolute flex flex-col justify-center items-center mix-blend-difference ',
          //mobile
          'left-1/2 top-[28.43dvh] transform -translate-x-1/2',
          //tablet  
          'md:left-1/2 md:w-[427px] md:top-[16.66dvh] transform -translate-x-1/2',
          //desktop
          'lg:left-1/2 lg:w-fit lg:top-[15.31dvh] transform -translate-x-1/2'
        )}
      >
        <div
          className={classNames(
            'text-center text-[#E8E8E8] font-semibold font-english capitalize',
            //mobile
            'text-[34px] leading-[95%]',
            //tablet
            'md:text-[40px] md:leading-[100%]',
            //desktop
            'lg:text-[48px] lg:leading-[100%]',
          )}
        >
          What's Your Movement?
        </div>
        <div
          className={classNames(
            'mix-blend-difference text-center text-white font-medium leading-relaxed',
            //mobile
            'text-[17px] mt-[16px] leading-[130%]',
            //tablet
            'md:text-[18px] md:leading-[100%]',
            //desktop
            'lg:text-[20px]',
          )}
        >
          나를 움직이게 하는 순간을 담아보세요
        </div>
      </div>

      {/* Disclaimer Text - 별도 위치 */}
      <div 
        className={classNames(
          'absolute flex justify-center items-center mix-blend-difference',
          //mobile
          'left-1/2 bottom-[124px] w-[256px] transform -translate-x-1/2',
          //tablet
          'md:top-[430px]',
          //desktop
          'lg:top-[480px]'
        )}
      >
        <div
          className={classNames(
            'text-center text-gray-200 font-medium capitalize leading-none',
            //mobile
            'text-[12px]',
            //tablet
            'md:text-[13px]',
            //desktop
            'lg:text-[14px]',
          )}
        >
          *업로드한 이미지는 데이터에 저장되지 않습니다
        </div>
      </div>

      {/* Upload Button */}
      <div 
        className={classNames(
          'absolute flex justify-center items-center',
          //mobile
          'left-1/2 bottom-[54px] transform -translate-x-1/2',
          //tablet
          'md:top-[450px]',
          //desktop
          'lg:top-[500px]'
        )}
      >
        <button
          onClick={handleUploadClick}
          className={classNames(
            'mix-blend-normal bg-neutral-800 rounded-[100px] inline-flex justify-center items-center gap-[5.11px] overflow-hidden transition-all duration-200 hover:bg-neutral-700',
            //mobile
            'w-[128px] h-[40px] px-[32px]',
            //tablet
            'md:w-[136px] md:h-[42px] md:px-[36px]',
            //desktop
            'lg:w-[144px] lg:h-[44px] lg:px-[36px]',
          )}
        >
          <div
            className={classNames(
              'text-white font-medium',
              //mobile
              'text-[16px]',
              //tablet
              'md:text-[17px]',
              //desktop
              'lg:text-[18px]',
            )}
          >
            Upload
          </div>
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

        .animate-float-up {
          animation: float-up 15s linear infinite;
        }
      `}</style>
    </div>
  )
}