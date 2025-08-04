'use client'

import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { InteractMotionControlPanel, InteractMotionParams } from '../InteractMotionControlPanel'

interface InteractPageProps {
  interactionData: {
    steps: number
    positions: Array<{ x: number; y: number }>
    brandColorName: string
    brandColorHex: string
    refinedColorName: string
    refinedColorHex: string
    text: string
  }
  onStartOver: () => void
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

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return hex

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return `rgb(${r}, ${g}, ${b})`
}

function FloatingConcentricSquares({
  steps,
  positions,
  brandColorHex,
  refinedColorHex,
  interactionData,
  motionParams
}: {
  steps: number
  positions: Array<{ x: number; y: number }>
  brandColorHex: string
  refinedColorHex: string
  interactionData: InteractPageProps['interactionData']
  motionParams: InteractMotionParams
}) {
  // 기본 크기 (디자인 기준)
  const baseMaxWidth = 420
  const baseMaxHeight = 316
  const baseStepReduction = 25

  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const [floatOffset, setFloatOffset] = useState({ x: 0, y: 0 })
  const [tiltOffset, setTiltOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // 마우스 따라 움직이는 positions
  const [currentPositions, setCurrentPositions] = useState(positions)
  const targetRef = useRef({ x: 0, y: 0 })
  const mouseActiveRef = useRef(false)

  // 모바일 및 자이로 센서 관련 state
  const [isMobile, setIsMobile] = useState(false)
  const [gyroStatus, setGyroStatus] = useState<'pending' | 'granted' | 'denied' | 'error'>('pending')
  const [isListening, setIsListening] = useState(false)
  const [sensorData, setSensorData] = useState<{ beta: string; gamma: string }>({ beta: '0.0', gamma: '0.0' })

  // 센서 리스닝 상태 추적
  const listeningRef = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  // 부모 크기 기반 스케일 계산
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current?.parentElement) return

      const parent = containerRef.current.parentElement
      const parentRect = parent.getBoundingClientRect()

      // 부모의 크기에서 여백을 제외한 사용 가능한 공간
      const availableWidth = parentRect.width * 0.8 // 부모 너비의 80%
      const availableHeight = parentRect.height * 0.6 // 부모 높이의 60%

      // 가로/세로 비율을 유지하면서 맞는 스케일 계산
      const widthScale = availableWidth / baseMaxWidth
      const heightScale = availableHeight / baseMaxHeight

      // 더 작은 스케일을 선택해서 부모를 벗어나지 않게 함
      const newScale = Math.min(widthScale, heightScale, 2) // 최대 2배까지만

      setScale(Math.max(0.3, newScale)) // 최소 0.3배는 유지
    }

    // ResizeObserver로 부모 크기 변화 감지 (더 정확함)
    let resizeObserver: ResizeObserver | null = null

    if (containerRef.current?.parentElement) {
      resizeObserver = new ResizeObserver(updateScale)
      resizeObserver.observe(containerRef.current.parentElement)
    }

    // 초기 스케일 설정
    updateScale()

    // window resize도 같이 감지 (혹시 모를 경우)
    window.addEventListener('resize', updateScale)

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      window.removeEventListener('resize', updateScale)
    }
  }, [])

  // 스케일에 따른 실제 크기들
  const maxWidth = baseMaxWidth * scale
  const maxHeight = baseMaxHeight * scale
  const stepReduction = baseStepReduction * scale

  // 모바일 환경 감지
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const userAgent = navigator.userAgent
      const isIOS = /iPad|iPhone|iPod/.test(userAgent)

      setIsMobile(isTouchDevice)

      if (isTouchDevice && typeof DeviceOrientationEvent !== 'undefined') {
        if (!isIOS) {
          setGyroStatus('granted')
        }
      } else if (isTouchDevice) {
        setGyroStatus('error')
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 권한이 granted면 센서 활성화
  useEffect(() => {
    if (gyroStatus === 'granted' && isMobile) {
      const cleanup = enableGyroscope()
      cleanupRef.current = cleanup
      return cleanup
    }
  }, [gyroStatus, isMobile, motionParams.gyroSensitivity])

  // 부유 애니메이션 (motionParams 적용)
  useEffect(() => {
    let frame: number
    let time = 0

    const animate = () => {
      time += motionParams.floatSpeed
      setFloatOffset({
        x: 0,
        y: Math.cos(time * 0.8) * motionParams.floatAmplitude * 2.0 * scale,
      })
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [scale, motionParams.floatAmplitude, motionParams.floatSpeed])

  // 마우스 따라 움직이는 애니메이션 (motionParams 적용)
  useEffect(() => {
    let frame: number

    const animate = () => {
      setCurrentPositions((prev) => {
        const newPositions = [...prev]
        const target = targetRef.current

        const lastIdx = steps - 1
        if (lastIdx >= 0 && mouseActiveRef.current) {
          const last = newPositions[lastIdx]
          const newX = last.x + (target.x - last.x) * motionParams.speedBase
          const newY = last.y + (target.y - last.y) * motionParams.speedBase
          newPositions[lastIdx] = { x: newX, y: newY }
        }

        for (let i = lastIdx - 1; i >= 0; i--) {
          const current = newPositions[i]
          const next = newPositions[i + 1]
          const speed = motionParams.speedBase * (motionParams.followSpeedMultiplier + (i / steps) * motionParams.followSpeedOffset)
          const newX = current.x + (next.x - current.x) * speed
          const newY = current.y + (next.y - current.y) * speed
          newPositions[i] = { x: newX, y: newY }
        }

        return newPositions
      })

      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [steps, motionParams.speedBase, motionParams.followSpeedMultiplier, motionParams.followSpeedOffset])

  // 권한 요청 함수
  const requestPermission = async () => {
    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permissionResult = await (DeviceOrientationEvent as any).requestPermission()
        setGyroStatus(permissionResult)
      } else {
        setGyroStatus('granted')
      }
    } catch (error: any) {
      setGyroStatus('denied')
    }
  }

  // 자이로스코프 활성화 (motionParams 적용)
  const enableGyroscope = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta ?? 0
      const gamma = event.gamma ?? 0

      setSensorData({ beta: beta.toFixed(1), gamma: gamma.toFixed(1) })

      if (!listeningRef.current) {
        listeningRef.current = true
        setIsListening(true)
        mouseActiveRef.current = true
      }

      const normalizedX = Math.max(-0.5, Math.min(0.5, gamma / 90)) * motionParams.gyroSensitivity
      const normalizedY = Math.max(-0.5, Math.min(0.5, beta / 180)) * motionParams.gyroSensitivity

      // 틸트 효과 (motionParams 적용)
      const maxTilt = motionParams.tiltSensitivity * scale
      const tiltX = normalizedY * maxTilt * 2
      const tiltY = normalizedX * maxTilt * 2
      setTiltOffset({ x: tiltX, y: tiltY })

      // 움직임 효과 (motionParams 적용)
      const moveRange = 150 * scale * motionParams.gyroSensitivity
      const moveX = normalizedX * moveRange * 2
      const moveY = normalizedY * moveRange * 2
      targetRef.current = { x: moveX, y: moveY }
    }

    window.addEventListener('deviceorientation', handleOrientation, true)

    const timeoutId = window.setTimeout(() => {
      if (!listeningRef.current) {
        console.log('센서 데이터를 받지 못함. 기기를 움직여보세요.')
      }
    }, 3000)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true)
      clearTimeout(timeoutId)
      listeningRef.current = false
      setIsListening(false)
      mouseActiveRef.current = false
    }
  }

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [])

  const handleGyroActivation = async () => {
    if (gyroStatus === 'pending' || gyroStatus === 'error' || gyroStatus === 'denied') {
      await requestPermission()
    }
  }

  const resetPosition = () => {
    targetRef.current = { x: 0, y: 0 }
    setTiltOffset({ x: 0, y: 0 })
  }

  // 마우스 호버 효과 (motionParams 적용)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // 틸트 효과 (motionParams 적용)
    const maxTilt = motionParams.tiltSensitivity * scale
    const tiltX = (mouseY / (rect.height / 2)) * maxTilt
    const tiltY = (-mouseX / (rect.width / 2)) * maxTilt
    setTiltOffset({ x: tiltX, y: tiltY })

    // 마우스 따라가기 (스케일에 비례)
    const moveRange = 80 * scale
    const moveX = (mouseX / (rect.width / 2)) * moveRange * 0.8
    const moveY = (mouseY / (rect.height / 2)) * moveRange
    targetRef.current = { x: moveX, y: moveY }
  }

  const handleMouseEnter = () => {
    if (isMobile) return
    setIsHovered(true)
    mouseActiveRef.current = true
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    setIsHovered(false)
    mouseActiveRef.current = false
    setTiltOffset({ x: 0, y: 0 })
    targetRef.current = { x: 0, y: 0 }
  }

  return (
    <>
      {/* 센서 UI들 */}
      {isMobile && gyroStatus === 'pending' && (
        <div className='absolute bottom-[22vh] md:top-auto md:bottom-4 md-landscape:top-auto md-landscape:bottom-4 left-1/2 transform -translate-x-1/2 z-50'>
          <button
            onClick={handleGyroActivation}
            className='px-6 py-2 rounded-[100px] bg-[#222222] hover:bg-[#333333] text-white font-medium'
          >
            <div className='text-[14px]'>디바이스로 움직이기</div>
          </button>
        </div>
      )}

      {isMobile && isListening && (
        <div className='absolute bottom-[22vh] md:top-auto md:bottom-4 md-landscape:top-auto md-landscape:bottom-4 left-1/2 transform -translate-x-1/2 z-50'>
          <div className='text-black font-semibold text-sm animate-pulse'>● 디바이스 움직임 감지 중</div>
        </div>
      )}

      {/* 메인 컨테이너 - 부모 크기에 맞게 자동 스케일링 */}
      <div
        ref={containerRef}
        className='relative transition-all duration-500 ease-out'
        style={{
          width: `${maxWidth}px`,
          height: `${maxHeight}px`,
          transform: `
            translate3d(${floatOffset.x}px, ${floatOffset.y}px, 0)
            rotateX(${tiltOffset.x}deg) 
            rotateY(${tiltOffset.y}deg)
            scale(${isHovered ? motionParams.hoverScale : 1})
          `,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onMouseEnter={!isMobile ? handleMouseEnter : undefined}
        onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      >
        {Array.from({ length: steps }).map((_, i) => {
          const factor = steps > 1 ? Math.pow(i / (steps - 1), motionParams.colorInterpolationPower) : 0
          const width = maxWidth - stepReduction * i
          const height = maxHeight - stepReduction * i
          const color = interpolateColor(brandColorHex, refinedColorHex, factor)
          const position = currentPositions[i] || { x: 0, y: 0 }

          return (
            <div
              key={i}
              className='absolute transition-all duration-100 ease-out'
              style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: color,
                borderRadius: i === 0 ? `${motionParams.borderRadiusOuter * scale}px` : '0px',
                top: '50%',
                left: '50%',
                transform: `
                  translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))
                  translateZ(${i * 4 * scale}px)
                `,
                boxShadow: isHovered
                  ? `0 ${(15 + i * 8) * scale * motionParams.shadowIntensity}px ${(30 + i * 8) * scale * motionParams.shadowIntensity}px rgba(0,0,0,0.15)`
                  : `0 ${(5 + i * 2) * scale * motionParams.shadowIntensity}px ${(10 + i * 2) * scale * motionParams.shadowIntensity}px rgba(0,0,0,0.05)`,
              }}
            />
          )
        })}
      </div>
    </>
  )
}

export function InteractPage({ interactionData, onStartOver }: InteractPageProps) {
  const { steps, positions, brandColorName, brandColorHex, refinedColorHex, text } = interactionData
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // 모션 컨트롤 관련 state 추가
  const [motionParams, setMotionParams] = useState<InteractMotionParams>({
    speedBase: 0.08,
    followSpeedMultiplier: 0.4,
    followSpeedOffset: 1.0,
    colorInterpolationPower: 0.9,
    floatAmplitude: 15,
    floatSpeed: 0.02,
    tiltSensitivity: 15,
    hoverScale: 1.08,
    shadowIntensity: 1.0,
    borderRadiusOuter: 8,
    gyroSensitivity: 1.0,
  })
  const [isMotionPanelVisible, setIsMotionPanelVisible] = useState(false)

  const handleMotionParamsChange = (params: InteractMotionParams) => {
    setMotionParams(params)
  }

  // 로컬 이미지 생성 함수 (motionParams 적용)
  const generateShareImageLocally = async (interactionData: InteractPageProps['interactionData']): Promise<string> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    // 인스타그램 스토리 사이즈 (9:16 비율)
    canvas.width = 1080
    canvas.height = 1920

    // 배경색 (흰색)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 상단 "New Formative" 텍스트
    ctx.fillStyle = '#6B7280'
    ctx.font = '36px "Saans TRIAL", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('New Formative', canvas.width / 2, 120)

    // "Your Movement" 대형 텍스트
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 182px "Saans TRIAL", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'

    // "Your" 텍스트
    ctx.fillText('Your', canvas.width / 2, 280)

    // "Movement" 텍스트
    ctx.fillText('Movement', canvas.width / 2, 420)

    // ConcentricSquares 그리기 (motionParams 적용)
    const scale = 2.2
    const maxWidth = 420
    const maxHeight = 316
    const stepReduction = 25
    const centerX = canvas.width / 2
    const centerY = 842 // 중앙 위치

    for (let i = 0; i < interactionData.steps; i++) {
      const factor = interactionData.steps > 1 ? Math.pow(i / (interactionData.steps - 1), motionParams.colorInterpolationPower) : 0
      const width = (maxWidth - stepReduction * i) * scale
      const height = (maxHeight - stepReduction * i) * scale

      const color = interpolateColor(interactionData.brandColorHex, interactionData.refinedColorHex, factor)

      const position = interactionData.positions[i] || { x: 0, y: 0 }
      const x = centerX + position.x * scale - width / 2
      const y = centerY + position.y * scale - height / 2

      ctx.fillStyle = color

      if (i === 0) {
        // 첫 번째 사각형은 둥근 모서리 (motionParams.borderRadiusOuter 적용)
        ctx.beginPath()
        const radius = motionParams.borderRadiusOuter * scale
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.fill()
      } else {
        ctx.fillRect(x, y, width, height)
      }
    }

    // 하단 "Is New Formative" 텍스트
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 182px "Saans TRIAL", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'

    ctx.fillText('Is New', canvas.width / 2, 1480)
    ctx.fillText('Formative', canvas.width / 2, 1620)

    ctx.fillStyle = '#6B7280'
    ctx.font = '37px "Saans TRIAL", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('©2025 Samsung Design Membership Emergence Project', canvas.width / 2, 1800)

    return canvas.toDataURL('image/png')
  }

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const imageDataUrl = await generateShareImageLocally(interactionData)

      const link = document.createElement('a')
      link.download = 'your-movement-creation.png'
      link.href = imageDataUrl
      link.click()
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='w-full h-full bg-white'>
      {/* 모션 컨트롤 패널 추가 */}
      <InteractMotionControlPanel
        onMotionParamsChange={handleMotionParamsChange}
        isVisible={isMotionPanelVisible}
        onToggle={() => setIsMotionPanelVisible(!isMotionPanelVisible)}
      />

      <div className='absolute top-[4vh] lg:top-0 z-20 md:z-0 left-1/2 transform -translate-x-1/2 w-full h-fit flex flex-col items-center justify-center relative'>
        <h3 className=' text-[34px] md:text-[96px] md-landscape:text-[132px] lg:text-[160px] whitespace-nowrap text-center font-semibold text-gray-800 font-english'>
          Your Movement
        </h3>
        <div className='block md:hidden'>{interactionData.text}</div>
      </div>

      <div
        className=' flex items-center justify-center w-full h-full md:h-[50vh] md-landscape:h-[60vh] lg:h-[80vh]'
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <FloatingConcentricSquares
          steps={steps}
          positions={positions}
          brandColorHex={brandColorHex}
          refinedColorHex={refinedColorHex}
          interactionData={interactionData}
          motionParams={motionParams}
        />
      </div>

      {/* left */}
      <div
        className={classNames(
          'absolute top-1/2 -translate-y-1/2 left-4 md:left-12 w-fit max-w-28 md:max-w-36 md-landscape:max-w-48 lg:max-w-56 text-center',
          'font-medium text-white text-[18px] md:text-[17px] md-landscape:text-[24px] lg:text-[28px] leading-[1.3] md:leading-[1.5] md-landscape:leading-[1.2] lg:leading-[1.2] mix-blend-difference',
        )}
      >
        <p className='block md:hidden break-keep'>{brandColorName}</p>
        <p className='hidden md:block break-keep'>{text}</p>
      </div>

      {/* right */}
      <div
        className={classNames(
          'absolute top-1/2 -translate-y-1/2 right-4 md:right-12 w-fit max-w-28 md:max-w-36 md-landscape:max-w-48 lg:max-w-56 text-center',
          'font-medium text-white text-[18px] md:text-[17px] md-landscape:text-[24px] lg:text-[28px]  leading-[1.3] md:leading-[1.5] md-landscape:leading-[1.2] lg:leading-[1.2] mix-blend-difference',
        )}
      >
        <div className='block md:hidden'>Rgb</div>
        <div className='block md:hidden'>{hexToRgb(brandColorHex).replace('rgb(', '').replace(')', '')}</div>
        <div className='hidden md:block whitespace-nowrap'>{brandColorName}</div>
        <div className='hidden md:block whitespace-nowrap'>{hexToRgb(brandColorHex)}</div>
      </div>

      <div className='absolute flex gap-3 bottom-20 left-1/2 transform -translate-x-1/2'>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className={classNames(
            'w-[150px] rounded-[100px] inline-flex justify-center items-center transition-all duration-200',
            'h-[44px] px-[36px]',
            isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#222222] hover:bg-[#333333]',
          )}
        >
          <div className='text-[18px] text-white font-medium'>{isGenerating ? 'Generating...' : 'Download'}</div>
        </button>
        <button
          disabled={isSharing}
          className={classNames(
            'w-[150px] rounded-[100px] inline-flex justify-center items-center transition-all duration-200',
            'h-[44px] px-[36px]',
            isSharing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#222222] hover:bg-[#333333]',
          )}
        >
          <div className='text-[18px] text-white font-medium'>{isSharing ? 'Sharing...' : 'Share'}</div>
        </button>
      </div>
    </div>
  )
}