'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useMemo } from 'react'

interface TimeUnitProps {
  value: number
  className?: string
}

export default function TimeUnit({ value, className = '' }: TimeUnitProps) {
  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
  }, [])

  const formattedValue = useMemo(() => String(value).padStart(2, '0'), [value])
  const digits = formattedValue.split('')

  const prevDigitsRef = useRef<string[] | null>(null)
  const tensChanged =
    prevDigitsRef.current &&
    digits.length >= 2 &&
    prevDigitsRef.current.length >= 2 &&
    prevDigitsRef.current[digits.length - 2] !== digits[digits.length - 2]

  useEffect(() => {
    prevDigitsRef.current = digits
  }, [digits])

  return (
    <div className={`relative flex text-neutral-800 font-english font-normal font-bold tracking-[-0.02em] ${className}`}>
      {digits.map((digit, index) => {
        const tensIndex = digits.length - 2
        const onesIndex = digits.length - 1
        const isTens = index === tensIndex
        const isOnes = index === onesIndex
        let delay = 0
        const initialStyle = mountedRef.current ? { y: '-90%', opacity: 0.2 } : { y: '0%', opacity: 1 }

        return (
          <div
            key={index}
            className="relative flex 
            text-[clamp(40px,20vw,130px)] w-[clamp(32px,11vw,78px)]
            md:text-[clamp(130px,17vw,170px)] md:w-[clamp(80px,7dvh,110px)] 
            md-landscape-coming:text-[17vw] md-landscape-coming:w-[9vw] 
            lg:text-[17vw] lg:w-[46%] p-0 m-0"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${index}-${digit}`}
                initial={initialStyle}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '0%', opacity: 1 }}
                transition={{
                  type: 'tween',
                  ease: [0.15, 0.16,0.2, 0.94],
                  duration: 0.9,
                  delay,
                }}
                className="leading-none p-0 m-0 w-full text-center"
              >
                {digit}
              </motion.div>
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
