'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Footer } from '@/components/projects'
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
      <div className='w-full max-w-5xl px-8 py-16 flex flex-col items-center text-black gap-[clamp(70px,8.36dvh,83px)]'>
        <h1 className='justify-center text-neutral-800 text-[clamp(22px,1.5vw,38.5px)] font-medium leading-loose'>Directions</h1>

        <div className='flex flex-col gap-[clamp(40px,4.52dvh,115.75px)]'>
          <img src='/images/map.svg' className='block md:hidden' />
          <img src='/images/map-md.svg' className='hidden md:block lg:hidden' />
          <img src='/images/map-landscape.svg' className='hidden md-landscape:block lg:hidden' />
          <img src='/images/map-lg.svg' className='hidden lg:block w-[25.8vw]' />

          <div className='flex flex-col justify-start items-center gap-[0.145dvh]'>
            <button
              onClick={handleCopyAddress}
              className='flex items-center gap-1 w-fit justify-center p-2 transition-colors duration-200'
            >
              <span className="text-center justify-center text-neutral-800 text-[clamp(17px, 1.23vw, 31.5px)] font-normal md:font-medium font-['Pretendard'] underline leading-7">
                {address}
              </span>
              <div className='w-4 h-4 mb-1 relative'>
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
                  className='absolute bottom-72 md:bottom-64 lg:bottom-56 text-sm text-white font-regular bg-black px-3 py-1 flex items-center gap-3 rounded-md'
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
              className="text-center justify-start text-neutral-800 text-[clamp(17px, 1.23vw, 31.5px)] font-normal md:font-medium font-['Pretendard'] underline leading-7"
            >
              길 찾기
            </a>
            <button
              onClick={onBackClick}
              className='absolute top-4 right-4 md:top-9 md:right-9 text-center justify-start text-neutral-800 text-base lg:text-lg font-normal md:font-medium leading-7'
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36' fill='none'>
                <g clipPath='url(#clip0_2149_10465)'>
                  <path
                    d='M28.4961 9.6067L26.3811 7.4917L17.9961 15.8767L9.61109 7.4917L7.49609 9.6067L15.8811 17.9917L7.49609 26.3767L9.61109 28.4917L17.9961 20.1067L26.3811 28.4917L28.4961 26.3767L20.1111 17.9917L28.4961 9.6067Z'
                    fill='#222222'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_2149_10465'>
                    <rect width='36' height='36' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
