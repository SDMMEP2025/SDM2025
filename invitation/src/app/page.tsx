'use client'
import { Footer } from '@/components/projects'
import RotatedPaperDemo from '@/components/projects/RotatedPaperDemo'
import DirectionsPage from '@/components/projects/DirectionsPage'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import LottieBackground from '@/components/LottieBackground'

import backgroundAnimation from '@/animation/main.json'

export default function Page() {
  const [showDirections, setShowDirections] = useState(false)
  const [displayName, setDisplayName] = useState('김삼성')
  const [isMobile, setIsMobile] = useState(false)
  const [isMotionPanelOpen, setIsMotionPanelOpen] = useState(false)
  const [showGyroButton, setShowGyroButton] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent
      const mobileRegex = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isMobileDevice = mobileRegex.test(userAgent) || isTouch
      
      setIsMobile(isMobileDevice)
      
      if (isMobileDevice) {
        setShowGyroButton(true)
      }
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const nameFromUrl = urlParams.get('to')

    if (nameFromUrl) {
      const decodedName = decodeURIComponent(nameFromUrl)
      setDisplayName(decodedName)
    }
  }, [])

  useEffect(() => {
    const handleURLChange = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const nameFromUrl = urlParams.get('to')

      if (nameFromUrl) {
        const decodedName = decodeURIComponent(nameFromUrl)
        setDisplayName(decodedName)
      } else {
        setDisplayName('김삼성')
      }
    }

    window.addEventListener('popstate', handleURLChange)

    return () => {
      window.removeEventListener('popstate', handleURLChange)
    }
  }, [])

  const handleGyroButtonStateChange = (isVisible) => {
    setShowGyroButton(isVisible)
  }

  return (
    <>
      <style jsx global>{`
        body:has(.motion-modal) .footer-container {
          z-index: -1;
        }

        .motion-modal {
          z-index: 9999 !important;
        }
      `}</style>

      <div
        className='overflow-hidden relative'
        style={{
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        {!isMobile && (
          <LottieBackground animationData={backgroundAnimation} loop={true} autoplay={true} rotateOnMobile={true} />
        )}

        <div className='relative z-10'>
          <AnimatePresence mode='wait'>
            {!showDirections ? (
              <motion.div
                key='rotated-paper'
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: 'easeInOut' }}
              >
                <RotatedPaperDemo 
                  onDirectionsClick={() => setShowDirections(true)} 
                  displayName={displayName}
                  onMotionPanelToggle={setIsMotionPanelOpen}
                  onGyroButtonStateChange={handleGyroButtonStateChange}
                />
              </motion.div>
            ) : (
              <motion.div
                key='directions'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <DirectionsPage onBackClick={() => setShowDirections(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isMobile && showGyroButton && !isMotionPanelOpen && (
        <div className='footer-container absolute mix-blend-difference bottom-0 w-[100vw]'>
          <Footer />
        </div>
      )}
    </>
  )
}