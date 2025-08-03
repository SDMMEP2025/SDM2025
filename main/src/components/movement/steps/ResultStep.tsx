'use client'

import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { ColorAnalysisResult } from '@/types/color'
import { Range, getTrackBackground } from 'react-range'
import { MotionControlPanel, MotionParams } from '../MotionControlPanel' 

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
  }
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

  // 마우스 이동 → target만 업데이트 (dragSmoothing 파라미터 적용)
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragRef.current) return

    const lastIdx = steps - 1
    const smallestWidth = maxWidth - stepReduction * lastIdx
    const smallestHeight = maxHeight - stepReduction * lastIdx
    const maxX = (maxWidth - smallestWidth) / 2
    const maxY = (maxHeight - smallestHeight) / 2

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    let x = (e.clientX - centerX) / motionParams.dragSmoothing // dragSmoothing 적용
    let y = (e.clientY - centerY) / motionParams.dragSmoothing

    // 🔹 가장 작은 사각형 기준 영역 제한
    x = Math.max(-maxX, Math.min(maxX, x))
    y = Math.max(-maxY, Math.min(maxY, y))

    targetRef.current = { x, y }
  }

  const handleMouseDown = () => (dragRef.current = true)
  const handleMouseUp = () => (dragRef.current = false)

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
          const speed = motionParams.speedBase * (motionParams.followSpeedMultiplier + (i / steps) * motionParams.followSpeedOffset)
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

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
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
            style={{
              width: `${width}px`,
              height: `${height}px`,
              backgroundColor: color,
              borderRadius: i === 0 ? `${motionParams.borderRadiusOuter}px` : '0px', // 모션 파라미터 적용
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              cursor: isSmallest ? 'grab' : 'default',
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
      
      <div className='flex flex-col justify-between items-center gap-[8dvh]'>
        <div className='flex flex-col justify-center items-center gap-[3.68dvh]'>
          <div className='left-1/2 transform hidden md:block'>
            <svg xmlns='http://www.w3.org/2000/svg' width='32' height='9' viewBox='0 0 32 9' fill='none'>
              <circle cx='4' cy='4.5' r='4' fill='#222222' />
              <circle cx='15.7344' cy='4.5' r='4' fill='#222222' />
              <circle cx='27.4688' cy='4.5' r='4' fill='#E8E8E8' />
            </svg>
          </div>

          <div className='flex flex-col justify-center items-center gap-[2.13dvh]'>
            <h2
              className={classNames(
                'text-center text-[#222222] font-semibold font-english',
                'text-[34px] md:text-[28px] lg:text-[32px]',
              )}
            >
              Move Your Movement
            </h2>
            <p className={classNames('text-center text-[#4B4F57] mt-2', 'text-[16px] md:text-[17px] lg:text-[18px]')}>
              방향을 움직여 나만의 움직임을 만들어보세요
            </p>
          </div>
        </div>

        <div className='flex flex-col justify-center items-center gap-[14dvh] md:gap-[8dvh]'>
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

          <div className='flex flex-col justify-center items-center gap-[4dvh]'>
            <div className='left-1/2 transform md:hidden'>
            <svg xmlns='http://www.w3.org/2000/svg' width='32' height='9' viewBox='0 0 32 9' fill='none'>
              <circle cx='4' cy='4.5' r='4' fill='#222222' />
              <circle cx='15.7344' cy='4.5' r='4' fill='#222222' />
              <circle cx='27.4688' cy='4.5' r='4' fill='#E8E8E8' />
            </svg>
          </div>

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
      </div>
    </div>
  )
}
