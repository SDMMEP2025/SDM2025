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
  onDirectionsClick: () => void;
  displayName: string;
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

// 모바일 자이로 ConcentricSquares 컴포넌트
function MobileGyroSquares() {
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 })
  const [isGyroSupported, setIsGyroSupported] = useState(false)
  const [showGyroButton, setShowGyroButton] = useState(false)
  const [gyroPermissionDenied, setGyroPermissionDenied] = useState(false)

  const steps = 8
  const brandColorHex = '#FF6B6B'
  const refinedColorHex = '#4ECDC4'
  const maxWidth = 280
  const maxHeight = 210
  const stepReduction = 20

  useEffect(() => {
    // 모바일 기기인지 확인하고 자이로 버튼 표시
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      setShowGyroButton(true)
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
          beta: Math.max(-30, Math.min(30, beta)), // -30도 ~ 30도로 제한
          gamma: Math.max(-30, Math.min(30, gamma)) // -30도 ~ 30도로 제한
        })
      }
    }

    window.addEventListener('deviceorientation', handleDeviceOrientation)
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation)
  }, [isGyroSupported])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* 자이로 활성화 버튼 */}
      {showGyroButton && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl text-center max-w-xs">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                움직임 효과 활성화
              </h3>
              <p className="text-sm text-gray-600">
                기기를 기울여 배경과 상호작용해보세요
              </p>
            </div>
            <button
              onClick={requestGyroPermission}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              활성화하기
            </button>
          </div>
        </div>
      )}

      {/* 권한 거부 메시지 */}
      {gyroPermissionDenied && (
        <div className="absolute top-4 left-4 pointer-events-auto z-50">
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
            자이로스코프 권한이 필요합니다
          </div>
        </div>
      )}

      {/* 자이로스코프가 활성화된 경우 사각형들 렌더링 */}
      {isGyroSupported && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${maxWidth}px`,
            height: `${maxHeight}px`,
            transform: `translate(-50%, -50%) rotateX(${orientation.beta * 0.5}deg) rotateY(${orientation.gamma * 0.5}deg)`
          }}
        >
          {Array.from({ length: steps }).map((_, i) => {
            const factor = steps > 1 ? Math.pow(i / (steps - 1), 0.9) : 0
            const width = maxWidth - stepReduction * i
            const height = maxHeight - stepReduction * i
            const color = interpolateColor(brandColorHex, refinedColorHex, factor)
            
            // 각 사각형마다 다른 회전 강도 적용
            const rotationMultiplier = 1 + i * 0.1
            
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  backgroundColor: color,
                  borderRadius: i === 0 ? '12px' : '8px',
                  opacity: 0.7 + (i * 0.03), // 뒤쪽 사각형일수록 약간 더 투명
                  top: '50%',
                  left: '50%',
                  transform: `
                    translate(-50%, -50%) 
                    rotateX(${orientation.beta * rotationMultiplier * 0.3}deg) 
                    rotateY(${orientation.gamma * rotationMultiplier * 0.3}deg)
                    translateZ(${i * 2}px)
                  `,
                  transformStyle: 'preserve-3d',
                  boxShadow: i === 0 ? '0 10px 30px rgba(0,0,0,0.1)' : 'none'
                }}
              />
            )
          })}
        </div>
      )}
      
      {/* 자이로 상태 표시 (개발용 - 나중에 제거 가능) */}
      {isGyroSupported && (
        <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded text-xs pointer-events-auto">
          β: {orientation.beta.toFixed(1)}° γ: {orientation.gamma.toFixed(1)}°
        </div>
      )}
    </div>
  )
}

export function RotatedPaper({ className = '' }) {
  return (
    <div
      className={`
      w-[388.0000151880226px] h-[70dvh] bg-white rounded-lg
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

  useEffect(() => {
    // 실제 모바일 기기 감지 (User Agent 기반)
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent
      const mobileRegex = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i
      setIsMobile(mobileRegex.test(userAgent))
    }

    checkIfMobile()
    
    // 화면 크기 변경 시에도 체크 (필요시)
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  return (
    <>
      {/* 모바일에서만 자이로 반응 사각형들 표시 */}
      {isMobile && <MobileGyroSquares />}
      
      <div className='fixed inset-0 flex items-center justify-center z-10 overflow-hidden'>
        <div className='relative transform -rotate-6'>
          <RotatedPaper />
          <div className='absolute inset-0 flex flex-col items-center justify-center p-8 gap-[76px] md:gap-[82px] lg:gap-[88px] text-black z-[400] transform rotate-6'>
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
                className="text-zinc-600 text-base lg:text-lg font-medium underline leading-relaxed hover:text-zinc-800 transition-colors"
              >
                오시는 길
              </button>
              <a
                href='https://www.newformative.com/'
                target='_blank'
                rel='noopener noreferrer'
                className="text-zinc-600 text-base lg:text-lg font-medium underline leading-relaxed hover:text-zinc-800 transition-colors"
              >
                웹사이트 보러가기
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}