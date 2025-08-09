'use client'
import React, { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

export default function LottieBackground({
  animationData,
  loop = true,
  autoplay = true,
  className = '',
  style = {},
  forceRotate90 = false, // ✅ 기본은 회전 안 함
}) {
  const containerRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !animationData) return

    if (animationRef.current) animationRef.current.destroy()

    const inst = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay,
      animationData,
    })
    animationRef.current = inst

    const applySvgFit = () => {
      const svg = containerRef.current?.querySelector('svg')
      if (!svg) return
      svg.style.width = '100%'
      svg.style.height = '100%'
      svg.style.display = 'block'
      svg.style.objectFit = 'cover'
      svg.style.margin = '0'
      svg.style.padding = '0'
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
    }

    inst.addEventListener('DOMLoaded', applySvgFit)
    const t = setTimeout(applySvgFit, 100)

    return () => {
      clearTimeout(t)
      inst.removeEventListener('DOMLoaded', applySvgFit)
      inst.destroy()
    }
  }, [animationData, loop, autoplay])

  // 회전이 필요할 때만 90도
  const innerClass = forceRotate90
    ? // 모바일/기본: 90도 회전 + 가로/세로 치환, lg 이상: 원상복구
      'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 w-[100vh] h-[100vw] lg:rotate-0 lg:w-screen lg:h-screen'
    : // 회전 없이 꽉 채우기
      'absolute inset-0 w-full h-full'

  return (
    <div className={`absolute inset-0 ${className}`} style={{ zIndex: 0, ...style }}>
      <div ref={containerRef} className={innerClass} style={{ overflow: 'hidden' }} />
    </div>
  )
}
