// components/ScrollOrchestrator.tsx
'use client'

import { useMemo, useRef, useLayoutEffect, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { chromeProgress } from '@/lib/chromeProgress'

type Cut = { start: number; end: number } // 0~1 구간
const seg = (i: number, N: number): Cut => ({ start: i / N, end: (i + 1) / N })
function useSectionProgress(global: MotionValue<number>, cut: Cut) {
  return useTransform(global, [cut.start, cut.end], [0, 1], { clamp: true })
}

export function ScrollOrchestrator() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<HTMLDivElement>(null)
  const N = 3

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end start'],
  })

  const cuts = useMemo(() => Array.from({ length: N }, (_, i) => seg(i, N)), [N])
  const p0 = useSectionProgress(scrollYProgress, cuts[0])

  const [p0Base, setP0Base] = useState(0)
  useLayoutEffect(() => {
    const calc = () => {
      const el = rectRef.current
      if (!el) return

      // 보이는 뷰포트 기준(모바일 주소창 변동 포함)
      const vw = window.visualViewport?.width ?? window.innerWidth
      const vh = window.visualViewport?.height ?? window.innerHeight

      // 현재(스케일 1 기준) 박스의 위치/크기
      // 주의: rectScale이 1인 초기 프레임에서 측정되도록 useLayoutEffect + initial={false}
      const r = el.getBoundingClientRect()
      const w = Math.max(r.width, 1)
      const h = Math.max(r.height, 1)

      // 중심 좌표
      const cx = r.left + w / 2
      const cy = r.top + h / 2

      // 화면 끝까지의 거리(좌/우/상/하)
      const distLeft = cx
      const distRight = vw - cx
      const distTop = cy
      const distBottom = vh - cy

      // 각 방향으로 화면을 덮기 위해 필요한 최소 스케일
      const sx = Math.max(distLeft, distRight) / (w / 2)
      const sy = Math.max(distTop, distBottom) / (h / 2)

      // 여유 3% 포함
      const s = Math.max(sx, sy) * 1.00
      setCoverScale(s)
    }

    // 처음 1프레임 + 리사이즈/회전/주소창 변화 대응
    let raf = requestAnimationFrame(calc)
    window.addEventListener('resize', calc)
    window.addEventListener('orientationchange', calc)
    window.visualViewport?.addEventListener('resize', calc)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', calc)
      window.removeEventListener('orientationchange', calc)
      window.visualViewport?.removeEventListener('resize', calc)
    }
  }, [])


  const p0Local = p0
  useMotionValueEvent(p0Local, 'change', (v) => {
    chromeProgress.set(v)
  })

  // ───────────────── Section 1 바인딩 ─────────────────
  // 텍스트 스케일 / 화살표 페이드 (정규화 진행도 사용)
  const titleScale = useTransform(p0Local, [0, 1], [1, 2])
  const subtitleScale = useTransform(p0Local, [0, 1], [1, 2])

  // 핑크 박스: 초기 크기는 고정, 스크롤 시 transform: scale 로만 확장
  const [coverScale, setCoverScale] = useState(1)
  useLayoutEffect(() => {
    const calc = () => {
      const el = rectRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      // 화면을 완전히 덮기 위한 최소 스케일 (여유 3%)
      const s = Math.max(vw / Math.max(r.width, 1), vh / Math.max(r.height, 1)) * 1.06
      setCoverScale(s)
    }
    calc()
    window.addEventListener('resize', calc)
    window.addEventListener('orientationchange', calc)
    window.visualViewport?.addEventListener('resize', calc)
    return () => {
      window.removeEventListener('resize', calc)
      window.removeEventListener('orientationchange', calc)
      window.visualViewport?.removeEventListener('resize', calc)
    }
  }, [])

  const rectScale = useTransform(p0Local, [0, 1], [1, coverScale])

  return (
    <div ref={wrapRef} className='absolute w-full z-0 top-0'>

      <section className='relative h-[240dvh] bg-black'>
        <div className='sticky h-[100dvh] top-0' style={{ contain: 'layout style paint' }}>
          <div className='relative w-full h-full bg-white'>
            {/* 핑크 사각형 */}
            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
              <motion.div
                ref={rectRef}
                initial={false}
                className='bg-[#FF60B9]'
                style={{
                  width: '17vw',
                  height: '8.33vw',
                  borderRadius: '5px',
                  scale: rectScale,
                  transformOrigin: 'center',
                  willChange: 'transform',
                }}
              />
            </div>

            <div className='absolute left-1/2 top-[37dvh] -translate-x-1/2 -translate-y-1/2 font-english mix-blend-difference text-center text-white font-semibold'>
              <motion.span initial={false} style={{ scale: titleScale }} className='block leading-none text-[2.77vw]'>
                New Formative
              </motion.span>
            </div>

            <div className='absolute left-1/2 top-[64.56dvh] w-[400px] -translate-x-1/2 -translate-y-1/2 font-english mix-blend-difference text-center text-white font-semibold leading-[240%]'>
              <motion.span initial={false} style={{ scale: subtitleScale }} className='block text-[2.77vw]'>
                Steady Movement For Progress
              </motion.span>
            </div>

            <motion.div
              initial={false}
              className='absolute left-1/2 bottom-[7.6dvh] -translate-x-1/2 -translate-y-1/2 text-white mix-blend-difference'
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='29' height='16' viewBox='0 0 29 16' fill='none'>
                <path
                  d='M14.4974 16c-.407 0-.811-.155-1.12-.463L.4638 2.691A1.5 1.5 0 0 1 2.7076.461L14.5 12.193 26.2924.461a1.5 1.5 0 1 1 2.2438 2.23L15.6232 15.537A1.5 1.5 0 0 1 14.4974 16Z'
                  fill='currentColor'
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
