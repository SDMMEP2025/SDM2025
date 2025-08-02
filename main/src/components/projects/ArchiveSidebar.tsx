'use client'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'

interface ArchiveSidebarProps {
  isVisible?: boolean
  currentPoint: any
  onExpandedChange?: (expanded: boolean) => void
}

export function ArchiveSidebar({ isVisible, currentPoint, onExpandedChange }: ArchiveSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  // 확장 상태가 변경될 때 부모에게 알림
  useEffect(() => {
    onExpandedChange?.(isExpanded)
  }, [isExpanded, onExpandedChange])

  const handleClose = () => {
    setIsExpanded(false)
  }

  const handleExpand = () => {
    setIsExpanded(true)
  }

  //사이드바가 확장되면 사이트 전체 스크롤을 비활성화
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isExpanded])

  const [isAnimating, setIsAnimating] = useState(false)

  // 애니메이션 시작 전에 높이 미리 설정
  const handleToggle = () => {
    if (!isExpanded) {
      setIsAnimating(true)
      // 먼저 높이를 설정하고
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
      {/* Desktop & Tablet (768px 이상) */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          x: 0,
          width: isExpanded ? '396px' : '54px',
        }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
        className={`hidden md:flex w-fit h-[calc(100vh-80px)] bg-white fixed right-0 z-[000] flex-col items-center justify-center`}
        style={{
          position: 'fixed',
          top: '80px',
          right: '0',
          height: 'calc(100vh - 80px)',
        }}
      >
        {!isExpanded ? (
          <div
            className='w-[54px] h-full px-3.5 py-0 md:py-[18px] lg:py-0 cursor-pointer flex justify-center items-center md:items-start lg:items-center'
            onClick={handleExpand}
          >
            <div className='writingMode-vertical-lr text-sm md:text-base lg:text-lg text-black font-semibold leading-relaxed md:hover:opacity-70 active:scale-105 transition-all'>
              Process Archive
            </div>
          </div>
        ) : (
          <div className='w-[396px] h-full overflow-y-scroll flex flex-col items-center justify-between'>
            {/* Header */}
            <div className='w-full h-fit lg:mt-[0px] sticky z-10 top-0 bg-white flex flex-row items-center justify-between px-4 py-5'>
              <span className=' text-black text-lg font-semibold leading-[1.5] tracking-[]'>Process Archive</span>
              <button
                onClick={handleClose}
                className='w-6 h-6 relative flex items-center justify-center cursor-pointer md:hover:opacity-70 active:scale-105 transition-all duration-300 ease-in-out'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-full aspect-square'
                  viewBox='0 0 24 25'
                  fill='none'
                >
                  <path
                    d='M19 6.91L17.59 5.5L12 11.09L6.41 5.5L5 6.91L10.59 12.5L5 18.09L6.41 19.5L12 13.91L17.59 19.5L19 18.09L13.41 12.5L19 6.91Z'
                    fill='#222222'
                  />
                </svg>
              </button>
            </div>
            {/* Content */}
            <div className='w-full h-fit flex flex-col gap-1 items-start p-4'>
              {currentPoint?.images?.map((image, index) => (
                <div
                  key={index}
                  className={`w-full h-fit flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <HoverImageCard index={index} src={image} />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Mobile (768px 미만) */}
      <motion.div
        ref={mobileScrollRef}
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: 0,
          maxHeight: isExpanded ? 'calc(100dvh - 58px)' : '80px',
        }}
        exit={{
          opacity: 0,
          y: 100,
        }}
        transition={{ duration: 0.3 }}
        className='md:hidden w-full bg-white overflow-y-scroll fixed bottom-0 left-0 z-20 flex flex-col items-center justify-start '
      >
        {/* Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className='w-full h-fit sticky z-10 top-0 bg-white flex flex-row items-center justify-between px-4 py-5 cursor-pointer'
        >
          <span className=' text-black text-[18px] font-semibold leading-[1.5] tracking-[-0.36px]'>
            Process Archive
          </span>
          <button className='w-6 h-6 relative flex items-center justify-center cursor-pointer md:hover:opacity-70 active:scale-105 transition-all duration-300 ease-in-out'>
            {isExpanded ? (
              <svg xmlns='http://www.w3.org/2000/svg' className='w-full aspect-square' viewBox='0 0 24 25' fill='none'>
                <path
                  d='M19 6.91L17.59 5.5L12 11.09L6.41 5.5L5 6.91L10.59 12.5L5 18.09L6.41 19.5L12 13.91L17.59 19.5L19 18.09L13.41 12.5L19 6.91Z'
                  fill='#222222'
                />
              </svg>
            ) : (
              <svg xmlns='http://www.w3.org/2000/svg' className='w-3' viewBox='0 0 12 8' fill='none'>
                <path d='M10.59 8L6 3.42L1.41 8L-1.23266e-07 6.59L6 0.590001L12 6.59L10.59 8Z' fill='#222222' />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className='w-full flex flex-col gap-1 items-start p-4'>
            {currentPoint?.images?.map((image, index) => (
              <div
                key={index}
                className={`w-full h-fit flex items-start ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <HoverImageCard index={index} src={image} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  )
}

const HoverImageCard = ({ index, src }: { index: number; src: string }) => {
  const [isHover, setIsHover] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    amount: 0.1, // 10%가 보일 때 inView 상태 변경
    once: false, // 한번만 감지하지 않도록 설정
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
      {/* hover overlay dim */}
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
              <div className='w-[18px] h-[18px] bg-white rounded-full' />
              <div className='justify-start text-white text-lg font-semibold capitalize tracking-[-0.36px] leading-[1.5]'>
                form study
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* image */}
      <img src={src} alt={src} className='w-full h-auto group-hover:scale-105 transition-all duration-200' />
    </motion.div>
  )
}
