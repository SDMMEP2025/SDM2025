'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

export function ProjectCard({ projects, setIndex, index }) {
  const total = projects.length
  const boundingBox = useRef<HTMLDivElement>(null)
  const [boundingBoxWidth, setBoundingBoxWidth] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const desktopImageRatio = 1920 / 1080
  const tabletImageRatio = 666 / 486
  const mobileImageRatio = 358 / 446

  // 클라이언트 사이드에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true)
    
    // 모바일 디바이스 감지
    const checkIfMobile = () => {
      const isMobileDevice = window.innerWidth < 768 // md 브레이크포인트
      setIsMobile(isMobileDevice)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // boundingBox 크기를 추적
  useEffect(() => {
    const updateWidth = () => {
      if (boundingBox.current) {
        const width = boundingBox.current.getBoundingClientRect().width
        setBoundingBoxWidth(width)
      }
    }

    // 초기 크기 설정
    updateWidth()

    // 윈도우 리사이즈 시 크기 업데이트
    window.addEventListener('resize', updateWidth)

    // 이미지 로딩 완료 후에도 크기 재계산 (폰트 로딩이나 다른 요소들 때문에)
    const timer = setTimeout(updateWidth, 100)

    return () => {
      window.removeEventListener('resize', updateWidth)
      clearTimeout(timer)
    }
  }, [])

  // 모바일에서 터치 핸들러
  const handleMobileTouch = (e: React.MouseEvent, i: number) => {
    if (!isMobile) return true // 모바일이 아니면 기본 동작

    e.preventDefault() // 기본 링크 동작 방지
    
    if (index === i) {
      // 이미 펼쳐진 상태라면 상세 페이지로 이동
      window.location.href = `/projects/${projects[i].id}`
    } else {
      // 펼쳐지지 않은 상태라면 펼치기
      setIndex(i)
    }
    
    return false
  }

  // SSR 방지 및 너비가 설정되기 전까지 렌더링 방지
  if (!isClient || boundingBoxWidth === 0) {
    return (
      <div ref={boundingBox} className='w-full h-96 flex items-center justify-center'>
        {/* 로딩 상태 또는 최소 높이 유지 */}
        <div className='w-full h-full bg-gray-100 animate-pulse rounded'></div>
      </div>
    )
  }

  const collapsedItemWidthDesktop = 60 // px 단위, 원하는 너비로 조정 가능
  const collapsedItemWidthTablet = 100 // px 단위, 원하는 너비로 조정 가능
  const collapsedItemHeightMobile = 60 // px 단위, 원하는 높이로 조정 가능

  // 확장된 항목의 너비 계산
  const expandedWidthDesktop = boundingBoxWidth - collapsedItemWidthDesktop * (total - 1)
  const expandedWidthTablet = boundingBoxWidth - collapsedItemWidthTablet * (total - 1)

  // 확장된 항목의 높이 계산
  const expandedHeightMobile = boundingBoxWidth / mobileImageRatio

  //pc,tablet
  const desktopHeight = `${expandedWidthDesktop / desktopImageRatio}px`
  const tabletHeight = `${expandedWidthTablet / tabletImageRatio}px`

  const desktopCols = projects
    .map((_, i) => (index === i ? `${expandedWidthDesktop}px` : `${collapsedItemWidthDesktop}px`))
    .join(' ')

  const tabletCols = projects
    .map((_, i) => (index === i ? `${expandedWidthTablet}px` : `${collapsedItemWidthTablet}px`))
    .join(' ')

  //mobile
  const mobileRows = projects
    .map((_, i) => (index === i ? `${expandedHeightMobile}px` : `${collapsedItemHeightMobile}px`))
    .join(' ')

  return (
    <motion.div
      ref={boundingBox}
      style={
        {
          '--desktop-cols': desktopCols,
          '--tablet-cols': tabletCols,
          '--desktop-height': desktopHeight,
          '--tablet-height': tabletHeight,
          '--mobile-rows': mobileRows,
        } as React.CSSProperties
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      layout
      id='projects-grid'
      className={classNames(
        'w-full grid',
        'transition-all duration-500 ease-in-out',
        // grid-rows 설정
        'grid-rows-[var(--mobile-rows)]',
        'md:grid-rows-[var(--mobile-rows)]',
        'md-landscape:grid-rows-1',
        'lg:grid-rows-1',
        // grid-cols 설정
        'grid-cols-1',
        'md:grid-cols-1',
        'md-landscape:grid-cols-[var(--tablet-cols)]',
        'lg:grid-cols-[var(--desktop-cols)]',
        // height 설정
        'h-fit',
        'md:h-fit',
        'md-landscape:h-full',
        'lg:h-[calc(100dvh-7.5rem)]'
      )}
    >
      {projects.map((project, i) => {
        const isExpanded = index === i
        const isNextToExpanded = index !== undefined && index + 1 === i // 다음 항목이 확장된 경우
        const isPreviousToExpanded = index !== undefined && index - 1 === i // 이전 항목이 확장된 경우

        const getBorderClasses = () => {
          if (isExpanded) {
            return 'rounded-[5px] border-none'
          }

          let classes = 'border-stone-300'

          // 기본: border-b (모바일에서 bottom border)
          classes += ' border-b'

          // md (태블릿 세로)에서의 처리 - portrait일 때만 적용
          if (isPreviousToExpanded) {
            classes += ' '
          } else {
            classes +=
              ' md:border-b md:border-t-0 md:border-l-0 md-landscape:border-b-0 md-landscape:border-t-0 md-landscape:border-l'
          }

          // md-landscape (태블릿 가로)에서의 처리
          if (isNextToExpanded) {
            classes += ' md-landscape:border-none'
          } else {
            classes += ' md-landscape:border-b-0 md-landscape:border-l'
          }

          // lg (데스크톱)에서의 처리
          if (isNextToExpanded) {
            classes += ' lg:border-none'
          } else {
            classes += ' lg:border-b-0 lg:border-l'
          }

          return classes
        }

        // 모바일에서는 조건부로 Link 래핑
        const LinkWrapper = ({ children }) => {
          if (isMobile) {
            // 모바일에서는 div로 래핑하고 onClick 핸들러 사용
            return (
              <div
                className={`cursor-pointer w-full h-full block`}
                onClick={(e) => handleMobileTouch(e, i)}
                onTouchStart={() => {}} // 터치 반응성을 위한 빈 핸들러
              >
                {children}
              </div>
            )
          } else {
            // 데스크톱/태블릿에서는 기존 Link 동작 유지
            return (
              <Link
                href={`/projects/${project.id}`}
                className={`cursor-pointer w-full h-full block`}
                onMouseEnter={() => setIndex(i)}
                onClick={() => setIndex(i)}
              >
                {children}
              </Link>
            )
          }
        }

        return (
          <div className={`w-full overflow-x-hidden relative  ${getBorderClasses()}`} key={project.id}>
            <LinkWrapper>
              <motion.div
                className='w-full h-full relative overflow-hidden'
                style={{
                  aspectRatio: desktopImageRatio,
                }}
              >
                <motion.img
                  src={project.thumbnail.pc}
                  alt={project.title}
                  style={{
                    opacity: i === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className='absolute inset-0 h-full w-full object-cover'
                />
                
                {isMobile && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="absolute bottom-2 text-[24px] text-white right-1 p-2"
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
              
              <motion.h3
                className={classNames(
                  'absolute font-semibold whitespace-nowrap transition-all duration-300',
                  'text-2xl lg:text-3xl md:text-xl [writing-mode:horizontal-tb] md:[writing-mode:horizontal-tb] md-landscape:[writing-mode:vertical-rl] lg:[writing-mode:vertical-rl]',
                  'top-auto md:top-auto md-landscape:top-5 lg:top-5',
                  'bottom-3 md:bottom-3 md-landscape:bottom-auto lg:bottom-auto',
                  'left-3 md:left-3 md-landscape:left-auto lg:left-auto',
                  'right-auto md:right-auto md-landscape:right-6 lg:right-2',
                  index === i ? 'text-white mr-0' : 'text-zinc-600',
                )}
              >
                {project.title}
              </motion.h3>
            </LinkWrapper>
          </div>
        )
      })}
    </motion.div>
  )
}