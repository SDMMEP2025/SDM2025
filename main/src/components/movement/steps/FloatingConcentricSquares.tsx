'use client'

import React, { useEffect, useRef, useState } from 'react'

export type AxisLockMode = 'none' | 'x' | 'y' | 'dominant'

export interface InteractMotionParams {
  speedBase: number
  followSpeedMultiplier: number
  followSpeedOffset: number
  colorInterpolationPower: number
  floatAmplitude: number
  floatSpeed: number
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
  /** 컨테이너 바깥쪽 안내/버튼 UI를 직접 만들고 싶다면 false로 두세요 */
  showMobileGyroUI?: boolean
}

/**
 * 자이로 권한 → 즉시 리스너 부착, visibilitychange 재부착, 축 고정 지원
 * 내부에 권한 버튼(UI)까지 포함 (showMobileGyroUI=true일 때)
 */
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

  const [floatOffset, setFloatOffset] = useState({ x: 0, y: 0 })
  const [tiltOffset, setTiltOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // 꼬리물기 포지션
  const [currentPositions, setCurrentPositions] = useState(positions)
  const targetRef = useRef({ x: 0, y: 0 })
  const mouseActiveRef = useRef(false)

  // 모바일/자이로
  const [isMobile, setIsMobile] = useState(false)
  const [gyroStatus, setGyroStatus] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [isListening, setIsListening] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const tickingRef = useRef(false)

  // 부모 크기 기반 스케일
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current?.parentElement) return
      const p = containerRef.current.parentElement.getBoundingClientRect()
      const wScale = (p.width * 0.8) / BASE_W
      const hScale = (p.height * 0.6) / BASE_H
      const s = Math.min(wScale, hScale, 2)
      setScale(Math.max(0.3, s))
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

  // 떠다니는 애니메이션
  useEffect(() => {
    let raf = 0
    let t = 0
    const tick = () => {
      t += motionParams.floatSpeed
      setFloatOffset({
        x: Math.sin(t) * motionParams.floatAmplitude * scale,
        y: Math.cos(t * 0.8) * motionParams.floatAmplitude * 0.67 * scale,
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scale, motionParams.floatAmplitude, motionParams.floatSpeed])

  // 꼬리물기 보간
  useEffect(() => {
    let raf = 0
    const tick = () => {
      setCurrentPositions(prev => {
        const arr = [...prev]
        const target = targetRef.current
        const last = steps - 1
        if (last >= 0 && mouseActiveRef.current) {
          const L = arr[last]
          arr[last] = {
            x: L.x + (target.x - L.x) * motionParams.speedBase,
            y: L.y + (target.y - L.y) * motionParams.speedBase,
          }
        }
        for (let i = last - 1; i >= 0; i--) {
          const cur = arr[i]
          const nxt = arr[i + 1]
          const speed =
            motionParams.speedBase *
            (motionParams.followSpeedMultiplier + (i / steps) * motionParams.followSpeedOffset)
          arr[i] = {
            x: cur.x + (nxt.x - cur.x) * speed,
            y: cur.y + (nxt.y - cur.y) * speed,
          }
        }
        return arr
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [steps, motionParams.speedBase, motionParams.followSpeedMultiplier, motionParams.followSpeedOffset])

  // 자이로 리스너
  const enableGyroscope = () => {
    const onOri = (ev: DeviceOrientationEvent) => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        tickingRef.current = false

        const beta = ev.beta ?? 0    // 앞뒤
        const gamma = ev.gamma ?? 0  // 좌우

        const nx = Math.max(-0.5, Math.min(0.5, gamma / 90)) * motionParams.gyroSensitivity
        const ny = Math.max(-0.5, Math.min(0.5, beta / 180)) * motionParams.gyroSensitivity

        const maxTilt = motionParams.tiltSensitivity * scale
        setTiltOffset({ x: ny * maxTilt * 2, y: nx * maxTilt * 2 })

        const range = 150 * scale * motionParams.gyroSensitivity
        let mx = nx * range * 2
        let my = ny * range * 2
        const locked = applyAxisLock(
          mx,
          my,
          motionParams.axisLock ?? 'none',
          (motionParams.axisLockThreshold ?? 0) * range,
        )
        targetRef.current = { x: locked.x, y: locked.y }
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
      {showMobileGyroUI && isMobile && gyroStatus !== 'granted' && (
        <div className="relative z-50">
          <button
            onClick={handleGyroActivation}
            className="px-6 py-2 rounded-[100px] text-[#4B4F57] underline"
          >
            Movement 움직이기
          </button>
        </div>
      )}
      {showMobileGyroUI && isMobile && isListening && (
        <div className="z-50">
          <div className="text-black font-semibold whitespace-nowrap text-sm animate-pulse">
            ● 디바이스 움직임 감지 중
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative transition-all duration-500 ease-out"
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
        onMouseMove={!isMobile ? onMouseMove : undefined}
        onMouseEnter={!isMobile ? onEnter : undefined}
        onMouseLeave={!isMobile ? onLeave : undefined}
      >
        {Array.from({ length: steps }).map((_, i) => {
          const factor = steps > 1 ? Math.pow(i / (steps - 1), motionParams.colorInterpolationPower) : 0
          const w = maxWidth - stepReduction * i
          const h = maxHeight - stepReduction * i
          const color = interpolateColor(brandColorHex, refinedColorHex, factor)
          const p = currentPositions[i] || { x: 0, y: 0 }

          return (
            <div
              key={i}
              className="absolute transition-all duration-100 ease-out"
              style={{
                width: `${w}px`,
                height: `${h}px`,
                backgroundColor: color,
                borderRadius: i === 0 ? `${motionParams.borderRadiusOuter * scale}px` : '0px',
                top: '50%',
                left: '50%',
                transform: `
                  translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))
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
