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
  const steps = 12
  const defaultColors = [
    '#FF79B3', '#FF92AB', '#FFABA3', '#FFC59D', '#FEDE96', '#FFF790',
    '#FFDC7E', '#FFC46C', '#FDAB58', '#FF9246', '#FE7832', '#FF5E1E'
  ]
  const colors = squareColors || defaultColors

  const [isMobile, setIsMobile] = useState(false)
  const [isGyroSupported, setIsGyroSupported] = useState(false)
  const [showGyroButton, setShowGyroButton] = useState(false)
  const [gyroPermissionDenied, setGyroPermissionDenied] = useState(false)
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 })
  
  // 척추 시뮬레이션을 위한 상태 (각 사각형의 개별 물리 상태)
  const [spinePhysics, setSpinePhysics] = useState(() => 
    Array.from({ length: 12 }, () => ({
      velocityX: 0,
      velocityY: 0,
      positionX: 0,
      positionY: 0
    }))
  )

  const animationFrameRef = useRef<number | null>(null)

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

  // 척추 물리 시뮬레이션 업데이트
  useEffect(() => {
    if (!isGyroSupported) return

    const updateSpinePhysics = () => {
      setSpinePhysics(prevSpine => {
        const maxMovement = Math.min(screenSize.width, screenSize.height) * 0.35
        
        // 기울기를 -1 ~ 1 범위로 정규화
        const normalizedGammaX = orientation.gamma / 45
        const normalizedGammaY = orientation.gamma / 45
        
        const newSpine = [...prevSpine]
        
        // 가장 작은 사각형(마지막 인덱스)이 자이로 입력을 직접 받음
        const headIndex = steps - 1
        const accelerationMultiplier = 1.8
        const nonLinearFactor = 2.2
        
        const accelX = Math.sign(normalizedGammaX) * Math.pow(Math.abs(normalizedGammaX), nonLinearFactor) * accelerationMultiplier
        const accelY = Math.sign(normalizedGammaY) * Math.pow(Math.abs(normalizedGammaY), nonLinearFactor) * accelerationMultiplier
        
        // 머리 사각형 물리 업데이트
        newSpine[headIndex].velocityX += accelX
        newSpine[headIndex].velocityY += accelY
        
        const friction = 0.96
        newSpine[headIndex].velocityX *= friction
        newSpine[headIndex].velocityY *= friction
        
        const maxVelocity = 8
        newSpine[headIndex].velocityX = Math.max(-maxVelocity, Math.min(maxVelocity, newSpine[headIndex].velocityX))
        newSpine[headIndex].velocityY = Math.max(-maxVelocity, Math.min(maxVelocity, newSpine[headIndex].velocityY))
        
        newSpine[headIndex].positionX += newSpine[headIndex].velocityX
        newSpine[headIndex].positionY += newSpine[headIndex].velocityY
        
        // 나머지 사각형들은 단순하게 앞의 사각형을 따라감 (큰 사각형 순으로)
        for (let i = steps - 2; i >= 0; i--) {
          const followIndex = i + 1 // 바로 앞(더 작은) 사각형
          
          // 단순한 따라가기: 목표 위치를 향해 일정 비율로 이동
          const followStrength = 0.08 // 따라가는 강도
          const damping = 0.92 // 감속
          
          // 목표 위치로 향하는 벡터
          const targetX = newSpine[followIndex].positionX
          const targetY = newSpine[followIndex].positionY
          
          // 현재 위치에서 목표 위치로 조금씩 이동
          newSpine[i].positionX += (targetX - newSpine[i].positionX) * followStrength
          newSpine[i].positionY += (targetY - newSpine[i].positionY) * followStrength
          
          // 속도도 업데이트 (부드러운 움직임을 위해)
          newSpine[i].velocityX = (targetX - newSpine[i].positionX) * followStrength
          newSpine[i].velocityY = (targetY - newSpine[i].positionY) * followStrength
          newSpine[i].velocityX *= damping
          newSpine[i].velocityY *= damping
        }
        
        // 경계 처리
        newSpine.forEach(segment => {
          const boundary = maxMovement
          
          if (Math.abs(segment.positionX) > boundary) {
            segment.positionX = Math.sign(segment.positionX) * boundary
            segment.velocityX *= 0.5
          }
          if (Math.abs(segment.positionY) > boundary) {
            segment.positionY = Math.sign(segment.positionY) * boundary
            segment.velocityY *= 0.5
          }
        })
        
        return newSpine
      })
      
      animationFrameRef.current = requestAnimationFrame(updateSpinePhysics)
    }
    
    animationFrameRef.current = requestAnimationFrame(updateSpinePhysics)
    
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

                // 각 사각형의 개별 위치 사용 (척추 연결 효과)
                const currentMoveX = spinePhysics[i]?.positionX || 0
                const currentMoveY = spinePhysics[i]?.positionY || 0

                // 각 사각형의 속도에 따른 회전 (더 자연스러운 척추 움직임)
                const velocityX = spinePhysics[i]?.velocityX || 0
                const velocityY = spinePhysics[i]?.velocityY || 0
                const velocityMagnitude = Math.sqrt(velocityX ** 2 + velocityY ** 2)
                const baseRotation = -20
                const dynamicRotation = (velocityX * 0.8) + (velocityMagnitude * 1.2)
                const rotationZ = baseRotation + dynamicRotation

                return (
                  <div
                    key={i}
                    className='absolute transition-transform duration-50 ease-out'
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
          Head Vel (작은): {spinePhysics[steps-1]?.velocityX.toFixed(1) || 0}, {spinePhysics[steps-1]?.velocityY.toFixed(1) || 0}
          <br />
          Tail Vel (큰): {spinePhysics[0]?.velocityX.toFixed(1) || 0}, {spinePhysics[0]?.velocityY.toFixed(1) || 0}
        </div>
      )}
    </>
  )
}