// PageTransitionWrapper.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

interface PageTransitionWrapperProps {
  children: ReactNode
  isTransitioning: boolean
}

export function PageTransitionWrapper({ children, isTransitioning }: PageTransitionWrapperProps) {
  const textLines = ['Steady', 'Movement For', 'Progress']

  const [animationComplete, setAnimationComplete] = useState(false)

  // isTransitioning이 변경될 때 애니메이션 완료 상태 초기화
  useEffect(() => {
    if (isTransitioning) {
      setAnimationComplete(false)
    }
  }, [isTransitioning])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // 0.1 → 0.2
        delayChildren: 0.4, // 0.2 → 0.4
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.15, // 0.08 → 0.15
        staggerDirection: -1,
      },
    },
  }

  const lineVariants = {
    hidden: {
      y: 0, // 60 → 80 (더 아래에서 시작)
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3, // 0.5 → 0.8
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      y: 0, // -60 → -80 (더 위로 사라짐)
      opacity: 0,
      transition: {
        duration: 0.6, // 0.4 → 0.6
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <>
      {/* 페이지 전환 커버 */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{
              padding: '0px',
              opacity: 1,
            }}
            animate={{
              padding: '5vw',
              opacity: 1,
            }}
            exit={{
              padding: '0px', 
              opacity: 0,
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            onAnimationComplete={() => setAnimationComplete(true)}
            className='fixed inset-0 z-[9999] bg-white flex items-center justify-center'
          >
            <motion.div className='bg-[#FF60B9] w-full h-full flex items-center justify-center overflow-hidden'>
              <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                className='text-center text-white text-3xl md:text-5xl font-semibold font-english leading-[1.1]'
              >
                {textLines.map((line, index) => (
                  <motion.div key={index} variants={lineVariants} className='overflow-hidden'>
                    <div className=''>{line}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 페이지 콘텐츠 */}
      <AnimatePresence>
        {animationComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
