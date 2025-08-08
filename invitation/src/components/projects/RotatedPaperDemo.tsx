'use client'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import MotionControlPanel, { MotionSettings } from './MotionControlPanel'

declare global {
  interface DeviceOrientationEventConstructor {
    requestPermission?: () => Promise<'granted' | 'denied'>
  }
}

type OrientationLockType =
  | 'portrait'
  | 'landscape'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape-primary'
  | 'landscape-secondary'

interface RotatedPaperDemoProps {
  onDirectionsClick: () => void
  displayName: string
  squareColors?: string[]
  onMotionPanelToggle?: (isOpen: boolean) => void
  onGyroButtonStateChange?: (isVisible: boolean) => void
}

export function RotatedPaper({ className = '', isMobile = false }) {
  return (
    <div
      className={`
      w-[388.0000151880226px] h-[65dvh] ${isMobile ? 'bg-white' : 'bg-white'} rounded-lg
      md:w-[640.7787222419632px] md:h-[690.6728853097492px]
      md-landscape:w-[880.0000262670924px] md-landscape:h-[537.9999787440715px]
      lg:w-[60vw] lg:h-[65dvh]
      ${className}
    `}
    ></div>
  )
}

export default function RotatedPaperDemo({
  onDirectionsClick,
  displayName,
  squareColors,
  onMotionPanelToggle,
  onGyroButtonStateChange,
}: RotatedPaperDemoProps) {
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
  const [initialOrientation, setInitialOrientation] = useState<'portrait' | 'landscape' | null>(null)

  const [motionSettings, setMotionSettings] = useState<MotionSettings>({
    deadZone: 0.5,
    smoothing: 0.8,
    positionSmoothing: 0.85,
    accelerationPower: 1.5,
    accelerationMultiplier: 0.03,
    tiltRotationMultiplier: 1.5,
    baseGap: 0.0,
    springGapMultiplier: 0.15,
    layerMovementMultiplier: 0.08,
    offsetXMultiplier: 1.2,
    offsetYMultiplier: 0.8,
  })

  const [physics, setPhysics] = useState({
    velocityX: 0,
    velocityY: 0,
    positionX: 0,
    positionY: 0,
    tiltX: 0,
    tiltY: 0,
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
        onGyroButtonStateChange?.(true)
      }
    }

    checkIfMobile()

    window.addEventListener('resize', checkIfMobile)
    return () => {
      window.removeEventListener('resize', updateScreenSize)
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  useEffect(() => {
    const detectAndLockOrientation = async () => {
      if (!isMobile) return

      try {
        let currentOrientation: 'portrait' | 'landscape' | null = null

        if (screen.orientation) {
          const orientationType = screen.orientation.type
          if (orientationType.includes('portrait')) {
            currentOrientation = 'portrait'
          } else if (orientationType.includes('landscape')) {
            currentOrientation = 'landscape'
          }
        } else {
          const isPortrait = window.innerHeight > window.innerWidth
          currentOrientation = isPortrait ? 'portrait' : 'landscape'
        }

        setInitialOrientation(currentOrientation)

        if ((screen.orientation as any)?.lock && currentOrientation) {
          await (screen.orientation as any).lock(currentOrientation as OrientationLockType)
        }
      } catch (error) {
        const isPortrait = window.innerHeight > window.innerWidth
        setInitialOrientation(isPortrait ? 'portrait' : 'landscape')
      }
    }

    if (isMobile) {
      detectAndLockOrientation()
    }

    return () => {
      try {
        if ((screen.orientation as any)?.unlock) {
          ;(screen.orientation as any).unlock()
        }
      } catch (error) {}
    }
  }, [isMobile])

  const requestGyroPermission = async () => {
    const DeviceOrientationEventConstructor = DeviceOrientationEvent as DeviceOrientationEventConstructor

    if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEventConstructor.requestPermission) {
      try {
        const permission = await DeviceOrientationEventConstructor.requestPermission()
        if (permission === 'granted') {
          setIsGyroSupported(true)
          setShowGyroButton(false)
          onGyroButtonStateChange?.(false)
        } else {
          setGyroPermissionDenied(true)
          setShowGyroButton(false)
          onGyroButtonStateChange?.(false)
        }
      } catch (error) {
        console.log('자이로스코프 권한 요청 실패:', error)
        setGyroPermissionDenied(true)
        setShowGyroButton(false)
        onGyroButtonStateChange?.(false)
      }
    } else if (window.DeviceOrientationEvent) {
      setIsGyroSupported(true)
      setShowGyroButton(false)
      onGyroButtonStateChange?.(false)
    } else {
      setGyroPermissionDenied(true)
      setShowGyroButton(false)
      onGyroButtonStateChange?.(false)
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

  useEffect(() => {
    if (!isGyroSupported) return

    const updatePhysics = () => {
      setPhysics((prevPhysics) => {
        const leftRightTilt = orientation.gamma
        const frontBackTilt = orientation.beta

        const tiltXValue = Math.abs(leftRightTilt) < motionSettings.deadZone ? 0 : leftRightTilt
        const tiltYValue = Math.abs(frontBackTilt) < motionSettings.deadZone ? 0 : frontBackTilt

        const smoothedTiltX = prevPhysics.tiltX * motionSettings.smoothing + tiltXValue * (1 - motionSettings.smoothing)
        const smoothedTiltY = prevPhysics.tiltY * motionSettings.smoothing + tiltYValue * (1 - motionSettings.smoothing)

        const finalTiltX = Math.abs(smoothedTiltX) < 0.1 ? 0 : smoothedTiltX
        const finalTiltY = Math.abs(smoothedTiltY) < 0.1 ? 0 : smoothedTiltY

        const moveX = finalTiltX * 5
        const moveY = finalTiltY * 5

        const smoothedX =
          prevPhysics.positionX * motionSettings.positionSmoothing + moveX * (1 - motionSettings.positionSmoothing)
        const smoothedY =
          prevPhysics.positionY * motionSettings.positionSmoothing + moveY * (1 - motionSettings.positionSmoothing)

        return {
          velocityX: 0,
          velocityY: 0,
          positionX: smoothedX,
          positionY: smoothedY,
          tiltX: finalTiltX,
          tiltY: finalTiltY,
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
  }, [isGyroSupported, orientation, screenSize, motionSettings])

  return (
    <>
      {isMobile && (
        <div className='fixed inset-0 pointer-events-none z-0'>
          {isGyroSupported && screenSize.width > 0 && (
            <div className='absolute inset-0 overflow-hidden'>
              {Array.from({ length: steps }).map((_, i) => {
                const size = maxSize - stepReduction * i
                const color = colors[i] || colors[colors.length - 1]

                const tiltRotation = physics.tiltX * motionSettings.tiltRotationMultiplier
                const baseRotation = -10 + i * 2 + tiltRotation

                const springGap =
                  motionSettings.baseGap + Math.abs(physics.tiltX) ** 2 * motionSettings.springGapMultiplier
                const layerOffset = i * springGap

                const layerMovementMultiplier = i * motionSettings.layerMovementMultiplier

                const offsetX =
                  physics.tiltX > 0
                    ? layerOffset * motionSettings.offsetXMultiplier
                    : -layerOffset * motionSettings.offsetXMultiplier
                const offsetY = 0

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
        <MotionControlPanel settings={motionSettings} onSettingsChange={setMotionSettings} />

      <div className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[100]'>
        <div className='relative transform -rotate-6'>
          <RotatedPaper isMobile={isMobile} />
          <div className='absolute inset-0 flex flex-col items-center justify-center pr-8 pl-8 gap-[71px] md:gap-[82px] lg:gap-[88px] text-black z-[110] transform rotate-6'>
            <div className='text-center w-[79%] font-medium text-[17px] md:text-[18px] lg:text-[1.5vw]'>
              <p className='leading-relaxed break-keep'>안녕하세요.</p>
              <p className='break-keep'>2025 MEP 〈Newformative〉에 {displayName}님을 초대합니다.</p>
              <p>
                전시는 8월 22일부터 27일까지, 삼성전자 서울 R&D 캠퍼스 A타워 2층, 이노베이션 스튜디오에서 진행됩니다.
                소중한 발걸음으로 자리를 빛내주세요.
              </p>
            </div>
            <div className='inline-flex flex-col justify-center items-center gap-3'>
              <button
                onClick={onDirectionsClick}
                className='text-zinc-600 text-base text-[17px] md:text-[18px] lg:text-[1.23vw] font-medium underline leading-relaxed hover:text-zinc-800 transition-colors'
              >
                오시는 길
              </button>
              <a
                href='https://www.newformative.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-zinc-600 text-base text-[17px] md:text-[18px] lg:text-[1.23vw] font-medium underline leading-relaxed hover:text-zinc-800 transition-colors'
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
                <div className='w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center'>
                  <img src='/images/icon.svg' alt='Icon' className='w-12 h-12' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>움직임 효과 활성화</h3>
                <p className='text-sm text-gray-600'>기기를 기울여 배경을 움직여보세요</p>
              </div>
              <button
                onClick={requestGyroPermission}
                className='w-full bg-[#222222] text-white py-3 px-6 rounded-[500px] font-medium hover:from-pink-600 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 active:scale-95'
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
