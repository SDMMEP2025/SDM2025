'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DirectionsPage({ onBackClick }) {
  const [copied, setCopied] = useState(false)
  const address = '서울특별시 서초구 성촌길 33'

  const mapLink =
    'https://map.naver.com/p/directions/-/14140088.4127782,4504149.1985135,%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EC%84%9C%EC%9A%B8R%26D%EC%BA%A0%ED%8D%BC%EC%8A%A4A%ED%83%80%EC%9B%8C,1564943394,PLACE_POI/-/transit?c=15.00,0,0,0,dh'

  const handleCopyAddress = async () => {
    // navigator.clipboard가 없는 환경 대비
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
      } catch (err) {
        console.error('Clipboard API 실패:', err)
      }
    }

    const textArea = document.createElement('textarea')
    textArea.value = address
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (fallbackErr) {
      console.error('폴백 복사도 실패:', fallbackErr)
    }

    document.body.removeChild(textArea)
  }

  return (
    <div className='absolute top-0 h-[100dvh] w-[100vw] flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-500 z-10'>
      <div className='w-full max-w-5xl px-8 py-16 flex flex-col items-center text-black gap-[70px] md:gap-[83px] md:landscape:gap-[75px] lg:gap-[69px]'>
        <h1 className='justify-center text-neutral-800 text-xl font-medium leading-loose'>Directions</h1>

        <div className='flex flex-col gap-[40px] md:gap-[74px] md:landscape:gap-[82px] lg:gap-[66px]'>
          <img src='/images/map.svg' className='block md:hidden' />
          <img src='/images/map-md.svg' className='hidden md:block lg:hidden landscape:hidden' />
          <img src='/images/map-landscape.svg' className='hidden landscape:md:block landscape:lg:hidden' />
          <img src='/images/map-lg.svg' className='hidden lg:block' />

          <div className='flex flex-col justify-start items-center gap-3'>
            <button
              onClick={handleCopyAddress}
              className='flex items-center gap-2 w-fit justify-center p-2 transition-colors duration-200'
            >
              <span className="text-center justify-center text-neutral-800 text-base lg:text-lg font-normal md:font-medium font-['Pretendard'] underline leading-7">
                {address}
              </span>
              <div className='w-4 h-4 relative'>
                <div className='w-2.5 h-3.5 left-[5.64px] top-[0.50px] absolute bg-black/50 rounded-[0.66px]' />
                <div className='w-2.5 h-3.5 left-[3px] top-[3.80px] absolute bg-neutral-800 rounded-[0.66px]' />
              </div>
            </button>

            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className='absolute bottom-72 md:bottom-64 lg:bottom-56 text-sm text-white font-regular bg-black px-3 py-1 flex items-center gap-2 rounded-md'
                >
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' className='text-white'>
                    <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='currentColor' />
                    <path
                      d='m9 12 2 2 4-4'
                      stroke='black'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  복사되었습니다.
                </motion.div>
              )}
            </AnimatePresence>

            <a
              href={mapLink}
              target='_blank'
              rel='noopener noreferrer'
              className="text-center justify-start text-neutral-800 text-base lg:text-lg font-normal md:font-medium font-['Pretendard'] underline leading-7"
            >
              길 찾기
            </a>
            <button
              onClick={onBackClick}
              className='absolute top-2 left-2 text-center justify-start text-neutral-800 text-base lg:text-lg font-normal md:font-medium leading-7'
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}