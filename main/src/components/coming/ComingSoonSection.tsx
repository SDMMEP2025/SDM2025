'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Header from '@/components/coming/Header'
import { Footer } from '@/components/coming/Footer'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import CountdownDigits from './CountdownDigitsClient'
import ClientOnly from './ClientOnly'
import { useIsLandscape } from '@/hooks/useIsLandscape'
import { useIsPhone } from '@/hooks/useIsPhone'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function ComingSoonSection() {
  const [mounted, setMounted] = useState(false)

  const targetDate = useMemo(() => dayjs.tz('2025-08-22 06:46:00', 'Asia/Seoul'), [])
  const [isHydrated, setIsHydrated] = useState(false)
  const isPhone = useIsPhone()
  const isLandscape = useIsLandscape()
  const showOverlay = isPhone && isLandscape

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, targetDate.diff(dayjs(), 'second')))

  useEffect(() => {
    const tick = () => {
      setSecondsLeft(Math.max(0, targetDate.diff(dayjs(), 'second')))
    }
    tick()

    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (secondsLeft <= 0) {
    return null 
  }

  return (
    <section className='w-[100vw] h-[100dvh] bg-[#FFF790] text-black relative overflow-hidden'>
      {showOverlay && (
         <div className='fixed inset-0 z-[100000] bg-black text-white flex flex-col items-center justify-center p-8 text-center'>
          <img className='pb-[20px]' src='/images/icon-error.svg' />
          <p className='text-[24px] font-bold mb-2'>해당 서비스는 세로 모드 전용입니다</p>
          <p className='text-[17px] text-[#CFCFCF]'>가로 모드에서는 일부 콘텐츠가 보이지 않을 수 있어요</p>
        </div>
      )}


      <div className='flex flex-col items-center bottom-0 '>
        <div className='flex flex-col top-1/2 justify-center items-center'>
          <div
            className='
              absolute flex
              rotate-90
              w-[100dvh] h-[35vw] bg-[#FFF790] z-10
              top-1/2 left-[85%]
              -translate-x-1/2 -translate-y-1/2
              
              md-landscape-coming:rotate-0
              md-landscape-coming:left-1/2
              md-landscape-coming:w-full
              md-landscape-coming:top-0
              md-landscape-coming:-translate-y-0 
              md-landscape-coming:h-[40dvh]
              lg:rotate-0
              lg:h-[35dvh]
              lg:-translate-y-0
              lg:left-1/2
              lg:top-0
              lg:w-full
              z-100
            '
          />
          <div
            className='
            absolute
          rotate-90
          w-[100dvh]
          top-1/2
          left-[31.5vw]
          transform -translate-y-1/2 -translate-x-1/2
          md:rotate-90
          md:left-[32.5vw]
          md-landscape-coming:left-1/2
          md-landscape-coming:rotate-0
          md-landscape-coming:w-full
          md-landscape-coming:mt-16 
          md-landscape-coming:top-2/3
          md-landscape-coming:pt-20
          lg:mt-24
          lg:top-2/3
          lg:rotate-0
          lg:left-1/2
          lg:w-full
          '
          >
            <ClientOnly>
              <CountdownDigits targetISO='2025-08-22 06:46:00' tz='Asia/Seoul' showBars />
            </ClientOnly>
          </div>
        </div>
        <div className='absolute flex justify-center top-0 left-0 w-full z-10'>
          <Header />
        </div>
        <div className='absolute flex justify-center bottom-0 mix-blend-difference left-0 w-full z-10 '>
          <Footer />
        </div>
      </div>
    </section>
  )
}
