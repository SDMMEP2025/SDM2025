'use client'

import { CursorArea } from '@/components/cursor/CursorArea'
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'

export type MotionParams = {
  speedBase: number
  followSpeedMultiplier: number
  followSpeedOffset: number
  colorInterpolationPower: number
  stepReductionRatio: number
  borderRadiusOuter: number
  dragSmoothing: number
  rotatePerStepDeg?: number
  rotateOffsetDeg?: number
}

export type ConcentricSquaresProps = {
  steps?: number
  colors?: string[]
  brandColorHex?: string
  refinedColorHex?: string
  onPositionsChange?: (positions: Array<{ x: number; y: number }>) => void
  motionParams?: MotionParams
  size?: {
    capW?: number
    capH?: number
    parentW?: number
    parentH?: number
  }
  hitArea?: 'smallest' | 'host'
  className?: string
  style?: React.CSSProperties
}

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}
function interpolate(c1: string, c2: string, f: number) {
  const a = hexToRgb(c1)
  const b = hexToRgb(c2)
  if (!a || !b) return c1
  const r = Math.round(a.r + f * (b.r - a.r))
  const g = Math.round(a.g + f * (b.g - a.g))
  const bl = Math.round(a.b + f * (b.b - a.b))
  return rgbToHex(r, g, bl)
}

export default function ConcentricSquares({
  steps = 15,
  colors,
  brandColorHex = '#FF7EC1',
  refinedColorHex = '#FF5C1C',
  onPositionsChange,
  motionParams = {
    speedBase: 0.08,
    followSpeedMultiplier: 0.5,
    followSpeedOffset: 1.0,
    colorInterpolationPower: 0.9,
    stepReductionRatio: 0.045,
    borderRadiusOuter: 12,
    dragSmoothing: 1.0,
    rotatePerStepDeg: 10,
    rotateOffsetDeg: 0,
  },
  size = {
    capW: 720,
    capH: 560,
    parentW: 0.98,
    parentH: 0.85,
  },
  hitArea = 'smallest',
  className,
  style,
}: ConcentricSquaresProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [max, setMax] = useState({ w: 480, h: 360 })

  useEffect(() => {
    const el = wrapRef.current?.parentElement
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()

      const capW = size.capW ?? 720
      const capH = size.capH ?? 560
      const aspect = capW / capH

      const availW = r.width * (size.parentW ?? 0.98)
      const availH = r.height * (size.parentH ?? 0.85)

      const wByHeight = availH * aspect
      const hByWidth = availW / aspect

      const w = Math.min(availW, wByHeight)
      const h = Math.min(availH, hByWidth)

      const W = Math.max(220, Math.floor(w))
      const H = Math.max(160, Math.floor(h))

      setMax({ w: W, h: H })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [size.capW, size.capH, size.parentW, size.parentH])

  const stepReduction = Math.max(15, max.w * (motionParams.stepReductionRatio ?? 0.045))

  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>(() =>
    Array.from({ length: steps }, () => ({ x: 0, y: 0 })),
  )
  useEffect(() => {
    setPositions((prev) => Array.from({ length: steps }, (_, i) => prev[i] ?? { x: 0, y: 0 }))
  }, [steps])

  useEffect(() => {
    onPositionsChange?.(positions)
  }, [positions, onPositionsChange])

  const targetRef = useRef({ x: 0, y: 0 })
  const draggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const clampToSize = useCallback(
    (ix: number, iy: number, i: number) => {
      const width = Math.max(20, max.w - stepReduction * i)
      const height = Math.max(20, max.h - stepReduction * i)
      const limX = (max.w - width) / 2
      const limY = (max.h - height) / 2
      return {
        x: Math.max(-limX, Math.min(limX, ix)),
        y: Math.max(-limY, Math.min(limY, iy)),
      }
    },
    [max.w, max.h, stepReduction],
  )

  const getLocal = useCallback(
    (clientX: number, clientY: number) => {
      const host = wrapRef.current
      if (!host) return { x: 0, y: 0 }
      const rect = host.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const rawX = (clientX - cx) / motionParams.dragSmoothing
      const rawY = (clientY - cy) / motionParams.dragSmoothing
      const lastIdx = steps - 1
      return clampToSize(rawX, rawY, lastIdx)
    },
    [steps, motionParams.dragSmoothing, clampToSize],
  )

  const activePointerRef = useRef<number | null>(null)

  const handlersRef = useRef({
    onMove: (e: PointerEvent) => {
      if (!draggingRef.current || activePointerRef.current !== e.pointerId) return
      e.preventDefault()
      targetRef.current = getLocal(e.clientX, e.clientY)
    },
    onUp: (e: PointerEvent) => {
      if (activePointerRef.current === e.pointerId) {
        draggingRef.current = false
        activePointerRef.current = null
        setIsDragging(false)
      }
    },
  })

  useEffect(() => {
    handlersRef.current.onMove = (e: PointerEvent) => {
      if (!draggingRef.current || activePointerRef.current !== e.pointerId) return
      e.preventDefault()
      targetRef.current = getLocal(e.clientX, e.clientY)
    }
    handlersRef.current.onUp = (e: PointerEvent) => {
      if (activePointerRef.current === e.pointerId) {
        draggingRef.current = false
        activePointerRef.current = null
        setIsDragging(false)
      }
    }
  }, [getLocal])

  useEffect(() => {
    const onMove = (e: PointerEvent) => handlersRef.current.onMove(e)
    const onUp = (e: PointerEvent) => handlersRef.current.onUp(e)

    document.addEventListener('pointermove', onMove, { passive: false })
    document.addEventListener('pointerup', onUp, { passive: false })
    document.addEventListener('pointercancel', onUp, { passive: false })

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onUp)
    }
  }, [])

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const host = wrapRef.current
      if (!host || draggingRef.current) return

      e.preventDefault()
      e.stopPropagation()

      draggingRef.current = true
      activePointerRef.current = e.pointerId
      targetRef.current = getLocal(e.clientX, e.clientY)
      setIsDragging(true)
    },
    [getLocal],
  )

  const onSmallestPointerDown: React.PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (draggingRef.current) return

      e.preventDefault()
      e.stopPropagation()

      draggingRef.current = true
      activePointerRef.current = e.pointerId
      targetRef.current = getLocal(e.clientX, e.clientY)
      setIsDragging(true)
    },
    [getLocal],
  )

  useEffect(() => {
    let raf = 0
    let lastTime = 0

    const tick = (currentTime: number) => {
      if (currentTime - lastTime < 16.67) {
        raf = requestAnimationFrame(tick)
        return
      }
      lastTime = currentTime

      setPositions((prev) => {
        const next = [...prev]
        const last = steps - 1
        let hasChanged = false

        if (last >= 0) {
          const L = next[last]
          const target = targetRef.current
          const newX = L.x + (target.x - L.x) * motionParams.speedBase
          const newY = L.y + (target.y - L.y) * motionParams.speedBase
          const clamped = clampToSize(newX, newY, last)

          if (Math.abs(clamped.x - L.x) > 0.001 || Math.abs(clamped.y - L.y) > 0.001) {
            next[last] = clamped
            hasChanged = true
          }
        }

        for (let i = last - 1; i >= 0; i--) {
          const cur = next[i]
          const lead = next[i + 1]
          const sp =
            motionParams.speedBase * (motionParams.followSpeedMultiplier + (i / steps) * motionParams.followSpeedOffset)
          const newX = cur.x + (lead.x - cur.x) * sp
          const newY = cur.y + (lead.y - cur.y) * sp
          const clamped = clampToSize(newX, newY, i)

          if (Math.abs(clamped.x - cur.x) > 0.001 || Math.abs(clamped.y - cur.y) > 0.001) {
            next[i] = clamped
            hasChanged = true
          }
        }

        return hasChanged ? next : prev
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [steps, motionParams, clampToSize])

  const colorAt = useCallback(
    (i: number) => {
      if (colors && colors[i]) return colors[i]
      const t = steps > 1 ? Math.pow(i / (steps - 1), motionParams.colorInterpolationPower) : 0
      return interpolate(brandColorHex, refinedColorHex, t)
    },
    [colors, steps, motionParams.colorInterpolationPower, brandColorHex, refinedColorHex],
  )

  const getCursorStyle = useCallback(() => {
    if (isDragging) return 'grabbing'
    if (hitArea === 'host') return 'grab'
    return 'default'
  }, [isDragging, hitArea])

  const boxes = useMemo(() => {
    const rp = motionParams.rotatePerStepDeg ?? 10
    const ro = motionParams.rotateOffsetDeg ?? 0
    return Array.from({ length: steps }, (_, i) => {
      const width = Math.max(20, max.w - stepReduction * i)
      const height = Math.max(20, max.h - stepReduction * i)
      const angle = ro + i * rp
      return { i, width, height, color: colorAt(i), p: positions[i] ?? { x: 0, y: 0 }, angle }
    })
  }, [
    steps,
    positions,
    max.w,
    max.h,
    stepReduction,
    colorAt,
    motionParams.rotatePerStepDeg,
    motionParams.rotateOffsetDeg,
  ])

  return (
    <div
      ref={wrapRef}
      onPointerDown={hitArea === 'host' ? onPointerDown : undefined}
      className={className}
      style={{
        position: 'relative',
        width: `${max.w}px`,
        height: `${max.h}px`,
        touchAction: 'none',
        pointerEvents: 'auto',
        userSelect: 'none',
        cursor: getCursorStyle(),
        ...style,
      }}
    >
      {boxes.map(({ i, width, height, color, p, angle }) => {
        const isSmallest = i === steps - 1
        const isInteractive = hitArea === 'smallest' && isSmallest

        return (
          <div
            key={i}
            className='absolute top-[50%] left-[50%] flex justify-fenter items-center'
            style={{
              transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
              cursor: isInteractive ? (isDragging ? 'grabbing' : 'grab') : 'default',
              pointerEvents: isInteractive ? 'auto' : 'none',
            }}
            onPointerDown={isInteractive ? onSmallestPointerDown : undefined}
          >
            <div
              style={{
                width,
                height,
                backgroundColor: color,
                borderRadius: i === 0 ? motionParams.borderRadiusOuter : 0,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center',
                willChange: 'transform',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
