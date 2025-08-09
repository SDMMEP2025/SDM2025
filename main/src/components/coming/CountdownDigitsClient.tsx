'use client'

import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import TimeUnit from './TimeUnit'
import Colon from './Colon'
import { CountdownBars } from './CountdownBars'

dayjs.extend(utc)
dayjs.extend(timezone)

export interface CountdownDigitsProps {
  targetISO: string 
  tz?: string
  showBars?: boolean
  className?: string
  colonClassName?: string
}

export default function CountdownDigits({
  targetISO,
  tz = 'Asia/Seoul',
  showBars = true,
  className = '',
  colonClassName = 'mb-[1vw] w-[2vw] mx-[10px] md:w-[2vw] lg:mx-[1vw] lg:w-[2vw]',
}: CountdownDigitsProps) {
  const targetDate = useMemo(() => dayjs.tz(targetISO, tz), [targetISO, tz])

  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, targetDate.diff(dayjs(), 'second'))
  )

  useEffect(() => {
    const tick = () => setSecondsLeft(Math.max(0, targetDate.diff(dayjs(), 'second')))
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const days = Math.floor(secondsLeft / (60 * 60 * 24))
  const hours = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((secondsLeft % (60 * 60)) / 60)
  const seconds = secondsLeft % 60

  return (
    <>
      <div className={`px-[22dvh] h-[clamp(10px,34vw, 50px)] md-landscape-coming:h-[22dvw] lg:h-[20dvw] md-landscape-coming:px-[24px] lg:px-[27px] pt-[clamp(10px,15vw,45px)] md:pt-[20vw] md-landscape-coming:pt-[5rem] lg:pt-[5rem] flex w-full justify-center items-center gap-1 md:gap-2 ${className}`}>
        <TimeUnit value={days} className='md:flex-1' />
        <Colon className={colonClassName} />
        <TimeUnit value={hours} className='md:flex-1' />
        <Colon className={colonClassName} />
        <TimeUnit value={minutes} className='md:flex-1' />
        <Colon className={colonClassName} />
        <TimeUnit value={seconds} className='mdLflex-1' />
      </div>

      {showBars && (
        <div className='h-[50dvw] md-landscape-coming:h-[50dvh] lg:h-[50dvh] z-10'>
          <CountdownBars />
        </div>
      )}
    </>
  )
}
