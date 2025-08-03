'use client'
import {
  Footer,
} from '@/components/projects'
import RotatedPaperDemo from '@/components/projects/RotatedPaperDemo'
import DirectionsPage from '@/components/projects/DirectionsPage'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import LottieBackground from '@/components/LottieBackground'

import backgroundAnimation from '@/animation/main.json'

export default function Page() {
  const [showDirections, setShowDirections] = useState(false)
  const [displayName, setDisplayName] = useState('김삼성') // 기본값

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

  // URL 변경 시 실시간 업데이트를 위한 이벤트 리스너
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
          left: 0
        }}
      >
        {/* Lottie 배경 */}
        <LottieBackground 
          animationData={backgroundAnimation}
          loop={true}
          autoplay={true}
          rotateOnMobile={true}
        />
        
        {/* 컨텐츠들을 z-index로 앞으로 */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {!showDirections ? (
              <motion.div
                key="rotated-paper"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <RotatedPaperDemo 
                  onDirectionsClick={() => setShowDirections(true)} 
                  displayName={displayName} // 동적 이름 전달
                />
              </motion.div>
            ) : (
              <motion.div
                key="directions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <DirectionsPage 
                  onBackClick={() => setShowDirections(false)} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="absolute z-10 bottom-0 w-full">
          <Footer />
        </div>
      </div>
    </>
  )
}