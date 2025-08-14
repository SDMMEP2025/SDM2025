'use client'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'

const PANEL_W = 396
const TAB_W = 54
const HIDDEN_OFFSET = PANEL_W - TAB_W

const CUT_TOP_DESKTOP = 65
const CUT_TOP_MOBILE = 58

interface ArchiveSidebarProps {
  isVisible?: boolean
  currentPoint: any
  onExpandedChange?: (expanded: boolean) => void
  color?: string
}

export function ArchiveSidebar({ isVisible, currentPoint, onExpandedChange, color = 'white' }: ArchiveSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onExpandedChange?.(isExpanded)
  }, [isExpanded, onExpandedChange])

  const handleClose = () => {
    setIsExpanded(false)
  }

  const handleExpand = () => {
    setIsExpanded(true)
  }

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isExpanded])

  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    if (!isExpanded) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsExpanded(true)
        setIsAnimating(false)
      }, 50)
    } else {
      setIsExpanded(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: HIDDEN_OFFSET }}
        animate={{
          opacity: isVisible ? 1 : 0,
          x: isExpanded ? 0 : HIDDEN_OFFSET,
        }}
        exit={{ opacity: 0, x: HIDDEN_OFFSET }}
        transition={{ duration: 0.3 }}
        className={`hidden md:flex w-[396px] h-[calc(100vh-80px)] bg-white/50 backdrop-blur-md fixed right-0 z-[000] flex-col`}
        style={{
          position: 'fixed',
          top: '150px',
          right: '0',
          height: 'calc(100vh - 150px)',
        }}
      >
        <div className='w-[396px] h-full flex flex-row items-start '>
          <div
            className='left-0 w-[54px] h-full px-3.5 py-0 md:py-[18px] lg:py-0 cursor-pointer flex justify-center items-center md:items-start lg:items-start'
            onClick={handleExpand}
          >
            <div className='absolute writingMode-vertical-lr pt-12 text-sm md:text-base lg:text-lg text-zinc-600 font-semibold leading-relaxed md:hover:opacity-70 active:scale-105 transition-all'>
              Process Archive
            </div>
          </div>
          <div className='w-full overflow-y-scroll  h-full pr-[16px] md:mt-[65px] md:pb-[65px] lg:mt-12 lg:pb-12 flex flex-col gap-1 items-start'>
            {currentPoint?.images?.map((image, index) => (
              <div
                key={index}
                className={`w-full h-fit flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <HoverImageCard index={index} src={image} />
              </div>
            ))}
          </div>
          <button
            onClick={handleClose}
            className='absolute top-[16px] right-[16px] w-6 h-6 flex items-center justify-center cursor-pointer md:hover:opacity-70 active:scale-105 transition-all duration-300 ease-in-out'
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='w-full aspect-square' viewBox='0 0 24 25' fill='none'>
              <path
                d='M19 6.91L17.59 5.5L12 11.09L6.41 5.5L5 6.91L10.59 12.5L5 18.09L6.41 19.5L12 13.91L17.59 19.5L19 18.09L13.41 12.5L19 6.91Z'
                fill='##4B4F57'
              />
            </svg>
          </button>
        </div>
      </motion.div>

      <motion.div
        ref={mobileScrollRef}
        initial={{ y: '100%', opacity: 0 }}
        animate={{
          y: isVisible ? (isExpanded ? '0%' : `calc(100% - ${CUT_TOP_MOBILE}px)`) : '100%',
          opacity: isVisible ? 1 : 0,
        }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
        className='md:hidden fixed bottom-0 left-0 right-0 z-50 w-full backdrop-blur-md'
        style={{
          maxHeight: '100dvh',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className='w-full sticky top-0 z-10 backdrop-blur-md bg-white/50 flex items-center justify-between px-4'
          style={{ height: `${CUT_TOP_MOBILE}px` }}
        >
          <span className='text-[#4B4F57] text-[18px] font-semibold leading-[1.5] tracking-[-0.36px]'>Process Archive</span>
          <button
            aria-label={isExpanded ? 'Close' : 'Open'}
            className='w-6 h-6 relative flex items-center justify-center cursor-pointer active:scale-95 transition-all'
          >
            {isExpanded ? (
              <svg xmlns='http://www.w3.org/2000/svg' className='w-full aspect-square' viewBox='0 0 24 25' fill='none'>
                <path
                  d='M19 6.91L17.59 5.5L12 11.09L6.41 5.5L5 6.91L10.59 12.5L5 18.09L6.41 19.5L12 13.91L17.59 19.5L19 18.09L13.41 12.5L19 6.91Z'
                  fill='#4B4F57'
                />
              </svg>
            ) : (
              <svg xmlns='http://www.w3.org/2000/svg' className='w-3' viewBox='0 0 12 8' fill='none'>
                <path d='M10.59 8L6 3.42L1.41 8L0 6.59L6 .59L12 6.59 10.59 8Z' fill='#222222' />
              </svg>
            )}
          </button>
        </div>

        <div
          className='w-full px-4 pb-[env(safe-area-inset-bottom)] bg-white/50'
          style={{
            maxHeight: `calc(100dvh - ${CUT_TOP_MOBILE}px)`,
            overflowY: 'auto',
          }}
        >
          <div className='w-full flex flex-col gap-1 items-start'>
            {currentPoint?.images?.map((image, index) => (
              <div
                key={index}
                className={`w-full h-fit flex items-start ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <HoverImageCard index={index} src={image} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

const HoverImageCard = ({ index, src }: { index: number; src: string }) => {
  const [isHover, setIsHover] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    amount: 0.1,
    once: false,
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      ref={ref}
      onHoverStart={() => {
        setIsHover(true)
      }}
      onHoverEnd={() => {
        setIsHover(false)
      }}
      className='w-[90%] h-auto cursor-pointer z-0 relative group overflow-hidden'
    >
      <AnimatePresence>
        {isHover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='absolute z-10 inset-0 bg-black/50 transition-opacity duration-300 ease-in-out'
          >
            <div className='absolute flex flex-row justify-center items-center gap-2 top-10 right-4'>
              <div className='w-[18px] h-[18px] rounded-full' />
              <div className='justify-start text-white text-lg font-semibold capitalize tracking-[-0.36px] leading-[1.5]'>
                form study
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <img src={src} alt={src} className='w-full h-auto group-hover:scale-105 transition-all duration-200' />
    </motion.div>
  )
}
