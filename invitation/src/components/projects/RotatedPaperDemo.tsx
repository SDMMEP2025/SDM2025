'use client'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

// iOS 13+ DeviceOrientationEvent 타입 확장
declare global {
  interface DeviceOrientationEventConstructor {
    requestPermission?: () => Promise<'granted' | 'denied'>
  }
}

interface RotatedPaperDemoProps {
  onDirectionsClick: () => void
  displayName: string
}

// 색상 보간 함수
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

// 전체화면 자이로 반응형 사각형 배경
function FullscreenGyroSquares() {
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 })
  const [isGyroSupported, setIsGyroSupported] = useState(false)
  const [showGyroButton, setShowGyroButton] = useState(false)
  const [gyroPermissionDenied, setGyroPermissionDenied] = useState(false)
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })

  const steps = 12
  const brandColorHex = '#FF60B9'
  const refinedColorHex = '#FBE870'

  // 화면 크기에 따른 사각형 크기 계산
  const maxSize = Math.max(screenSize.width, screenSize.height) * 1.5 // 화면보다 큰 크기로
  const stepReduction = maxSize / (steps + 2) // 단계별 크기 감소량

  useEffect(() => {
    // 화면 크기 설정
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)

    // 모바일 기기인지 확인하고 자이로 버튼 표시
    const userAgent = navigator.userAgent
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(userAgent)
    console.log('Mobile check:', isMobileDevice, userAgent) // 디버깅용

    if (isMobileDevice) {
      setShowGyroButton(true)
      console.log('Gyro button should show') // 디버깅용
    }

    return () => {
      window.removeEventListener('resize', updateScreenSize)
    }
  }, [])

  // 자이로스코프 권한 요청 함수
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
        }
      } catch (error) {
        console.log('자이로스코프 권한 요청 실패:', error)
        setGyroPermissionDenied(true)
      }
    } else if (window.DeviceOrientationEvent) {
      setIsGyroSupported(true)
      setShowGyroButton(false)
    } else {
      setGyroPermissionDenied(true)
    }
  }

  useEffect(() => {
    if (!isGyroSupported) return

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event
      if (beta !== null && gamma !== null) {
        setOrientation({
          beta: Math.max(-45, Math.min(45, beta)), // -45도 ~ 45도로 제한
          gamma: Math.max(-45, Math.min(45, gamma)), // -45도 ~ 45도로 제한
        })
      }
    }

    window.addEventListener('deviceorientation', handleDeviceOrientation)
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation)
  }, [isGyroSupported])

  // 자이로 값에 따른 이동 거리 계산
  const getMovement = () => {
    const maxMovement = Math.min(screenSize.width, screenSize.height) * 0.3 // 화면 크기의 30%까지 이동

    // gamma: 좌우 기울기 (-45 ~ 45도)
    // beta: 앞뒤 기울기 (-45 ~ 45도)
    const moveX = (orientation.gamma / 45) * maxMovement
    const moveY = (orientation.beta / 45) * maxMovement

    return { moveX, moveY }
  }

  const { moveX, moveY } = getMovement()

  return (
    <div className='fixed inset-0 pointer-events-none z-0'>
      {/* 자이로스코프가 활성화된 경우 전체화면 사각형들 렌더링 */}
      {isGyroSupported && screenSize.width > 0 && (
        <div className='absolute inset-0 overflow-hidden'>
          {Array.from({ length: steps }).map((_, i) => {
            const factor = steps > 1 ? Math.pow(i / (steps - 1), 0.9) : 0
            const size = maxSize - stepReduction * i
            const color = interpolateColor(brandColorHex, refinedColorHex, factor)

            // 각 사각형마다 다른 이동 강도 적용 (작은 사각형일수록 더 많이 움직임)
            const movementMultiplier = 1 + i * 0.15
            const currentMoveX = moveX * movementMultiplier
            const currentMoveY = moveY * movementMultiplier

            return (
              <div
                key={i}
                className='absolute transition-transform duration-100 ease-out'
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: i === 0 ? '24px' : `${Math.max(8, 24 - i * 2)}px`,
                  opacity: 0.6 + i * 0.04, // 뒤쪽 사각형일수록 약간 더 투명
                  top: '50%',
                  left: '50%',
                  transform: `
                    translate(-50%, -50%) 
                    translate(${currentMoveX}px, ${currentMoveY}px)
                  `,
                  boxShadow: i === 0 ? '0 20px 60px rgba(0,0,0,0.15)' : 'none',
                }}
              />
            )
          })}
        </div>
      )}

      {/* 자이로 상태 표시 (개발용) */}
      {isGyroSupported && (
        <div className='absolute top-4 right-4 bg-black/50 text-white p-2 rounded text-xs pointer-events-auto z-[50]'>
          β: {orientation.beta.toFixed(1)}° γ: {orientation.gamma.toFixed(1)}°
          <br />
          Move: {moveX.toFixed(0)}, {moveY.toFixed(0)}
        </div>
      )}
    </div>
  )
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

export default function RotatedPaperDemo({ onDirectionsClick, displayName }: RotatedPaperDemoProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isGyroSupported, setIsGyroSupported] = useState(false)
  const [showGyroButton, setShowGyroButton] = useState(false)
  const [gyroPermissionDenied, setGyroPermissionDenied] = useState(false)
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 })

  const steps = 12
  const brandColorHex = '#FF60B9'
  const refinedColorHex = '#FBE870'

  // 화면 크기에 따른 사각형 크기 계산
  const maxSize = Math.max(screenSize.width, screenSize.height) * 1.5
  const stepReduction = maxSize / (steps + 2)

  useEffect(() => {
    // 화면 크기 설정
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)

    // 실제 모바일 기기 감지 (User Agent 기반)
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

    // 화면 크기 변경 시에도 체크 (필요시)
    window.addEventListener('resize', checkIfMobile)
    return () => {
      window.removeEventListener('resize', updateScreenSize)
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // 자이로스코프 권한 요청 함수
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

  // 자이로 값에 따른 이동 거리 계산
  const getMovement = () => {
    const maxMovement = Math.min(screenSize.width, screenSize.height) * 0.3
    const moveX = (orientation.gamma / 45) * maxMovement
    const moveY = (orientation.beta / 45) * maxMovement
    return { moveX, moveY }
  }

  const { moveX, moveY } = getMovement()

  return (
    <>
      {/* 모바일에서만 자이로 반응 사각형들 표시 - 가장 아래 레이어 */}
      {isMobile && (
        <div className='fixed inset-0 pointer-events-none z-0'>
          {/* 자이로스코프가 활성화된 경우 전체화면 사각형들 렌더링 */}
          {isGyroSupported && screenSize.width > 0 && (
            <div className='absolute inset-0 overflow-hidden'>
              {Array.from({ length: steps }).map((_, i) => {
                const factor = steps > 1 ? Math.pow(i / (steps - 1), 0.9) : 0
                const size = maxSize - stepReduction * i
                const color = interpolateColor(brandColorHex, refinedColorHex, factor)

                const movementMultiplier = 1 + i * 0.15
                const currentMoveX = moveX * movementMultiplier
                const currentMoveY = moveY * movementMultiplier

                return (
                  <div
                    key={i}
                    className='absolute transition-transform duration-100 ease-out'
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      borderRadius: i === 0 ? '24px' : `${Math.max(8, 24 - i * 2)}px`,
                      opacity: 0.6 + i * 0.04,
                      top: '50%',
                      left: '50%',
                      transform: `
                        translate(-50%, -50%) 
                        translate(${currentMoveX}px, ${currentMoveY}px)
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

      {/* 초대장 종이 - 중간 레이어 */}
      <div className='fixed inset-0 flex items-center justify-center z-[100] overflow-hidden'>
        <div className='relative transform -rotate-6'>
          <RotatedPaper />
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

      {/* 자이로 활성화 버튼 - 가장 상단 레이어 */}
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

      {/* 권한 거부 메시지 */}
      {isMobile && gyroPermissionDenied && (
        <div className='fixed top-4 left-4 z-[1000] pointer-events-auto'>
          <div className='bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm'>
            자이로스코프 권한이 필요합니다
          </div>
        </div>
      )}

      {/* 자이로 상태 표시 (개발용) */}
      {isMobile && isGyroSupported && (
        <div className='fixed top-4 right-4 bg-black/50 text-white p-2 rounded text-xs pointer-events-auto z-[999]'>
          β: {orientation.beta.toFixed(1)}° γ: {orientation.gamma.toFixed(1)}°
          <br />
          Move: {moveX.toFixed(0)}, {moveY.toFixed(0)}
        </div>
      )}
    </>
  )
}
