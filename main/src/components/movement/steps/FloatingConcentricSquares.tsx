'use client'

import React, { useEffect, useRef, useState } from 'react'

export type AxisLockMode = 'none' | 'x' | 'y' | 'dominant'

export interface InteractMotionParams {
  colorInterpolationPower: number
  tiltSensitivity: number
  hoverScale: number
  shadowIntensity: number
  borderRadiusOuter: number
  gyroSensitivity: number
  axisLock?: AxisLockMode
  axisLockThreshold?: number
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null
  }
  const rgbToHex = (r: number, g: number, b: number) =>
    '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

  const a = hexToRgb(color1)
  const b = hexToRgb(color2)
  if (!a || !b) return color1
  const rr = Math.round(a.r + factor * (b.r - a.r))
  const gg = Math.round(a.g + factor * (b.g - a.g))
  const bb = Math.round(a.b + factor * (b.b - a.b))
  return rgbToHex(rr, gg, bb)
}

// 우세축 히스테리시스 적용
function makeAxisLocker() {
  const lastAxisRef = { current: 'x' as 'x' | 'y' }
  return function applyAxisLock(
    x: number,
    y: number,
    mode: AxisLockMode,
    thr: number, // 거리 기준
  ) {
    if (mode === 'x') return { x, y: 0 }
    if (mode === 'y') return { x: 0, y }
    if (mode === 'dominant') {
      const ax = Math.abs(x)
      const ay = Math.abs(y)
      if (ax > ay + thr) lastAxisRef.current = 'x'
      else if (ay > ax + thr) lastAxisRef.current = 'y'
      return lastAxisRef.current === 'x' ? { x, y: 0 } : { x: 0, y }
    }
    return { x, y }
  }
}
const applyAxisLock = makeAxisLocker()

export interface FloatingConcentricSquaresProps {
  steps: number
  positions: Array<{ x: number; y: number }>
  brandColorHex: string
  refinedColorHex: string
  motionParams: InteractMotionParams
  showMobileGyroUI?: boolean
}

export default function FloatingConcentricSquares({
  steps,
  positions,
  brandColorHex,
  refinedColorHex,
  motionParams,
  showMobileGyroUI = true,
}: FloatingConcentricSquaresProps) {
  // 디자인 기준 값
  const BASE_W = 420
  const BASE_H = 316
  const BASE_STEP = 25

  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // tilt / hover
  const [tiltOffset, setTiltOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // 꼬리물기 포지션 - (현 버전에서는 base만 사용)
  const [currentPositions, setCurrentPositions] = useState(positions)
  const targetRef = useRef({ x: 0, y: 0 })
  const mouseActiveRef = useRef(false)

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized && positions.length > 0) {
      setCurrentPositions(positions)
      setIsInitialized(true)
    }
  }, [positions, isInitialized])

  // 모바일/자이로
  const [isMobile, setIsMobile] = useState(false)
  const [gyroStatus, setGyroStatus] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [isListening, setIsListening] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const tickingRef = useRef(false)

  // ★ 자이로 기준(베이스라인) & 마지막 이벤트 저장
  const baselineRef = useRef<{ beta: number; gamma: number } | null>(null) // 기준값
  const lastEventRef = useRef<DeviceOrientationEvent | null>(null) // 최근 이벤트

  // ★ 현재 자세를 즉시 기준으로 재설정
  const calibrateNow = () => {
    const ev = lastEventRef.current
    if (ev) {
      const beta = ev.beta ?? 0
      const gamma = ev.gamma ?? 0
      baselineRef.current = { beta, gamma }
    }
  }

  // 부모 크기 기반 스케일
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current?.parentElement) return
      const p = containerRef.current.parentElement.getBoundingClientRect()
      const wScale = (p.width * 0.8) / BASE_W
      const hScale = (p.height * 0.65) / BASE_H
      const s = Math.min(wScale, hScale, 1.5)
      setScale(Math.max(0.4, s))
    }
    let ro: ResizeObserver | null = null
    if (containerRef.current?.parentElement) {
      ro = new ResizeObserver(updateScale)
      ro.observe(containerRef.current.parentElement)
    }
    updateScale()
    addEventListener('resize', updateScale)
    return () => {
      ro?.disconnect()
      removeEventListener('resize', updateScale)
    }
  }, [])

  const maxWidth = BASE_W * scale
  const maxHeight = BASE_H * scale
  const stepReduction = BASE_STEP * scale

  const EMA_ALPHA = 0.18 // 0.1~0.3 권장 (낮을수록 부드러움)
  const DEADZONE = 0.02 // 0~0.04 권장 (정규화 후 기준)
  const QUANT = 0.0025 // 0.001~0.005 (값을 이 스텝으로 계단화)
  const TILT_EASE = 0.15 // 0.1~0.25 (틸트 오프셋 easing)
  const TARGET_EASE = 0.12 // 0.08~0.2 (타깃 위치 easing)

  // 필터 상태 보관
  const nxFiltRef = useRef(0)
  const nyFiltRef = useRef(0)

  // tiltOffset을 setState 전에 누적 보간할 버퍼
  const tiltRef = useRef({ x: 0, y: 0 })

  // 가로/세로 방향 매핑
  const orientMap = (beta: number, gamma: number) => {
    const so = (screen as any)?.orientation?.type || (window as any)?.orientation
    const isLandscape = typeof so === 'string' ? so.includes('landscape') : Math.abs(Number(so)) === 90
    // 단순 매핑: 가로모드에선 축을 스왑하고 한쪽 부호 반전
    if (isLandscape) return { beta: gamma, gamma: -beta }
    return { beta, gamma }
  }

  // 모바일 감지 (권한 판정은 버튼에서)
  useEffect(() => {
    const check = () => {
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(touch)
      if (!touch) setGyroStatus('pending')
    }
    check()
    addEventListener('resize', check)
    return () => removeEventListener('resize', check)
  }, [])

  // 자이로 리스너
  const enableGyroscope = () => {
    // ★ 버튼을 누를 때마다 기준을 새로 잡도록, 우선 기준을 비운다.
    //   (첫 이벤트가 들어오는 순간의 자세가 기준이 된다.)
    if (!baselineRef.current) {
      // noop — handleGyroActivation에서 null로 만들어 둠
    }

    const onOri = (ev: DeviceOrientationEvent) => {
      lastEventRef.current = ev
      if (tickingRef.current) return
      tickingRef.current = true

      requestAnimationFrame(() => {
        tickingRef.current = false

        // 원시값
        let rawBeta = ev.beta ?? 0
        let rawGamma = ev.gamma ?? 0

        // 화면 방향에 맞게 축 보정
        ;({ beta: rawBeta, gamma: rawGamma } = orientMap(rawBeta, rawGamma))

        // 기준 잡기
        if (!baselineRef.current) {
          baselineRef.current = { beta: rawBeta, gamma: rawGamma }
        }

        // 기준 대비 델타
        const dBeta = rawBeta - (baselineRef.current?.beta ?? 0)
        const dGamma = rawGamma - (baselineRef.current?.gamma ?? 0)

        // 정규화 + 감도
        const nxRaw = Math.max(-0.5, Math.min(0.5, dGamma / 90)) * motionParams.gyroSensitivity
        const nyRaw = Math.max(-0.5, Math.min(0.5, dBeta / 180)) * motionParams.gyroSensitivity

        // (A) EMA 스무딩
        nxFiltRef.current = nxFiltRef.current + EMA_ALPHA * (nxRaw - nxFiltRef.current)
        nyFiltRef.current = nyFiltRef.current + EMA_ALPHA * (nyRaw - nyFiltRef.current)

        // (B) 데드존
        let nx = Math.abs(nxFiltRef.current) < DEADZONE ? 0 : nxFiltRef.current
        let ny = Math.abs(nyFiltRef.current) < DEADZONE ? 0 : nyFiltRef.current

        // (C) 양자화(계단화)로 미세 떨림 억제
        nx = Math.round(nx / QUANT) * QUANT
        ny = Math.round(ny / QUANT) * QUANT

        // 틸트(보간 적용)
        const maxTilt = motionParams.tiltSensitivity * scale
        const tx = ny * maxTilt * 2
        const ty = nx * maxTilt * 2
        tiltRef.current.x += TILT_EASE * (tx - tiltRef.current.x)
        tiltRef.current.y += TILT_EASE * (ty - tiltRef.current.y)
        setTiltOffset({ x: tiltRef.current.x, y: tiltRef.current.y })

        // 평면 이동 (축락/히스테리시스 적용 후에도 보간)
        const range = 150 * scale * motionParams.gyroSensitivity
        let mx = nx * range * 2
        let my = ny * range * 2

        const locked = applyAxisLock(
          mx,
          my,
          motionParams.axisLock ?? 'none',
          (motionParams.axisLockThreshold ?? 0) * range,
        )

        // 목표점으로 천천히 수렴
        targetRef.current.x += TARGET_EASE * (locked.x - targetRef.current.x)
        targetRef.current.y += TARGET_EASE * (locked.y - targetRef.current.y)
      })
    }

    window.addEventListener('deviceorientation', onOri, true)
    setIsListening(true)
    mouseActiveRef.current = true

    return () => {
      window.removeEventListener('deviceorientation', onOri, true)
      setIsListening(false)
      mouseActiveRef.current = false
    }
  }

  // 권한 버튼(제스처) → 권한 OK ⇒ 즉시 부착
  const handleGyroActivation = async () => {
    try {
      if (!window.isSecureContext) {
        console.warn('iOS에서 모션 센서는 HTTPS(또는 localhost) 환경이 필요합니다.')
      }
      const anyDO = DeviceOrientationEvent as any

      // ★ 버튼을 누른 시점 이후의 첫 이벤트를 기준으로 삼기 위해 초기화
      baselineRef.current = null

      if (typeof anyDO?.requestPermission === 'function') {
        const res = await anyDO.requestPermission()
        if (res === 'granted') {
          setGyroStatus('granted')
          cleanupRef.current?.()
          cleanupRef.current = enableGyroscope()
        } else {
          setGyroStatus('denied')
        }
      } else {
        setGyroStatus('granted')
        cleanupRef.current?.()
        cleanupRef.current = enableGyroscope()
      }
    } catch {
      setGyroStatus('denied')
    }
  }

  // 권한 이미 OK면 자동 부착
  useEffect(() => {
    if (gyroStatus === 'granted' && isMobile && !cleanupRef.current) {
      cleanupRef.current = enableGyroscope()
      return cleanupRef.current
    }
  }, [gyroStatus, isMobile]) // eslint-disable-line

  // 화면 전환 복귀 시 재부착
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        if (gyroStatus === 'granted' && isMobile && !cleanupRef.current) {
          cleanupRef.current = enableGyroscope()
        }
      } else {
        cleanupRef.current?.()
        cleanupRef.current = null
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [gyroStatus, isMobile])

  // 언마운트 정리
  useEffect(() => () => cleanupRef.current?.(), [])

  // 마우스(데스크탑)
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy

    const maxTilt = motionParams.tiltSensitivity * scale
    setTiltOffset({
      x: (dy / (rect.height / 2)) * maxTilt,
      y: (-dx / (rect.width / 2)) * maxTilt,
    })

    const range = 80 * scale
    let mx = (dx / (rect.width / 2)) * range * 0.8
    let my = (dy / (rect.height / 2)) * range
    const locked = applyAxisLock(mx, my, motionParams.axisLock ?? 'none', (motionParams.axisLockThreshold ?? 0) * range)
    targetRef.current = { x: locked.x, y: locked.y }
  }
  const onEnter = () => {
    if (isMobile) return
    setIsHovered(true)
    mouseActiveRef.current = true
  }
  const onLeave = () => {
    if (isMobile) return
    setIsHovered(false)
    mouseActiveRef.current = false
    setTiltOffset({ x: 0, y: 0 })
    targetRef.current = { x: 0, y: 0 }
  }

  return (
    <>
      {showMobileGyroUI && isMobile && (
        <div className='relative z-50 flex items-center gap-3'>
          {gyroStatus !== 'granted' ? (
            <button
              onClick={handleGyroActivation}
              className='px-6 py-2 rounded-[100px] text-[#4B4F57] underline'
              title='이 버튼을 누른 직후의 기기 자세가 기준이 됩니다.'
            >
              Movement 움직이기
            </button>
          ) : (
            <>
              {/* ★ 센서 동작 중일 때 기준 재설정 버튼 */}
              <button
                onClick={calibrateNow}
                className='px-4 py-2 rounded-[100px] text-[#4B4F57] underline'
                title='현재 자세를 기준으로 재설정'
              >
                Reset Movement
              </button>
              {/* (원한다면 끄기 버튼도 제공) */}
              {isListening && (
                <button
                  onClick={() => {
                    cleanupRef.current?.()
                    cleanupRef.current = null
                  }}
                  className='px-3 py-2 rounded-[100px] text-[#8B8F97]'
                  title='자이로 입력 끄기'
                >
                  Turn off Movement
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className='relative transition-all duration-500 ease-out'
        style={{
          width: `${maxWidth}px`,
          height: `${maxHeight}px`,
          transform: `
            translate3d(0px, 0px, 0)
            rotateX(${tiltOffset.x}deg) 
            rotateY(${tiltOffset.y}deg)
            scale(${isHovered ? motionParams.hoverScale : 1})
          `,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          perspective: '700px',
        }}
        onMouseMove={!isMobile ? onMouseMove : undefined}
        onMouseEnter={!isMobile ? onEnter : undefined}
        onMouseLeave={!isMobile ? onLeave : undefined}
      >
        {Array.from({ length: steps }).map((_, i) => {
          const factor = steps > 1 ? Math.pow(i / (steps - 1), motionParams.colorInterpolationPower) : 0
          const w = maxWidth - stepReduction * i
          const h = maxHeight - stepReduction * i
          const color = interpolateColor(brandColorHex, refinedColorHex, factor)

          const basePosition = positions[i] || { x: 0, y: 0 }
          const interactionX = targetRef.current.x * (i / Math.max(1, steps - 1)) * 0.5
          const interactionY = targetRef.current.y * (i / Math.max(1, steps - 1)) * 0.5

          const finalPosition = {
            x: basePosition.x + interactionX,
            y: basePosition.y + interactionY,
          }

          return (
            <div
              key={i}
              className='absolute transition-all duration-100 ease-out'
              style={{
                width: `${w}px`,
                height: `${h}px`,
                backgroundColor: color,
                borderRadius: i === 0 ? `${motionParams.borderRadiusOuter * scale}px` : '0px',
                top: '50%',
                left: '50%',
                transform: isHovered
                  ? `
          translate(calc(-50% + ${finalPosition.x}px), calc(-50% + ${finalPosition.y}px))
          translateZ(${i * 15 * scale}px)
        `
                  : `
          translate(calc(-50% + ${finalPosition.x}px), calc(-50% + ${finalPosition.y}px))
          translateZ(${0}px)
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
