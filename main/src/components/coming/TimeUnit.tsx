'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function TimeUnit({ value }: { value: number }) {
  const formattedValue = String(value).padStart(2, '0')
  const digits = formattedValue.split('')

  return (
    <div className="flex text-center justify-center text-neutral-800 font-english font-normal leading-[288.20px] mx-2 lg:text-[18vw] font-bold tracking-[-0.02em]">
      {digits.map((digit, index) => {
        const delay = index === 0 ? 0.6 : 0
        
        return (
          <div key={index} className='relative w-[10vw] lg:h-[18vw] flex items-center justify-center '>
            <AnimatePresence mode='wait'>
              <motion.div
                key={`${index}-${digit}`}
                initial={{ y: '-50%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '0%', opacity: 1 }}
                transition={{
                  type: 'tween',
                  ease: [0.25, 0.46, 0.45, 0.94],
                  duration: 0.9,
                  delay: delay,
                }}
                className='absolute h-fit flex items-center justify-center'
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