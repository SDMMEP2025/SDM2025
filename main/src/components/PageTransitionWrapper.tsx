// PageTransitionWrapper.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import textAnim from '@/animation/text_transition.json'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'

interface PageTransitionWrapperProps {
  children: ReactNode
  isTransitioning: boolean
  pathname?: string
}

export function PageTransitionWrapper({ children, isTransitioning, pathname }: PageTransitionWrapperProps) {
  const textLines = ['Steady', 'Movement For', 'Progress']

  // 홈페이지이거나 전환 중이 아닐 때는 애니메이션이 완료된 것으로 시작
  const [animationComplete, setAnimationComplete] = useState(!isTransitioning)

  // pathname에 따른 배경색 결정
  const getBackgroundColor = () => {
    if (pathname?.startsWith('/projects') && pathname !== '/projects') {
      return 'bg-[#FF5E1F]' // projects 하위 페이지는 주황색
    }
    return 'bg-[#FF60B9]' // 기본 핑크색
  }

  // isTransitioning이 변경될 때 애니메이션 완료 상태 관리
  useEffect(() => {
    if (isTransitioning) {
      setAnimationComplete(false)
    } else {
      // 전환 중이 아닐 때는 바로 완료 상태로 설정 (홈페이지 등)
      setAnimationComplete(true)
    }
  }, [isTransitioning])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.15,
        staggerDirection: -1,
      },
    },
  }

  const lineVariants = {
    hidden: {
      y: 0,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      y: 0,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <>
      {/* 페이지 전환 커버 */}
      <AnimatePresence>
        {isTransitioning &&
          (pathname === '/about' ? (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 z-[9999] bg-white flex items-center justify-center'
            >
              <Lottie
                onComplete={() => setAnimationComplete(true)}
                animationData={textAnim}
                loop={false} // 한 번만 재생하도록 변경
                autoplay={true}
                className='w-full h-full'
              />
            </motion.div>
          ) : (
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
              <motion.div
                className={`${getBackgroundColor()} w-full h-full flex items-center justify-center overflow-hidden`}
              >
                <motion.div
                  variants={containerVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  className='text-center text-white text-3xl md:text-5xl font-semibold font-english leading-[1.1]'
                >
                  {textLines.map((line, index) => (
                    <motion.div key={index} variants={lineVariants}>
                      <div className=''>{line}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
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
