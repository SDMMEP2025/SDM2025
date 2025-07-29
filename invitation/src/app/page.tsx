'use client'
import {
  Footer,
  MediaContainer,
} from '@/components/projects'
import RotatedPaperDemo from '@/components/projects/RotatedPaperDemo'
import DirectionsPage from '@/components/projects/DirectionsPage'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

export default function Page() {
  const [showDirections, setShowDirections] = useState(false)

  return (
    <>
      <div className='w-[100dvw] h-[100dvh] overflow-hidden'>
        <MediaContainer type='video' src='https://player.vimeo.com/video/844128999' alt='이곳에 비디오를' />
        
        <AnimatePresence mode="wait">
          {!showDirections ? (
            <motion.div
              key="rotated-paper"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            >
              <RotatedPaperDemo onDirectionsClick={() => setShowDirections(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="directions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <DirectionsPage onBackClick={() => setShowDirections(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <Footer />
      </div>
    </>
  )
}