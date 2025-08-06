'use client'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

declare global {
  interface DeviceOrientationEventConstructor {
    requestPermission?: () => Promise<'granted' | 'denied'>
  }
}

interface RotatedPaperDemoProps {
  onDirectionsClick: () => void
  displayName: string
  squareColors?: string[]
}

export function RotatedPaper({ className = '', isMobile = false }) {
  return (
    <div
      className={`
      w-[388.0000151880226px] h-[65dvh] ${isMobile ? 'bg-white/85' : 'bg-white'} rounded-lg
      md:w-[640.7787222419632px] md:h-[690.6728853097492px]
      landscape:md:w-[880.0000262670924px] landscape:md:h-[537.9999787440715px]
      lg:w-[880.0000262670924px] lg:h-[537.9999787440715px]
      ${className}
    `}
    ></div>
  )
}

export default function RotatedPaperDemo({ onDirectionsClick, displayName, squareColors }: RotatedPaperDemoProps) {
  const steps = 12
  const defaultColors = [
    '#FF79B3',
    '#FF92AB',
    '#FFABA3',
    '#FFC59D',
    '#FEDE96',
    '#FFF790',
    '#FFDC7E',
    '#FFC46C',
    '#FDAB58',
    '#FF9246',
    '#FE7832',
    '#FF5E1E',
  ]
  const colors = squareColors || defaultColors

  const [isMobile, setIsMobile] = useState(false)
  const [isGyroSupported, setIsGyroSupported] = useState(false)
  const [showGyroButton, setShowGyroButton] = useState(false)
  const [gyroPermissionDenied, setGyroPermissionDenied] = useState(false)
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 })

  // 각 사각형의 물리 상태
  const [physics, setPhysics] = useState({
    velocityX: 0,
    velocityY: 0,
    positionX: 0,
    positionY: 0,
    tilt: 0, // 기울기 값
  })

  const animationFrameRef = useRef<number | null>(null)
  const maxSize = Math.max(screenSize.width, screenSize.height) * 1.2
  const stepReduction = maxSize / (steps + 3)

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)

    const checkIfMobile = () => {
      const userAgent = navigator.userAgent
      const mobileRegex = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isMobileDevice = mobileRegex.test(userAgent) || isTouch

      setIsMobile(isMobileDevice)

      if (isMobileDevice) {
        setShowGyroButton(true)
      }
    }

    checkIfMobile()

    window.addEventListener('resize', checkIfMobile)
    return () => {
      window.removeEventListener('resize', updateScreenSize)
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const requestGyroPermission = async () => {
    const DeviceOrientationEventConstructor = DeviceOrientationEvent as DeviceOrientationEventConstructor

    if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEventConstructor.requestPermission) {
      try {
        const permission = await DeviceOrientationEventConstructor.requestPermission()
        if (permission === 'granted') {
          setIsGyroSupported(true)
          setShowGyroButton(false)
        } else {
          setGyroPermissionDenied(true)
          setShowGyroButton(false)
        }
      } catch (error) {
        console.log('자이로스코프 권한 요청 실패:', error)
        setGyroPermissionDenied(true)
        setShowGyroButton(false)
      }
    } else if (window.DeviceOrientationEvent) {
      setIsGyroSupported(true)
      setShowGyroButton(false)
    } else {
      setGyroPermissionDenied(true)
      setShowGyroButton(false)
    }
  }

  useEffect(() => {
    if (!isGyroSupported) return

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event
      if (beta !== null && gamma !== null) {
        setOrientation({
          beta: Math.max(-45, Math.min(45, beta)),
          gamma: Math.max(-45, Math.min(45, gamma)),
        })
      }
    }

    window.addEventListener('deviceorientation', handleDeviceOrientation)
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation)
  }, [isGyroSupported])

  // 물리 시뮬레이션 업데이트 (개선된 버전)
  useEffect(() => {
    if (!isGyroSupported) return

    const updatePhysics = () => {
      setPhysics((prevPhysics) => {
        const rawTilt = orientation.gamma / 4

        // 1. Dead Zone 적용 - 작은 기울기는 0으로 처리
        const DEAD_ZONE = 0.5 // 0.5도 이하는 무시
        const tiltValue = Math.abs(rawTilt) < DEAD_ZONE ? 0 : rawTilt

        // 2. Smoothing 적용 - 이전 값과 보간
        const SMOOTHING = 0.8 // 0.8 = 부드럽게, 0.2 = 즉시 반응
        const smoothedTilt = prevPhysics.tilt * SMOOTHING + tiltValue * (1 - SMOOTHING)

        // 3. 임계값 이하에서는 0으로 수렴
        const finalTilt = Math.abs(smoothedTilt) < 0.1 ? 0 : smoothedTilt

        // 기울기에 따른 기본 이동량 계산
        const baseTilt = Math.abs(finalTilt)

        // 4. 더 부드러운 가속 곡선 사용
        const acceleratedMovement = baseTilt === 0 ? 0 : baseTilt ** 1.5 * 0.03 // 제곱에서 1.5승으로, 계수도 줄임

        const maxMovement = Math.min(screenSize.width, screenSize.height) * acceleratedMovement
        const moveX = finalTilt === 0 ? 0 : (finalTilt * maxMovement) / 22.5
        const moveY = finalTilt === 0 ? 0 : (finalTilt * maxMovement) / 30

        // 5. 위치도 부드럽게 보간
        const POSITION_SMOOTHING = 0.85
        const smoothedX = prevPhysics.positionX * POSITION_SMOOTHING + moveX * (1 - POSITION_SMOOTHING)
        const smoothedY = prevPhysics.positionY * POSITION_SMOOTHING + moveY * (1 - POSITION_SMOOTHING)

        return {
          velocityX: 0,
          velocityY: 0,
          positionX: Math.abs(smoothedX) < 0.1 ? 0 : smoothedX, // 아주 작은 값은 0으로
          positionY: Math.abs(smoothedY) < 0.1 ? 0 : smoothedY,
          tilt: finalTilt,
        }
      })

      animationFrameRef.current = requestAnimationFrame(updatePhysics)
    }

    animationFrameRef.current = requestAnimationFrame(updatePhysics)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isGyroSupported, orientation, screenSize])

  return (
    <>
      {/* 모바일용 배경 효과 */}
      {isMobile && (
        <div className='fixed inset-0 pointer-events-none z-0'>
          {isGyroSupported && screenSize.width > 0 && (
            <div className='absolute inset-0 overflow-hidden'>
              {Array.from({ length: steps }).map((_, i) => {
                const size = maxSize - stepReduction * i
                const color = colors[i] || colors[colors.length - 1]

                // 기울기에 따른 회전각도: 왼쪽 기울이면 시계방향(+), 오른쪽 기울이면 반시계방향(-)
                const tiltRotation = -physics.tilt * 1.5 // 기울기 반전 후 강도 조절
                const baseRotation = -10 + i * 2 + tiltRotation

                const baseGap = 0.0 // 초기 아주 좁은 간격
                const springGap = baseGap + Math.abs(physics.tilt) ** 2 * 0.15
                const layerOffset = i * springGap // 큰 사각형(낮은 i)부터의 거리로 변경

                // 레이어별 움직임 차이: 큰 사각형(낮은 i)일수록 덜 움직임
                const layerMovementMultiplier = i * 0.08 // i=0이면 1.0, i=11이면 0.12

                // 기울기 방향에 따른 오프셋 계산 (더 강한 효과)
                const offsetDirection = physics.tilt > 0 ? 1 : -1 // 방향을 원래대로 복구
                const offsetX = offsetDirection * layerOffset * 1.2 // 0.7에서 1.2로 증가
                const offsetY = offsetDirection * layerOffset * 0.8 // 0.5에서 0.8로 증가

                // 최종 위치 계산: 기본 이동 + 스프링 오프셋 + 레이어별 차등 적용
                const finalX = physics.positionX * layerMovementMultiplier + offsetX
                const finalY = physics.positionY * layerMovementMultiplier + offsetY

                return (
                  <div
                    key={i}
                    className='absolute transition-transform duration-100 ease-out'
                    style={{
                      width: `${size * 1.5}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      top: '50%',
                      left: '50%',
                      transform: `
                        translate(-50%, -50%) 
                        translate(${finalX}px, ${finalY}px)
                        rotate(${baseRotation}deg)
                      `,
                      boxShadow: i === 0 ? '0 20px 60px rgba(0,0,0,0.15)' : 'none',
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className='fixed inset-0 flex items-center justify-center z-[100] overflow-hidden'>
        <div className='relative transform -rotate-6'>
          <RotatedPaper isMobile={isMobile} />
          <div className='absolute inset-0 flex flex-col items-center justify-center pr-8 pl-8 gap-[71px] md:gap-[82px] lg:gap-[88px] text-black z-[110] transform rotate-6'>
            <div className='text-center w-[79%] font-medium text-[17px] md:text-[18px] lg:text-[22px]'>
              <p className='leading-relaxed break-keep'>안녕하세요.</p>
              <p className='break-keep'>2025 MEP 〈Newformative〉에 {displayName}님을 초대합니다.</p>
              <p>
                전시는 8월 22일부터 27일까지, 삼성전자 서울 R&D 캠퍼스 A타워 2층, 이노베이션 스튜디오에서 진행됩니다.
                소중한 발걸음으로 자리를 빛내주세요.
              </p>
            </div>
            <div className='inline-flex flex-col justify-center items-center gap-3 text-[17px] md:text-[18px]'>
              <button
                onClick={onDirectionsClick}
                className='text-zinc-600 text-base lg:text-lg font-medium underline leading-relaxed hover:text-zinc-800 transition-colors'
              >
                오시는 길
              </button>
              <a
                href='https://www.newformative.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-zinc-600 text-base lg:text-lg font-medium underline leading-relaxed hover:text-zinc-800 transition-colors'
              >
                웹사이트 보러가기
              </a>
            </div>
          </div>
        </div>
      </div>

      {isMobile && showGyroButton && (
        <div className='fixed inset-0 flex items-center justify-center z-[1000] bg-[#000000DD] pointer-events-none'>
          <div className='pointer-events-auto'>
            <div className='bg-white/95 backdrop-blur-sm rounded-[10px] p-6 shadow-2xl text-center max-w-xs'>
              <div className='mb-4'>
                <div className='w-16 h-16 mx-auto mb-3 bg-[#222222] rounded-full flex items-center justify-center'>
                  <img src='/images/icon.svg' alt='Icon' className='w-12 h-12' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>움직임 효과 활성화</h3>
                <p className='text-sm text-gray-600'>기기를 기울여 배경과 상호작용해보세요</p>
              </div>
              <button
                onClick={requestGyroPermission}
                className='w-full bg-[#222222] text-white py-3 px-6 rounded-[10px] font-medium hover:from-pink-600 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 active:scale-95'
              >
                활성화하기
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobile && gyroPermissionDenied && (
        <div className='fixed top-4 left-4 z-[1000] pointer-events-auto'>
          <div className='bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm'>
            자이로스코프 권한이 필요합니다
          </div>
        </div>
      )}
    </>
  )
}
