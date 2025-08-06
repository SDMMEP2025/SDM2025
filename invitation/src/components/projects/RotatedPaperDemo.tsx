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
  
  // 바이킹 효과를 위한 상태
  const [momentum, setMomentum] = useState({ x: 0, y: 0, rotation: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0, rotation: 0 })
  const [lastOrientation, setLastOrientation] = useState({ beta: 0, gamma: 0 })
  const animationFrameRef = useRef<number | null>(null)

  const steps = 12
  const defaultColors = [
    '#FF79B3', '#FF92AB', '#FFABA3', '#FFC59D', '#FEDE96', '#FFF790',
    '#FFDC7E', '#FFC46C', '#FDAB58', '#FF9246', '#FE7832', '#FF5E1E'
  ]
  const colors = squareColors || defaultColors

  const maxSize = Math.max(screenSize.width, screenSize.height) * 1.5
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
        const newOrientation = {
          beta: Math.max(-45, Math.min(45, beta)),
          gamma: Math.max(-45, Math.min(45, gamma)),
        }
        setLastOrientation(orientation)
        setOrientation(newOrientation)
      }
    }

    window.addEventListener('deviceorientation', handleDeviceOrientation)
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation)
  }, [isGyroSupported])

  // 바이킹 물리 엔진 - 누적 가속도!
  useEffect(() => {
    if (!isGyroSupported) return

    const animate = () => {
      setVelocity(prevVel => {
        const maxMovement = Math.min(screenSize.width, screenSize.height) * 0.3
        
        // 기기 기울기 변화량 계산 (바이킹의 핵심!)
        const deltaGamma = orientation.gamma - lastOrientation.gamma
        const deltaBeta = orientation.beta - lastOrientation.beta
        
        // 같은 방향으로 계속 기울이면 가속도 누적
        const gammaAcceleration = deltaGamma * 8 // 기울기 변화에 비례한 가속도
        const betaAcceleration = deltaBeta * 8
        
        // 현재 속도와 같은 방향이면 더 빨라지고, 반대면 브레이킹
        const currentGammaDirection = Math.sign(prevVel.rotation)
        const currentGammaInput = Math.sign(orientation.gamma)
        
        // 바이킹 효과: 같은 방향이면 부스터, 반대면 브레이크
        const rotationBoost = currentGammaDirection === currentGammaInput ? 1.3 : 0.7
        
        // 새로운 속도 계산
        let newVelX = prevVel.x + gammaAcceleration * 0.3
        let newVelY = prevVel.y + betaAcceleration * 0.3
        let newVelRotation = (prevVel.rotation + (orientation.gamma * 0.8)) * rotationBoost
        
        // 마찰력 (공기저항)
        newVelX *= 0.92
        newVelY *= 0.92
        newVelRotation *= 0.94
        
        // 최대 속도 제한 (바이킹도 한계가 있으니까)
        const maxVel = maxMovement * 1.2 // 기존보다 더 빠르게!
        newVelX = Math.max(-maxVel, Math.min(maxVel, newVelX))
        newVelY = Math.max(-maxVel, Math.min(maxVel, newVelY))
        newVelRotation = Math.max(-50, Math.min(50, newVelRotation))
        
        return {
          x: newVelX,
          y: newVelY,
          rotation: newVelRotation
        }
      })

      // 위치 업데이트
      setMomentum(prev => ({
        x: prev.x + velocity.x,
        y: prev.y + velocity.y,
        rotation: prev.rotation + velocity.rotation
      }))

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isGyroSupported, orientation, lastOrientation, velocity, screenSize])

  return (
    <>
      {isMobile && (
        <div className='fixed inset-0 pointer-events-none z-0'>
          {isGyroSupported && screenSize.width > 0 && (
            <div className='absolute inset-0 overflow-hidden'>
              {Array.from({ length: steps }).map((_, i) => {
                const size = maxSize - stepReduction * i
                const color = colors[i] || colors[colors.length - 1]

                // 바이킹 효과: 각 레이어마다 다른 관성과 오버슈팅
                const layerInertia = 1 + i * 0.12
                const overshoot = Math.sin(Date.now() * 0.003 + i) * (Math.abs(momentum.rotation) * 0.02)
                
                const currentMoveX = momentum.x * layerInertia + overshoot
                const currentMoveY = momentum.y * layerInertia
                
                // 회전은 더 과격하게!
                const rotationInertia = 1.5 - i * 0.08
                const currentRotation = momentum.rotation * rotationInertia + (i * 3) + overshoot * 2

                return (
                  <div
                    key={i}
                    className='absolute'
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      borderRadius: i === 0 ? '24px' : `${Math.max(8, 24 - i * 2)}px`,
                      top: '50%',
                      left: '50%',
                      transform: `
                        translate(-50%, -50%) 
                        translate(${currentMoveX}px, ${currentMoveY}px)
                        rotate(${currentRotation}deg)
                      `,
                      boxShadow: i === 0 ? '0 20px 60px rgba(0,0,0,0.15)' : 'none',
                      transition: 'none', // 부드러운 애니메이션을 위해 transition 제거
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
          β: {orientation.beta.toFixed(1)}° γ: {orientation.gamma.toFixed(1)}°
          <br />
          Momentum: {momentum.x.toFixed(0)}, {momentum.y.toFixed(0)}, {momentum.rotation.toFixed(1)}°
          <br />
          Velocity: {velocity.x.toFixed(1)}, {velocity.y.toFixed(1)}
        </div>
      )}
    </>
  )
}