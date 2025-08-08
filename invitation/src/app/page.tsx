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
  const [isGyroPopupVisible, setIsGyroPopupVisible] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent
      const mobileRegex = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i
      setIsMobile(mobileRegex.test(userAgent))
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // URL 파라미터에서 이름 읽기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const nameFromUrl = urlParams.get('to')

    if (nameFromUrl) {
      // URL 디코딩 (한글 등의 특수문자 처리)
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
        setDisplayName('김삼성') // 파라미터가 없으면 기본값
      }
    }

    // popstate 이벤트 리스너 (뒤로가기/앞으로가기 버튼)
    window.addEventListener('popstate', handleURLChange)

    return () => {
      window.removeEventListener('popstate', handleURLChange)
    }
  }, [])

  return (
    <>
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
                  onGyroPopupToggle={(visible) => setIsGyroPopupVisible(visible)}
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
      {!isMobile || (isMobile && !isGyroPopupVisible) || (
        <div className='footer-container fixed bottom-0 w-screen z-[9999] pointer-events-none'>
          <Footer />
        </div>
      )}
    </>
  )
}
