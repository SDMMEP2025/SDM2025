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
        className={`hidden fixed w-[396px] md:flex md:top-[150px] md:h-[calc(100dvh-150px)] lg:top-[80px] lg:h-[calc(100dvh-80px)] bg-white/50 backdrop-blur-md right-0 z-[000] `}
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
          <div className='w-full overflow-y-scroll  h-full pr-[16px] md:mt-[65px] md:pb-[90px] lg:mt-12 lg:pb-[80px] flex flex-col gap-1 items-start'>
            {currentPoint?.images?.map((image, index) => (
              <div
                key={index}
                className={`w-full h-fit flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <HoverImageCard
                  index={index}
                  src={typeof image === 'string' ? image : image.src}
                  label={
                    currentPoint?.labels?.[index] ?? (typeof image !== 'string' ? image.label : undefined) ?? 'archive'
                  }
                />
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
                fill='#222'
              />
            </svg>
          </button>
        </div>
      </motion.div>

      <motion.div
        ref={mobileScrollRef}
        initial={false}
        animate={!isVisible ? 'hidden' : isExpanded ? 'open' : 'collapsed'}
        variants={{
          hidden: { y: '100%', opacity: 0 },
          collapsed: { y: `calc(100% - ${CUT_TOP_MOBILE}px)`, opacity: 1 },
          open: { y: '0%', opacity: 1 },
        }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
        className='md:hidden fixed bottom-0 left-0 right-0 z-50 w-full backdrop-blur-md '
      >
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className='w-full sticky top-0 z-10 backdrop-blur-md flex items-center justify-between px-4 bg-white/50 '
          style={{ height: `${CUT_TOP_MOBILE}px` }}
        >
          <span className='text-[#4B4F57] text-[18px] font-semibold leading-[1.5] tracking-[-0.36px]'>
            Process Archive
          </span>
          <button
            aria-label={isExpanded ? 'Close' : 'Open'}
            className='w-6 h-6 relative flex items-center justify-center cursor-pointer active:scale-95 transition-all'
          >
            {isExpanded ? (
              <svg xmlns='http://www.w3.org/2000/svg' className='w-full aspect-square' viewBox='0 0 24 25' fill='none'>
                <path
                  d='M19 6.91L17.59 5.5L12 11.09L6.41 5.5L5 6.91L10.59 12.5L5 18.09L6.41 19.5L12 13.91L17.59 19.5L19 18.09L13.41 12.5L19 6.91Z'
                  fill='#222222'
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
          <div className='w-full flex flex-col gap-1 items-start pb-4'>
            {currentPoint?.images?.map((image, index) => (
              <div
                key={index}
                className={`w-full h-fit flex items-start ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <HoverImageCard
                  index={index}
                  src={typeof image === 'string' ? image : image.src}
                  label={
                    currentPoint?.labels?.[index] ?? (typeof image !== 'string' ? image.label : undefined) ?? 'archive'
                  }
                  isMobile={true}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

const HoverImageCard = ({
  index,
  src,
  label,
  isMobile = false,
}: {
  index: number
  src: string
  label?: string
  isMobile?: boolean
}) => {
  const [isHover, setIsHover] = useState(false)
  const [pressed, setPressed] = useState(false) // 모바일 토글 상태
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [lblSize, setLblSize] = useState({ w: 0, h: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const lblRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.1, once: false })

  const isEven = index % 2 === 0
  const active = isMobile ? pressed : isHover

  useEffect(() => {
    if (!lblRef.current) return
    const rect = lblRef.current.getBoundingClientRect()
    setLblSize({ w: rect.width, h: rect.height })
  }, [label])

  // ★ 모바일: 탭으로 토글
  const handleToggleMobile = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) return
    e.preventDefault()
    setPressed((v) => !v)
  }

  // 데스크탑: hover tracking
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!ref.current) return
    const wrap = ref.current.getBoundingClientRect()
    let x = e.clientX - wrap.left
    let y = e.clientY - wrap.top
    const halfW = lblSize.w / 2
    const halfH = lblSize.h / 2
    x = Math.max(halfW + 2, Math.min(wrap.width - halfW - 2, x))
    y = Math.max(halfH + 2, Math.min(wrap.height - halfH - 2, y))
    setMouse({ x, y })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className='w-full h-auto z-0'
    >
      <div
        ref={ref}
        className={[
          'relative w-[90%] h-auto overflow-hidden select-none touch-manipulation',
          isEven ? 'ml-auto' : 'mr-auto',
          'md:cursor-none cursor-pointer',
        ].join(' ')}
        onClick={handleToggleMobile}
        onMouseEnter={() => !isMobile && setIsHover(true)}
        onMouseLeave={() => !isMobile && setIsHover(false)}
        onMouseMove={(e) => !isMobile && onMouseMove(e)}
        role='button'
        aria-pressed={active}
      >
        <motion.img
          src={src}
          alt={src}
          className='w-full h-auto block'
          style={{ transformOrigin: 'center' }}
          animate={{ scale: active ? 1.06 : 1 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          whileTap={{ scale: 1.08 }}
          draggable={false}
        />
        {isMobile && pressed && <div className='absolute inset-0 bg-black/20' />}

        <AnimatePresence>
          {isMobile && pressed && (
            <motion.div
              key='overlay-mobile'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className='pointer-events-none absolute inset-0 z-20 mix-blend-difference'
            >
              <div
                className={['absolute top-3 flex flex-row items-center gap-2', isEven ? 'left-3' : 'right-3'].join(' ')}
              >
                <div className='w-[18px] h-[18px] rounded-full bg-white ' />
                <div className='text-white text-[18px] font-medium capitalize tracking-[-0.36px] leading-[1.5]'>
                  {label ?? 'archive'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 데스크탑: 커서 팔로워 (점 + 텍스트) */}
        <AnimatePresence>
          {!isMobile && isHover && (
            <motion.div
              key='cursor-label'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className='pointer-events-none absolute inset-0 z-20 mix-blend-difference'
            >
              <div
                ref={lblRef}
                className='absolute flex items-center gap-2 whitespace-nowrap'
                style={{
                  left: mouse.x,
                  top: mouse.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className='w-[18px] h-[18px] rounded-full bg-white' />
                <span className='text-white text-[18px] font-medium capitalize tracking-[-0.36px] leading-[1.5]'>
                  {label ?? 'archive'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
