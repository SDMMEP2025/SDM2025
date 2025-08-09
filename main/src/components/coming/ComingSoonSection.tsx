'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Header from '@/components/coming/Header'
import { Footer } from '@/components/coming/Footer'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Colon from './Colon'
import TimeUnit from './TimeUnit'
import { CountdownBars } from './CountdownBars'
import dynamic from 'next/dynamic'
import type { CountdownDigitsProps } from '@/components/coming/CountdownDigits.client'

const CountdownDigits = dynamic<CountdownDigitsProps>(
  () => import('@/components/coming/CountdownDigits.client').then((m) => m.default),
  { ssr: false },
)

dayjs.extend(utc)
dayjs.extend(timezone)

export default function ComingSoonSection() {
  const [mounted, setMounted] = useState(false)

  const targetDate = useMemo(() => dayjs.tz('2025-08-22 00:00:00', 'Asia/Seoul'), [])
  const [isHydrated, setIsHydrated] = useState(false)
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

  const days = Math.floor(secondsLeft / (60 * 60 * 24))
  const hours = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((secondsLeft % (60 * 60)) / 60)
  const seconds = secondsLeft % 60

  return (
    <section className='w-[100vw] h-[100dvh] bg-[#FFF790] text-black relative overflow-hidden'>
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
          left-[32.5vw]
          transform -translate-y-1/2 -translate-x-1/2
          md:rotate-90
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
            <CountdownDigits targetISO='2025-08-22 00:00:00' tz='Asia/Seoul' showBars />
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
