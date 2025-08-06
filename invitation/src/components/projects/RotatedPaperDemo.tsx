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
      w-[388.0000151880226px] h-[65dvh] ${isMobile ? 'bg-white/90' : 'bg-white'} rounded-lg
      md:w-[640.7787222419632px] md:h-[690.6728853097492px]
      landscape:md:w-[880.0000262670924px] landscape:md:h-[537.9999787440715px]
      lg:w-[880.0000262670924px] lg:h-[537.9999787440715px]
      ${className}
    `}
    ></div>
  )
}

export default function RotatedPaperDemo({ onDirectionsClick, displayName, squareColors }: RotatedPaperDemoProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isGyroSupported, setIsGyroSupported] = useState(false)
  const [showGyroButton, setShowGyroButton] = useState(false)
  const [gyroPermissionDenied, setGyroPermissionDenied] = useState(false)
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 })
  
  // 물리 시뮬레이션을 위한 상태
  const [physics, setPhysics] = useState({
    velocityX: 0,
    velocityY: 0,
    positionX: 0,
    positionY: 0
  })

  const animationFrameRef = useRef<number | null>(null)

  const steps = 12
  const defaultColors = [
    '#FF79B3', '#FF92AB', '#FFABA3', '#FFC59D', '#FEDE96', '#FFF790',
    '#FFDC7E', '#FFC46C', '#FDAB58', '#FF9246', '#FE7832', '#FF5E1E'
  ]
  const colors = squareColors || defaultColors

  const maxSize = Math.max(screenSize.width, screenSize.height) * 2.2
  const stepReduction = maxSize / (steps + 2)

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

  // 물리 시뮬레이션 업데이트
  useEffect(() => {
    if (!isGyroSupported) return

    const updatePhysics = () => {
      setPhysics(prevPhysics => {
        const maxMovement = Math.min(screenSize.width, screenSize.height) * 0.4
        
        // 기울기를 -1 ~ 1 범위로 정규화
        const normalizedGammaX = orientation.gamma / 45
        const normalizedGammaY = orientation.gamma / 45
        
        // 기울기에 따른 가속도 계산 (제곱을 사용해서 작은 기울기에서는 느리게, 큰 기울기에서는 빠르게)
        const accelerationMultiplier = 2.5 // 가속도 강도 조절
        const nonLinearFactor = 2.2 // 비선형성 조절 (높을수록 더 급격한 변화)
        
        const accelX = Math.sign(normalizedGammaX) * Math.pow(Math.abs(normalizedGammaX), nonLinearFactor) * accelerationMultiplier
        const accelY = Math.sign(normalizedGammaY) * Math.pow(Math.abs(normalizedGammaY), nonLinearFactor) * accelerationMultiplier
        
        // 속도 업데이트 (가속도 적용)
        let newVelocityX = prevPhysics.velocityX + accelX
        let newVelocityY = prevPhysics.velocityY + accelY
        
        // 마찰력 적용 (속도 감소)
        const friction = 0.95
        newVelocityX *= friction
        newVelocityY *= friction
        
        // 속도 제한
        const maxVelocity = 12
        newVelocityX = Math.max(-maxVelocity, Math.min(maxVelocity, newVelocityX))
        newVelocityY = Math.max(-maxVelocity, Math.min(maxVelocity, newVelocityY))
        
        // 위치 업데이트
        let newPositionX = prevPhysics.positionX + newVelocityX
        let newPositionY = prevPhysics.positionY + newVelocityY
        
        // 경계 제한 (반발 없이 부드럽게 멈춤)
        const boundary = maxMovement
        if (Math.abs(newPositionX) > boundary) {
          newPositionX = Math.sign(newPositionX) * boundary
          newVelocityX = 0 // 경계에서 멈춤
        }
        if (Math.abs(newPositionY) > boundary) {
          newPositionY = Math.sign(newPositionY) * boundary
          newVelocityY = 0 // 경계에서 멈춤
        }
        
        return {
          velocityX: newVelocityX,
          velocityY: newVelocityY,
          positionX: newPositionX,
          positionY: newPositionY
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
      {isMobile && (
        <div className='fixed inset-0 pointer-events-none z-0'>
          {isGyroSupported && screenSize.width > 0 && (
            <div className='absolute inset-0 overflow-hidden'>
              {Array.from({ length: steps }).map((_, i) => {
                const size = maxSize - stepReduction * i
                const color = colors[i] || colors[colors.length - 1]

                // 레이어별 움직임 차이 (작은 사각형일수록 더 많이 움직임)
                const layerMultiplier = 1 + i * 0.15
                const currentMoveX = physics.positionX * layerMultiplier
                const currentMoveY = physics.positionY * layerMultiplier

                // 회전도 속도에 따라 조절 (움직임이 빠를수록 더 많이 회전)
                const velocityMagnitude = Math.sqrt(physics.velocityX ** 2 + physics.velocityY ** 2)
                const baseRotation = -20
                const dynamicRotation = (orientation.gamma / 45) * 15 + velocityMagnitude * 2
                const rotationMultiplier = 1 + i * 0.08
                const rotationZ = baseRotation + dynamicRotation * rotationMultiplier

                return (
                  <div
                    key={i}
                    className='absolute transition-transform duration-75 ease-out'
                    style={{
                      width: `${size*1.2}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      borderRadius: i === 0 ? '24px' : `${Math.max(8, 24 - i * 2)}px`,
                      top: '50%',
                      left: '50%',
                      transform: `
                        translate(-50%, -50%) 
                        translate(${currentMoveX}px, ${currentMoveY}px)
                        rotate(${rotationZ}deg)
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
          <div className='absolute inset-0 flex flex-col items-center justify-between pr-8 pl-8 pt-[22%] pb-[22%] text-black z-[110] transform rotate-6'>
            <div className='text-center w-[79%] font-medium text-[17px] md:text-[18px] lg:text-[22px]'>
              <p className='leading-relaxed break-keep'>안녕하세요.</p>
              <p className='break-keep'>2025 MEP 〈Newformative〉에 {displayName}님을 초대합니다.</p>
              <p>
                전시는 8월 22일부터 27일까지, 삼성전자 서울 R&D 캠퍼스 A타워 2층, 이노베이션 스튜디오에서 진행됩니다.
                <br className='md:block landscape:md:hidden lg:hidden' />
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

      {isMobile && isGyroSupported && (
        <div className='fixed top-4 right-4 bg-black/50 text-white p-2 rounded text-xs pointer-events-auto z-[999]'>
          γ: {orientation.gamma.toFixed(1)}°
          <br />
          Vel: {physics.velocityX.toFixed(1)}, {physics.velocityY.toFixed(1)}
          <br />
          Pos: {physics.positionX.toFixed(0)}, {physics.positionY.toFixed(0)}
        </div>
      )}
    </>
  )
}