'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import classNames from 'classnames'
import { ColorAnalysisResult } from '@/types/color'
import { Range, getTrackBackground } from 'react-range'
import { MotionControlPanel, MotionParams } from '../MotionControlPanel'
import { AnimatePresence, motion } from 'framer-motion'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import onBoardingAnim from '@/animation/onboarding.json'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'

interface ResultStepProps {
  imageUrl: string
  text: string
  colorAnalysis: ColorAnalysisResult
  onStartOver: () => void
  onBack: () => void
  onComplete: (interactionData: {
    steps: number
    positions: Array<{ x: number; y: number }>
    brandColorName: string
    brandColorHex: string
    refinedColorName: string
    refinedColorHex: string
    text: string
  }) => void
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null
  }
  const rgbToHex = (r: number, g: number, b: number) =>
    '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  if (!rgb1 || !rgb2) return color1

  const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r))
  const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g))
  const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b))
  return rgbToHex(r, g, b)
}

function ConcentricSquares({
  steps,
  brandColorHex,
  refinedColorHex,
  onPositionsChange,
  motionParams = {
    speedBase: 0.08,
    followSpeedMultiplier: 0.5,
    followSpeedOffset: 1.0,
    colorInterpolationPower: 0.9,
    stepReductionRatio: 0.06,
    borderRadiusOuter: 8,
    dragSmoothing: 1.0,
  },
}: {
  steps: number
  brandColorHex: string
  refinedColorHex: string
  onPositionsChange: (positions: Array<{ x: number; y: number }>) => void
  motionParams?: MotionParams
}) {
  // 반응형 사이즈 계산
  const getResponsiveSize = () => {
    if (typeof window === 'undefined') return { maxWidth: 420, maxHeight: 316 }

    const width = window.innerWidth
    const height = window.innerHeight

    // 화면 크기에 따른 maxWidth 설정
    let maxWidth: number
    let maxHeight: number

    if (width >= 1024) {
      // 데스크톱 (lg 이상)
      maxWidth = 420
      maxHeight = 316
    } else if (width >= 768) {
      // 태블릿 (md 이상)
      maxWidth = Math.min(360, width * 0.8)
      maxHeight = Math.min(270, height * 0.35)
    } else {
      // 모바일
      maxWidth = Math.min(280, width * 0.75)
      maxHeight = Math.min(210, height * 0.3)
    }

    return { maxWidth, maxHeight }
  }

  const [dimensions, setDimensions] = useState(getResponsiveSize())
  const { maxWidth, maxHeight } = dimensions
  const stepReduction = Math.max(15, maxWidth * motionParams.stepReductionRatio) // 모션 파라미터 적용

  const [positions, setPositions] = useState(Array.from({ length: steps }, () => ({ x: 0, y: 0 })))
  const targetRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef(false)

  const lastTailRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  useEffect(() => {
    const tail = positions[positions.length - 1]
    if (tail) lastTailRef.current = tail
  }, [positions])

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setDimensions(getResponsiveSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // steps가 바뀌면 positions 크기 맞추기
  useLayoutEffect(() => {
    setPositions((prev) => {
      if (steps === prev.length) return prev
      if (steps > prev.length) {
        const last = prev.length > 0 ? prev[prev.length - 1] : { x: 0, y: 0 }
        const next = prev.slice()
        next.length = steps
        for (let i = prev.length; i < steps; i++) next[i] = last
        return next
      }
      return prev.slice(0, steps)
    })
  }, [steps])

  // positions가 변경될 때마다 부모에게 알림
  useEffect(() => {
    onPositionsChange(positions)
  }, [positions, onPositionsChange])

  // 마우스/터치 위치 계산 공통 함수
  const getPointerPosition = (clientX: number, clientY: number) => {
    const lastIdx = steps - 1
    const smallestWidth = maxWidth - stepReduction * lastIdx
    const smallestHeight = maxHeight - stepReduction * lastIdx
    const maxX = (maxWidth - smallestWidth) / 2
    const maxY = (maxHeight - smallestHeight) / 2

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    let x = (clientX - centerX) / motionParams.dragSmoothing // dragSmoothing 적용
    let y = (clientY - centerY) / motionParams.dragSmoothing

    // 🔹 가장 작은 사각형 기준 영역 제한
    x = Math.max(-maxX, Math.min(maxX, x))
    y = Math.max(-maxY, Math.min(maxY, y))

    return { x, y }
  }

  // 마우스 이벤트 핸들러
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragRef.current) return
    const { x, y } = getPointerPosition(e.clientX, e.clientY)
    targetRef.current = { x, y }
  }

  const handleMouseDown = () => (dragRef.current = true)
  const handleMouseUp = () => (dragRef.current = false)

  // 터치 이벤트 핸들러
  const handleTouchMove = (e: TouchEvent) => {
    if (!dragRef.current) return
    e.preventDefault() // 스크롤 방지
    const touch = e.touches[0]
    if (touch) {
      const { x, y } = getPointerPosition(touch.clientX, touch.clientY)
      targetRef.current = { x, y }
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault() // 기본 터치 동작 방지
    dragRef.current = true
    const touch = e.touches[0]
    if (touch) {
      const { x, y } = getPointerPosition(touch.clientX, touch.clientY)
      targetRef.current = { x, y }
    }
  }

  const handleTouchEnd = () => {
    dragRef.current = false
  }

  // requestAnimationFrame으로 부드럽게 보간 (모션 파라미터 적용)
  useEffect(() => {
    let frame: number

    const animate = () => {
      setPositions((prev) => {
        const newPositions = [...prev]
        const target = targetRef.current

        const lastIdx = steps - 1
        if (lastIdx >= 0) {
          // 🔹 마지막 사각형 lerp + 영역 제한
          const last = newPositions[lastIdx]
          let newX = last.x + (target.x - last.x) * motionParams.speedBase
          let newY = last.y + (target.y - last.y) * motionParams.speedBase

          // 영역 제한 적용 (드래그 가능한 가장 작은 사각형)
          const smallestWidth = maxWidth - stepReduction * lastIdx
          const smallestHeight = maxHeight - stepReduction * lastIdx
          const maxX = (maxWidth - smallestWidth) / 2
          const maxY = (maxHeight - smallestHeight) / 2
          newX = Math.max(-maxX, Math.min(maxX, newX))
          newY = Math.max(-maxY, Math.min(maxY, newY))

          newPositions[lastIdx] = { x: newX, y: newY }
        }

        // 나머지 사각형들이 앞의 사각형을 따라오게 (모션 파라미터 적용)
        for (let i = lastIdx - 1; i >= 0; i--) {
          const current = newPositions[i]
          const next = newPositions[i + 1]
          const speed =
            motionParams.speedBase * (motionParams.followSpeedMultiplier + (i / steps) * motionParams.followSpeedOffset)
          let newX = current.x + (next.x - current.x) * speed
          let newY = current.y + (next.y - current.y) * speed

          // 🔹 각 사각형마다 자기 크기 기준으로도 제한
          const width = maxWidth - stepReduction * i
          const height = maxHeight - stepReduction * i
          const maxX = (maxWidth - width) / 2
          const maxY = (maxHeight - height) / 2
          newX = Math.max(-maxX, Math.min(maxX, newX))
          newY = Math.max(-maxY, Math.min(maxY, newY))

          newPositions[i] = { x: newX, y: newY }
        }

        return newPositions
      })

      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [steps, maxWidth, maxHeight, stepReduction, motionParams])

  // 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [steps, maxWidth, maxHeight, stepReduction, motionParams.dragSmoothing])

  return (
    <div className='relative' style={{ width: `${maxWidth}px`, height: `${maxHeight}px` }}>
      {Array.from({ length: steps }).map((_, i) => {
        const factor = steps > 1 ? Math.pow(i / (steps - 1), motionParams.colorInterpolationPower) : 0
        const width = maxWidth - stepReduction * i
        const height = maxHeight - stepReduction * i
        const color = interpolateColor(brandColorHex, refinedColorHex, factor)
        const isSmallest = i === steps - 1
        const { x, y } = positions[i] ?? lastTailRef.current

        return (
          <div
            key={i}
            className='absolute'
            onMouseDown={isSmallest ? handleMouseDown : undefined}
            onTouchStart={isSmallest ? handleTouchStart : undefined}
            style={{
              width: `${width}px`,
              height: `${height}px`,
              backgroundColor: color,
              borderRadius: i === 0 ? `${motionParams.borderRadiusOuter}px` : '0px', // 모션 파라미터 적용
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              cursor: isSmallest ? 'grab' : 'default',
              touchAction: isSmallest ? 'none' : 'auto', // 터치 시 기본 동작 방지
            }}
          />
        )
      })}
    </div>
  )
}

export function ResultStep({ imageUrl, text, colorAnalysis, onStartOver, onBack, onComplete }: ResultStepProps) {
  const [values, setValues] = React.useState([9])
  const [currentPositions, setCurrentPositions] = useState<Array<{ x: number; y: number }>>([])

  // 모션 컨트롤 관련 state 추가
  const [motionParams, setMotionParams] = useState<MotionParams>({
    speedBase: 0.08,
    followSpeedMultiplier: 0.5,
    followSpeedOffset: 1.0,
    colorInterpolationPower: 0.9,
    stepReductionRatio: 0.06,
    borderRadiusOuter: 8,
    dragSmoothing: 1.0,
  })
  const [isMotionPanelVisible, setIsMotionPanelVisible] = useState(false)

  const STEP = 1
  const MIN = 6
  const MAX = 13

  const handlePositionsChange = (positions: Array<{ x: number; y: number }>) => {
    setCurrentPositions(positions)
  }

  const handleMotionParamsChange = (params: MotionParams) => {
    setMotionParams(params)
  }

  const handleSubmit = () => {
    onComplete({
      steps: values[0],
      positions: currentPositions,
      brandColorName: colorAnalysis.brandColor.name || 'Primary Color',
      brandColorHex: colorAnalysis.brandColor.hex,
      refinedColorName: colorAnalysis.refinedColor.name || 'Refined Color',
      refinedColorHex: colorAnalysis.refinedColor.hex,
      text: text,
    })
  }

  const { isMobile, isTablet } = useDeviceDetection()

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)

  // 모바일/태블릿인 경우에만 모달 표시
  const shouldShowModal = isMobile || isTablet

  //1초 후에 모달 닫기
  useEffect(() => {
    if (shouldShowModal) {
      const timer = setTimeout(() => {
        setIsOnboardingComplete(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [shouldShowModal])

  return (
    <div className='w-full h-full flex flex-col justify-center items-center z-10'>
      {/* 온보딩 */}
      <AnimatePresence>
        {!isOnboardingComplete && shouldShowModal && (
          <motion.div
            className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOnboardingComplete(true)}
          >
            <div className='w-[30%] h-fit flex flex-col gap-4 justify-center items-center gap-2'>
              <Lottie animationData={onBoardingAnim} loop={true} autoplay={true} className='w-full h-full' />
              <span className='text-white font-semibold whitespace-nowrap text-[16px] text-center'>
                드래그하여 Movement를 움직여보세요!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={classNames(
          'absolute flex flex-col justify-center items-center inset-x-0 w-full',
          //mobile
          'top-[14.17%]',
          'gap-[30px]', // 모바일
          //tablet
          'md:top-[47%]',
          'md:-translate-y-1/2',
          'md:gap-[50px]', // md
          'md-landscape:gap-[20px]', // md-landscape 조건
          'md-landscape:bottom-[14.30%]',
          //desktop
          'lg:bottom-[15.30%]',
          'lg:gap-[30px]', // lg~2xl fluid
          // large desktop
          '2xl:bottom-[15.30%]',
          '2xl:gap-[15dvh]', // 2xl 이상
        )}
      >
        <div
          className={classNames(
            'flex flex-col justify-center items-center w-full',
            //mobile
            'gap-[10px]', // 모바일
            //tablet
            'md:gap-[10px]',
            //desktop
            'lg:gap-[10px]',
            // large desktop
            '2xl:gap-[17px]', // 2xl 이상 고정
          )}
        >
          <motion.div
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
            className={classNames(
              'text-center text-[#FF60B9] font-medium font-english',
              // 모바일
              'text-[17px] leading-[100%] letterSpacing-[-0.34px]',
              // tablet
              'md:text-[clamp(17px,calc(16.118px+0.2451vw),18px)] md:leading-[130%] md:letterSpacing-[-0.36px]',
              // desktop
              'lg:text-[clamp(20px,calc(-0.571px+1.42857vw),36px)] lg:leading-[130%] lg:letterSpacing-[-0.4px]',
              // large desktop
              '2xl:text-[36px] 2xl:leading-[130%] 2xl:letterSpacing-[-0.72px]',
            )}
          >
            Make Your Movement
          </motion.div>
          <div
            className={classNames(
              'text-center text-[#222] font-bold',
              // 모바일
              'text-[30px] leading-[140%] letterSpacing-[-0.6px]',
              // tablet
              'md:text-[clamp(30px,calc(28.235px+0.4902vw),32px)] md:leading-[140%] md:letterSpacing-[-0.64px]',
              // desktop
              'lg:text-[clamp(36px,calc(0px+2.5vw),64px)] lg:leading-[140%] lg:letterSpacing-[-0.72px]',
              // large desktop
              '2xl:text-[64px] 2xl:leading-[140%] 2xl:letterSpacing-[-1.28px]',
            )}
          >
            <span className='hidden md:block'>드래그로 나만의 움직임을 만들어보세요</span>
            <span className='block md:hidden'>
              방향을 움직여 나만의 <br />
              움직임을 만들어보세요
            </span>
          </div>
        </div>
        {/* canvas */}
        <div className='flex flex-col justify-center items-center gap-[2dvh]'>
          <div className='flex justify-center items-center'>
            <ConcentricSquares
              steps={values[0]}
              brandColorHex={colorAnalysis.brandColor.hex}
              refinedColorHex={colorAnalysis.refinedColor.hex}
              onPositionsChange={handlePositionsChange}
              motionParams={motionParams} // 모션 파라미터 전달
            />
          </div>

          {/* 기존 Range 컴포넌트는 그대로 유지 */}

          <div className='flex flex-col w-full max-w-[366px] justify-center items-center gap-[4dvh]'>
            <div className='w-full max-w-[366px] px-4'>
              <Range
                values={values}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={(values) => setValues(values)}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{ ...props.style, height: '36px', display: 'flex', width: '100%' }}
                  >
                    <div
                      ref={props.ref}
                      style={{
                        height: '6px',
                        width: '100%',
                        borderRadius: '20px',
                        background: getTrackBackground({
                          values,
                          colors: ['#000', '#ccc'],
                          min: MIN,
                          max: MAX,
                        }),
                        alignSelf: 'center',
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    key={props.key}
                    style={{
                      ...props.style,
                      height: '14px',
                      width: '14px',
                      borderRadius: '20px',
                      backgroundColor: '#000',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                )}
              />
            </div>

            <div
              className={classNames(
                'w-fit h-fit flex justify-center items-center z-0 pointer-events-none',
                'hidden md-landscape:block lg:block',
                'bottom-[17.41%]',
                'md:bottom-[15.32%]',
                'lg:bottom-[13.58%]',
                '2xl:bottom-[13.60%]',
              )}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className={classNames(
                  'aspect-[62/14] h-auto',
                  'w-[clamp(32px,calc(39.529px-0.980392vw),36px)]', // 모바일→md 감소
                  'lg:w-[clamp(40px,calc(11.714px+1.9642857vw),62px)]', // lg→2xl 증가
                  '2xl:w-[62px]', // 2xl 이상 고정
                )}
                viewBox='0 0 62 14'
                fill='none'
              >
                <circle cx='7' cy='7' r='7' fill={'#222222'} />
                <circle cx='31' cy='7' r='7' fill={'#222222'} />
                <circle cx='55' cy='7' r='7' fill={'#F2F2F2'} />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* left button */}
      <div
        className={classNames(
          'absolute flex justify-center items-center',
          'left-[calc(50vw-60px)] bottom-[10.3%] inset-y-auto',
          'md:bottom-[20.7%]',
          'md:left-[calc(50vw-60px)]',
          'md:inset-y-auto',
          'md-landscape-coming:left-[40px] md-landscape-coming:inset-y-0', // md-landscape 전용
          'lg:left-[clamp(54px,calc(-5.14286px+4.10714vw),100px)] lg:inset-y-0', // lg~2xl fluid
          '2xl:left-[100px] 2xl:inset-y-0', // 2xl 이상 고정
        )}
      >
        <motion.button
          type='button'
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ opacity: 1 }}
          whileTap={{ scale: 0.95, opacity: 1 }}
          onClick={() => {
            onBack()
          }}
          className={classNames(
            'bg-black text-white rounded-full flex justify-center items-center transition-all duration-200 md:hover:bg-neutral-700',
            'h-auto aspect-square',
            //mobile
            'w-[46px]',
            //tablet & desktop & large desktop
            'md:w-[46px]',
            'lg:w-[clamp(46px,calc(0.85714px+2.14286vw),74px)]',
            '2xl:w-[74px]',
            'cursor-pointer',
          )}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={classNames(
              'h-auto aspect-square',
              'w-[clamp(15px,calc(20.647px-0.735294vw),18px)]', // 모바일→md
              'lg:w-[clamp(15px,calc(3.42857px+0.803571vw),24px)]', // lg→2xl
              '2xl:w-[24px]', // 2xl 이상
            )}
            viewBox='0 0 16 14'
            fill='currentColor'
          >
            <path d='M6.43225 12.9384C6.80217 13.3071 7.40002 13.3091 7.77233 12.9428C8.15012 12.5712 8.15183 11.9626 7.77616 11.5888L6.28288 10.1031C5.89266 9.71293 5.50244 9.34111 5.11222 8.98771C4.71464 8.62694 4.41277 8.36556 4.20661 8.20358C4.11516 8.12568 4.1787 7.97487 4.29844 7.98451C5.10686 8.04957 6.04812 8.0821 7.12222 8.0821H14.4444C15.036 8.0821 15.5156 7.60248 15.5156 7.01084C15.5156 6.41919 15.036 5.93957 14.4444 5.93957H7.12222C6.57002 5.93957 6.02887 5.9543 5.49876 5.98375C4.96865 6.00584 4.57475 6.03161 4.31705 6.06106C4.19937 6.07114 4.13823 5.92213 4.22821 5.84562C4.84515 5.32109 5.53004 4.68241 6.28288 3.92957L7.76357 2.43369C8.13575 2.0577 8.1342 1.45167 7.76011 1.07758C7.38379 0.701251 6.77332 0.702272 6.39826 1.07986L1.07377 6.44008C0.754435 6.76156 0.755739 7.28091 1.07668 7.60078L6.43225 12.9384Z' />
          </svg>
        </motion.button>
      </div>
      {/* right button */}
      <div
        className={classNames(
          'absolute flex justify-center items-center',
          'right-[calc(50vw-60px)] bottom-[10.3%] inset-y-auto',
          'md:bottom-[20.7%]',
          'md:right-[calc(50vw-60px)]',
          'md:inset-y-auto',
          'md-landscape-coming:right-[40px] md-landscape-coming:inset-y-0',
          'md-landscape:inset-y-0', // md-landscape 전용
          'lg:right-[clamp(54px,calc(-5.14286px+4.10714vw),100px)] lg:inset-y-0', // lg~2xl fluid
          '2xl:right-[100px] 2xl:inset-y-0', // 2xl 이상 고정
        )}
      >
        <motion.button
          type='button'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className={classNames(
            'bg-black text-white rounded-full flex justify-center items-center transition-all duration-200 md:hover:bg-neutral-700',
            'h-auto aspect-square',
            //mobile
            'w-[46px]',
            //tablet & desktop & large desktop
            'md:w-[46px]',
            'lg:w-[clamp(46px,calc(0.85714px+2.14286vw),74px)]',
            '2xl:w-[74px]',
            'cursor-pointer',
          )}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={classNames(
              'h-auto aspect-square',
              'w-[clamp(15px,calc(20.647px-0.735294vw),18px)]', // 모바일→md
              'lg:w-[clamp(15px,calc(3.42857px+0.803571vw),24px)]', // lg→2xl
              '2xl:w-[24px]', // 2xl 이상
            )}
            viewBox='0 0 16 14'
            fill='currentColor'
          >
            <path d='M9.57556 12.9384C9.20564 13.3071 8.60779 13.3091 8.23548 12.9428C7.8577 12.5712 7.85598 11.9626 8.23165 11.5888L9.72493 10.1031C10.1152 9.71293 10.5054 9.34111 10.8956 8.98771C11.2932 8.62694 11.595 8.36556 11.8012 8.20358C11.8926 8.12568 11.8291 7.97487 11.7094 7.98451C10.9009 8.04957 9.95969 8.0821 8.88559 8.0821H1.56345C0.971809 8.0821 0.492188 7.60248 0.492188 7.01084C0.492188 6.41919 0.971809 5.93957 1.56345 5.93957H8.88559C9.43779 5.93957 9.97895 5.9543 10.5091 5.98375C11.0392 6.00584 11.4331 6.03161 11.6908 6.06106C11.8084 6.07114 11.8696 5.92213 11.7796 5.84562C11.1627 5.32109 10.4778 4.68241 9.72493 3.92957L8.24424 2.43369C7.87207 2.0577 7.87361 1.45167 8.2477 1.07758C8.62403 0.701251 9.23449 0.702272 9.60956 1.07986L14.934 6.44008C15.2534 6.76156 15.2521 7.28091 14.9311 7.60078L9.57556 12.9384Z' />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}
