'use client'
import { Footer } from '@/components/projects'
import RotatedPaperDemo from '@/components/projects/RotatedPaperDemo'
import DirectionsPage from '@/components/projects/DirectionsPage'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import LottieBackground from '@/components/LottieBackground'

import backgroundAnimation from '@/animation/main.json'
import { useIsLandscape } from '@/hooks/useIsLandscape'
import { useIsPhone } from '@/hooks/useIsPhone'

export default function Page() {
  const [showDirections, setShowDirections] = useState(false)
  const [displayName, setDisplayName] = useState('김삼성')
  const [isMobile, setIsMobile] = useState(false)
  const [isMotionPanelOpen, setIsMotionPanelOpen] = useState(false)
  const [isGyroPopupVisible, setIsGyroPopupVisible] = useState(false)
  const [useLottie, setUseLottie] = useState(false)
  const isLandscape = useIsLandscape()
  const isPhone = useIsPhone({ cutoff: 768 })

  // console.log(navigator.userAgent)
  // console.log(isMobile)
  // console.log(isLandscape)

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
        setDisplayName('김삼성') // 파라미터가 없으면 기본값
      }
    }

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
        {(!isMobile || (isMobile && useLottie)) && (
          <LottieBackground animationData={backgroundAnimation} loop={true} autoplay={true} forceRotate90={false} />
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
                  onGyroFallback={(fallback) => {
                    setUseLottie(fallback)
                    if (fallback) setIsGyroPopupVisible(false)
                  }}
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
      {(!isPhone || (isMobile && isGyroPopupVisible)) && (
        <div className='footer-container mix-blend-difference fixed bottom-0 w-screen z-[9999]'>
          <Footer />
        </div>
      )}
      {isPhone && isLandscape && (
        <div className='fixed inset-0 z-[100000] bg-black text-white flex flex-col items-center justify-center p-8 text-center'>
          <img className='pb-[20px]' src='/images/icon-error.svg' />
          <p className='text-[24px] font-bold mb-2'>해당 서비스는 세로 모드 전용입니다</p>
          <p className='text-[17px] text-[#CFCFCF]'>가로 모드에서는 일부 콘텐츠가 보이지 않을 수 있어요</p>
        </div>
      )}
    </>
  )
}
