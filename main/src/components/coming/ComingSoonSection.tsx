'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/coming/Header'
import { Footer } from '@/components/coming/Footer'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Colon from './Colon'
import TimeUnit from './TimeUnit'
import { CountdownBars } from './CountdownBars'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function ComingSoonSection() {
  const [mounted, setMounted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  const targetDate = dayjs.tz('2025-08-22 00:00:00', 'Asia/Seoul')

  useEffect(() => {
    setMounted(true)

    const calculateTime = () => {
      const diff = Math.max(0, targetDate.diff(dayjs(), 'second'))
      return diff
    }

    const initialDiff = calculateTime()
    setSecondsLeft(initialDiff)

    const timer = setInterval(() => {
      const diff = calculateTime()
      setSecondsLeft(diff)
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const days = Math.floor(secondsLeft / (60 * 60 * 24))
  const hours = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((secondsLeft % (60 * 60)) / 60)
  const seconds = secondsLeft % 60

  return (
    <section className='w-[100vw] h-[100dvh] bg-[#FFF790] text-black overflow-hidden relative'>
      <div className='flex flex-col items-center bottom-0 '>
        <div className='flex flex-col top-1/2 justify-center items-center'>
          <div className='
          absolute
          rotate-90 
          w-[100dvh]
          h-[14dvh]
          top-1/2
          left-[70dvw]
          bg-[#FFF790]
          transform -translate-y-1/2 -translate-x-1/2
           z-10
           md:rotate-0
           md:left-1/2
           md:w-full
           md:top-[35dvh]
           md:h-[20dvh]
           lg:h-[30dvh]
           lg:top-[25dvh]'
           />
          <div
            className='
            absolute
          rotate-90
          w-[100dvh]
          top-1/2
          left-[30dvw]
          transform -translate-y-1/2 -translate-x-1/2
          md:rotate-90
          md-landscape-coming:left-1/2
          md-landscape-coming:mt-24
          md-landscape-coming:rotate-0
          md-landscape-coming:w-full
          md-landscape-coming:mt-16 
          md-landscape-coming:top-2/3
          lg:mt-24
          lg:top-2/3
          lg:rotate-0
          lg:left-1/2
          lg:w-full
          '
          >
            <div className='px-[22dvh] h-[35dvw] md-landscape-coming:h-[20dvw] lg:h-[18dvw] md-landscape-coming:px-[24px] lg:px-[27px] pt-20 flex w-full md:w-full items-center justify-center '>
              <TimeUnit value={days} className='flex-1' />
              <Colon className='mb-[1vw] w-[2vw] mx-[10px] md:w-[2vw] lg:w-[2vw]' />
              <TimeUnit value={hours} className='flex-1' />
              <Colon className='mb-[1vw] w-[2vw] mx-[10px] md:w-[2vw] lg:w-[2vw]' />
              <TimeUnit value={minutes} className='flex-1' />
              <Colon className='mb-[1vw] w-[2vw] mx-[10px] md:w-[2vw] lg:w-[2vw]' />
              <TimeUnit value={seconds} className='flex-1' />
            </div>
            <div className='h-[50dvw] md-landscape-coming:h-[50dvh] lg:h-[50dvh] z-10'>
              <CountdownBars />
            </div>
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
