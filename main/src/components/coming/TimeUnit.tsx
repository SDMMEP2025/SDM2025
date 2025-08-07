'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface TimeUnitProps {
  value: number
  className?: string
}

export default function TimeUnit({ value, className = '' }: TimeUnitProps) {
  const formattedValue = String(value).padStart(2, '0')
  const digits = formattedValue.split('')

  return (
    <div className={`relative flex text-neutral-800 font-english font-normal font-bold tracking-[-0.02em] ${className}`}>
      {digits.map((digit, index) => {
        const delay = index === 0 ? 0.5 : 0

        return (
          <div
            key={index}
            className={`relative flex w-[12vw] md-landscape-coming:w-[9vw] lg:w-[45%] text-[22vw] md-landscape-coming:text-[17vw] lg:text-[17vw] p-0 m-0 ${index === 1 ? '' : ''}`}
          >
            {' '}
            <AnimatePresence mode='wait'>
              <motion.div
                key={`${index}-${digit}`}
                initial={{ y: '-90%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '0%', opacity: 1 }}
                transition={{
                  type: 'tween',
                  ease: [0.25, 0.46, 0.45, 0.94],
                  duration: 0.9,
                  delay: delay
                }}
                className='leading-none p-0 m-0 w-full text-center'
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