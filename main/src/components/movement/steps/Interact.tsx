'use client'

import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'

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
}: {
  steps: number
  positions: Array<{ x: number; y: number }>
  brandColorHex: string
  refinedColorHex: string
  interactionData: InteractPageProps['interactionData']
}) {
  const maxWidth = 420
  const maxHeight = 316
  const stepReduction = 25
  const containerRef = useRef<HTMLDivElement>(null)

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

  // 모바일 환경 감지 및 초기 지원 확인
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const userAgent = navigator.userAgent
      const isIOS = /iPad|iPhone|iPod/.test(userAgent)
      const isHTTPS = window.location.protocol === 'https:'
      
      setIsMobile(isTouchDevice)
      
      console.log('디바이스 정보:', { isTouchDevice, isIOS, isHTTPS })
      
      if (isTouchDevice && typeof DeviceOrientationEvent !== 'undefined') {
        console.log('✅ DeviceOrientationEvent 지원됨')
        // iOS가 아니면 자동으로 granted 처리
        if (!isIOS) {
          setGyroStatus('granted')
        }
      } else if (isTouchDevice) {
        console.log('❌ DeviceOrientationEvent 지원되지 않음')
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
  }, [gyroStatus, isMobile])

  // 부유 애니메이션
  useEffect(() => {
    let frame: number
    let time = 0

    const animate = () => {
      time += 0.02
      setFloatOffset({
        x: Math.sin(time) * 15,
        y: Math.cos(time * 0.8) * 10,
      })
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  // 마우스 따라 움직이는 애니메이션
  useEffect(() => {
    let frame: number
    const speedBase = 0.08

    const animate = () => {
      setCurrentPositions(prev => {
        const newPositions = [...prev]
        const target = targetRef.current

        const lastIdx = steps - 1
        if (lastIdx >= 0 && mouseActiveRef.current) {
          // 마지막 사각형이 마우스 위치를 따라감 (더 여유롭게)
          const last = newPositions[lastIdx]
          const newX = last.x + (target.x - last.x) * speedBase
          const newY = last.y + (target.y - last.y) * speedBase
          newPositions[lastIdx] = { x: newX, y: newY }
        }

        // 나머지 사각형들이 앞의 사각형을 따라오게 (3D 효과를 위해 더 자유롭게)
        for (let i = lastIdx - 1; i >= 0; i--) {
          const current = newPositions[i]
          const next = newPositions[i + 1]
          const speed = speedBase * (0.4 + i / steps) // 더 부드럽게
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
  }, [steps])

  // 권한 요청 함수
  const requestPermission = async () => {
    console.log('권한 요청 시작...')
    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        console.log('iOS 권한 요청 중...')
        const permissionResult = await (DeviceOrientationEvent as any).requestPermission()
        console.log(`권한 결과: ${permissionResult}`)
        setGyroStatus(permissionResult)
      } else {
        console.log('직접 센서 활성화 시도...')
        setGyroStatus('granted')
      }
    } catch (error: any) {
      console.error('권한 요청 실패:', error)
      setGyroStatus('denied')
    }
  }

  // 자이로스코프 활성화 & 클린업 반환
  const enableGyroscope = () => {
    console.log('센서 리스너 등록 중...')

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta ?? 0
      const gamma = event.gamma ?? 0

      setSensorData({ beta: beta.toFixed(1), gamma: gamma.toFixed(1) })

      if (!listeningRef.current) {
        listeningRef.current = true
        setIsListening(true)
        mouseActiveRef.current = true
        console.log('✅ 센서 데이터 수신 시작')
      }

      // 참고 코드처럼 -0.5 ~ 0.5로 정규화하고 더 넓은 범위로 적용
      const normalizedX = Math.max(-0.5, Math.min(0.5, gamma / 90))  // gamma: 좌우 기울기
      const normalizedY = Math.max(-0.5, Math.min(0.5, beta / 180))  // beta: 앞뒤 기울기

      // 틸트 효과 (더 부드럽게)
      const maxTilt = 15
      const tiltX = normalizedY * maxTilt * 2  // 앞뒤 기울기 → X축 틸트
      const tiltY = normalizedX * maxTilt * 2  // 좌우 기울기 → Y축 틸트
      setTiltOffset({ x: tiltX, y: tiltY })

      // 움직임 효과 (더 넓은 범위로)
      const moveRange = 150
      const moveX = normalizedX * moveRange * 2
      const moveY = normalizedY * moveRange * 2
      targetRef.current = { x: moveX, y: moveY }

      // 간헐적으로 로그 출력
      if (Math.random() < 0.005) {
        console.log('센서 데이터:', { beta: beta.toFixed(1), gamma: gamma.toFixed(1), normalizedX, normalizedY })
      }
    }

    window.addEventListener('deviceorientation', handleOrientation, true)
    
    // 3초 후에도 데이터를 받지 못하면 안내
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
      console.log('🛑 센서 리스너 해제됨')
    }
  }

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        console.log('🛑 자이로 센서 정리됨')
      }
    }
  }, [])

  // 자이로 센서 활성화 버튼 핸들러
  const handleGyroActivation = async () => {
    if (gyroStatus === 'pending' || gyroStatus === 'error' || gyroStatus === 'denied') {
      await requestPermission()
    }
  }

  // 위치 리셋 함수
  const resetPosition = () => {
    targetRef.current = { x: 0, y: 0 }
    setTiltOffset({ x: 0, y: 0 })
  }

  // 마우스 호버 틸트 효과 + 마우스 따라가기 (데스크톱만)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // 틸트 효과
    const maxTilt = 15
    const tiltX = (mouseY / (rect.height / 2)) * maxTilt
    const tiltY = (-mouseX / (rect.width / 2)) * maxTilt
    setTiltOffset({ x: tiltX, y: tiltY })

    // 마우스 따라가기 (더 넓은 범위로)
    const moveRange = 80 // 움직임 범위를 더 넓게
    const moveX = (mouseX / (rect.width / 2)) * moveRange
    const moveY = (mouseY / (rect.height / 2)) * moveRange
    targetRef.current = { x: moveX, y: moveY }
  }

  const handleMouseEnter = () => {
    if (isMobile) return // 모바일에서는 호버 효과 비활성화
    setIsHovered(true)
    mouseActiveRef.current = true
  }
  
  const handleMouseLeave = () => {
    if (isMobile) return // 모바일에서는 호버 효과 비활성화
    setIsHovered(false)
    mouseActiveRef.current = false
    setTiltOffset({ x: 0, y: 0 })
    targetRef.current = { x: 0, y: 0 }
  }

  return (
    <>
      {/* 자이로 센서 활성화 버튼 (모바일에서만 표시) */}
      {isMobile && gyroStatus === 'pending' && (
        <div className='absolute top-20 left-1/2 transform -translate-x-1/2 z-50'>
          <button
            onClick={handleGyroActivation}
            className={classNames(
              'px-6 py-3 rounded-[100px] inline-flex justify-center items-center transition-all duration-200',
              'bg-[#222222] hover:bg-[#333333] text-white font-medium',
              'shadow-lg border border-gray-200'
            )}
          >
            <div className='text-[16px]'>📱 기기를 기울여 움직이기</div>
          </button>
        </div>
      )}

      {/* 센서 활성화됨 상태 */}
      {isMobile && isListening && (
        <div className='absolute top-20 left-1/2 transform -translate-x-1/2 z-50'>
          <div className='flex flex-col items-center gap-2'>
            <div className='px-4 py-2 rounded-lg bg-green-100 text-green-800 text-sm'>
              🟢 센서 활성화됨 - 기기를 기울여보세요!
            </div>
            <div className='text-xs text-gray-600'>
              β: {sensorData.beta}° γ: {sensorData.gamma}°
            </div>
            <button
              onClick={resetPosition}
              className='px-3 py-1 rounded-lg bg-gray-500 text-white text-xs hover:bg-gray-600'
            >
              🔄 위치 리셋
            </button>
          </div>
        </div>
      )}

      {/* 센서 대기 중 */}
      {isMobile && gyroStatus === 'granted' && !isListening && (
        <div className='absolute top-20 left-1/2 transform -translate-x-1/2 z-50'>
          <div className='px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 text-sm'>
            🟡 센서 대기 중... 기기를 움직여보세요
          </div>
        </div>
      )}

      {/* 권한 거부 상태 안내 */}
      {isMobile && gyroStatus === 'denied' && (
        <div className='absolute top-20 left-1/2 transform -translate-x-1/2 z-50'>
          <div className='flex flex-col items-center gap-3'>
            <div className='px-4 py-2 rounded-lg bg-red-100 text-red-800 text-sm text-center'>
              자이로 센서 권한이 거부되었습니다
              <br />
              <span className='text-xs'>브라우저 설정에서 모션 센서를 허용해주세요</span>
            </div>
            <button
              onClick={handleGyroActivation}
              className='px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600'
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 에러 상태 안내 */}
      {isMobile && gyroStatus === 'error' && (
        <div className='absolute top-20 left-1/2 transform -translate-x-1/2 z-50'>
          <div className='flex flex-col items-center gap-3'>
            <div className='px-4 py-2 rounded-lg bg-red-100 text-red-800 text-sm text-center'>
              자이로 센서를 사용할 수 없습니다
              <br />
              <span className='text-xs'>기기에서 모션 센서를 지원하지 않을 수 있습니다</span>
            </div>
            <button
              onClick={handleGyroActivation}
              className='px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600'
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

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
            scale(${isHovered ? 1.08 : 1})
          `,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onMouseEnter={!isMobile ? handleMouseEnter : undefined}
        onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      >
        {Array.from({ length: steps }).map((_, i) => {
          const factor = steps > 1 ? Math.pow(i / (steps - 1), 0.9) : 0
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
                borderRadius: i === 0 ? '8px' : '0px',
                top: '50%',
                left: '50%',
                transform: `
                  translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))
                  translateZ(${i * 4}px)
                `,
                boxShadow: isHovered
                  ? `0 ${15 + i * 8}px ${30 + i * 8}px rgba(0,0,0,0.15)`
                  : `0 ${5 + i * 2}px ${10 + i * 2}px rgba(0,0,0,0.05)`,
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

  // 로컬 이미지 생성 함수
  const generateShareImageLocally = async (
    interactionData: InteractPageProps['interactionData']
  ): Promise<string> => {
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
    
    // ConcentricSquares 그리기
    const scale = 2.2
    const maxWidth = 420
    const maxHeight = 316
    const stepReduction = 25
    const centerX = canvas.width / 2
    const centerY = 842 // 중앙 위치
    
    for (let i = 0; i < interactionData.steps; i++) {
      const factor = interactionData.steps > 1 ? Math.pow(i / (interactionData.steps - 1), 0.9) : 0
      const width = (maxWidth - stepReduction * i) * scale
      const height = (maxHeight - stepReduction * i) * scale
      
      const color = interpolateColor(interactionData.brandColorHex, interactionData.refinedColorHex, factor)
      
      const position = interactionData.positions[i] || { x: 0, y: 0 }
      const x = centerX + position.x * scale - width / 2
      const y = centerY + position.y * scale - height / 2
      
      ctx.fillStyle = color
      
      if (i === 0) {
        // 첫 번째 사각형은 둥근 모서리
        ctx.beginPath()
        const radius = 8 * scale
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
      <h3 className='absolute whitespace-nowrap left-1/2 transform -translate-x-1/2 text-center text-[160px] font-semibold text-gray-800 mt-4 font-english'>
        Your Movement
      </h3>

      <div className='absolute mt-2 flex top-1/2 left-1/2 transform -translate-y-1/2 transform -translate-x-1/2 tems-center justify-center'>
        <FloatingConcentricSquares
          steps={steps}
          positions={positions}
          brandColorHex={brandColorHex}
          refinedColorHex={refinedColorHex}
          interactionData={interactionData}
        />
      </div>

      <div className='absolute top-1/2 w-full'>
        <div className='flex items-center justify-between mx-[160px]'>
          <p className='font-medium w-56 text-3xl text-black text-center leading-relaxed'>{text}</p>
          <div className='font-medium text-center'>
            <div className='text-3xl'>{brandColorName}</div>
            <div className='text-3xl'>{hexToRgb(brandColorHex)}</div>
          </div>
        </div>
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