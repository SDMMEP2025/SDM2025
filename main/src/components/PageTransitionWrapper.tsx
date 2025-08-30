'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useRef, useState } from 'react'
import textAnim from '@/animation/text_transition.json'
import Lottie from 'lottie-react'

interface PageTransitionWrapperProps {
  children: ReactNode
  isTransitioning: boolean
  pathname?: string
  aboutPageLoaded?: boolean
}

export function PageTransitionWrapper({
  children,
  isTransitioning,
  pathname,
  aboutPageLoaded = false,
}: PageTransitionWrapperProps) {
  const textLines = ['Steady', 'Movement For', 'Progress']
  const [animationComplete, setAnimationComplete] = useState(!isTransitioning)

  const unlockRef = useRef<null | (() => void)>(null)
  useEffect(() => {
    if (!isTransitioning) {
      if (unlockRef.current) {
        unlockRef.current()
        unlockRef.current = null
      }
      return
    }
    const body = document.body
    const docEl = document.documentElement
    const scrollY = window.scrollY || window.pageYOffset || 0
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      overscrollBehaviorY: body.style.overscrollBehaviorY,
      touchAction: body.style.touchAction,
    }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    body.style.overscrollBehaviorY = 'contain'
    body.style.touchAction = 'none'
    const prevDocOverflow = docEl.style.overflow
    docEl.style.overflow = 'hidden'
    unlockRef.current = () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.width = prev.width
      body.style.overflow = prev.overflow
      body.style.overscrollBehaviorY = prev.overscrollBehaviorY
      body.style.touchAction = prev.touchAction
      docEl.style.overflow = prevDocOverflow
      const y = Math.abs(parseInt(prev.top || '0', 10)) || scrollY
      window.scrollTo(0, y)
    }
    return () => {
      if (unlockRef.current) {
        unlockRef.current()
        unlockRef.current = null
      }
    }
  }, [isTransitioning])

  const getBackgroundColor = () => {
    if (pathname?.startsWith('/projects') && pathname !== '/projects') {
      return 'bg-[#FF5E1F]'
    }
    return 'bg-[#FF60B9]'
  }

  useEffect(() => {
    if (isTransitioning) {
      setAnimationComplete(false)
    } else {
      setAnimationComplete(true)
    }
  }, [isTransitioning])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2, delayChildren: 0.4 },
    },
    exit: {
      transition: { staggerChildren: 0.15, staggerDirection: -1 },
    },
  }

  const lineVariants = {
    hidden: { y: 0, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      y: 0,
      opacity: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <>
      <AnimatePresence>
        {isTransitioning &&
          (pathname === '/about' ? (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 z-[9999] bg-white flex items-center justify-center'
              onWheel={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
            >
              <Lottie
                animationData={textAnim}
                loop={!aboutPageLoaded}
                autoplay
                className='w-full h-full'
                onComplete={() => {
                  if (aboutPageLoaded) setAnimationComplete(true)
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ padding: '0px', opacity: 1 }}
              animate={{ padding: '5vw', opacity: 1 }}
              exit={{ padding: '0px', opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              onAnimationComplete={() => setAnimationComplete(true)}
              className='fixed inset-0 z-[9999] bg-white flex items-center justify-center'
              onWheel={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
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
                      <div>{line}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
      </AnimatePresence>

      <AnimatePresence>
        {animationComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-hidden={isTransitioning}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
