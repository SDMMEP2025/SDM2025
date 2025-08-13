// components/common/SmartSVG.tsx
'use client'
import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'

type SmartSVGProps = {
  render: React.ComponentType<{ className?: string }>
  className?: string
  stripClipping?: boolean
  nonScalingStroke?: boolean
}

export default function SmartSVG({
  render: SvgComp,
  className,
  stripClipping = false,
  nonScalingStroke = false,
}: SmartSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const svgs = root.querySelectorAll('svg')
    const svg = svgs[svgs.length - 1] as SVGSVGElement | undefined
    if (!svg) return

    svg.style.display = 'block'
    svg.style.overflow = 'visible'

    const hasViewBox = svg.hasAttribute('viewBox')
    if (!hasViewBox) {
      try {
        const inner = svg as unknown as SVGGraphicsElement
        const bbox = inner.getBBox()
        if (bbox && isFinite(bbox.width) && isFinite(bbox.height) && bbox.width > 0 && bbox.height > 0) {
          svg.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`)
          svg.removeAttribute('width')
          svg.removeAttribute('height')
        }
      } catch {
      }
    }

    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    if (stripClipping) {
      svg.querySelectorAll('[clip-path]').forEach((el) => el.removeAttribute('clip-path'))
      svg.querySelectorAll('clipPath').forEach((el) => el.parentElement?.removeChild(el))
      svg.querySelectorAll('[mask]').forEach((el) => el.removeAttribute('mask'))
      svg.querySelectorAll('mask').forEach((el) => el.parentElement?.removeChild(el))
    }

    if (nonScalingStroke) {
      svg.querySelectorAll<SVGElement>('*').forEach((el) => {
        el.setAttribute('vector-effect', 'non-scaling-stroke')
      })
    }
  }, [stripClipping, nonScalingStroke])

  return (
    <div
      ref={containerRef}
      className={classNames(
        'inline-block',
        className,
      )}
    >
      <SvgComp className='block h-auto overflow-visible' />
    </div>
  )
}
