'use client'

import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { ColorAnalysisResult } from '@/types/color'
import { Range, getTrackBackground } from 'react-range'
import { MotionControlPanel, MotionParams } from '../MotionControlPanel'
import { motion } from 'framer-motion'

interface ResultStepProps {
  imageUrl: string
  text: string
  colorAnalysis: ColorAnalysisResult
  onStartOver: () => void
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

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setDimensions(getResponsiveSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // steps가 바뀌면 positions 크기 맞추기
  useEffect(() => {
    setPositions((prev) => Array.from({ length: steps }, (_, i) => prev[i] || { x: 0, y: 0 }))
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
        const { x, y } = positions[i] || { x: 0, y: 0 }

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

export function ResultStep({ imageUrl, text, colorAnalysis, onStartOver, onComplete }: ResultStepProps) {
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

  return (
    <div className='w-full h-full flex flex-col justify-center items-center z-10 bg-white'>
      {/* 모션 컨트롤 패널 추가 */}
      <MotionControlPanel
        onMotionParamsChange={handleMotionParamsChange}
        isVisible={isMotionPanelVisible}
        onToggle={() => setIsMotionPanelVisible(!isMotionPanelVisible)}
      />

      <div
        className={classNames(
          'absolute flex flex-col justify-center items-center inset-x-0 w-full',
          //mobile
          'top-[14.17%]',
          'gap-[30px]', // 모바일
          //tablet
          'md-landscape:top-[27.01%]',
          'md:top-[21.3%]',
          'md:gap-[50px]', // md
          'md-landscape:gap-[50px]', // md-landscape 조건
          //desktop
          'lg:top-[17.53%]',
          'lg:gap-[30px]', // lg~2xl fluid
          // large desktop
          '2xl:top-[17.52%]',
          '2xl:gap-[60px]', // 2xl 이상
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
              'text-center text-[#FFF] font-bold mix-blend-difference',
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
        </div>

        {/* button */}
        <button
          onClick={handleSubmit}
          className={classNames(
            'w-[150px] rounded-[100px] inline-flex justify-center items-center transition-all duration-200',
            'h-[44px] px-[36px] bg-[#222222] hover:bg-[#333333]',
          )}
        >
          <div className='text-[18px] text-white font-medium'>Done</div>
        </button>
      </div>
    </div>
  )
}
