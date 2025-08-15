'use client'

import { useMemo, useRef, useLayoutEffect, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { chromeProgress } from '@/lib/chromeProgress'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import bgAnim from '@/animation/main.json'
import { easeInOut, useSpring } from 'framer-motion'
import AboutSection from '../about/AboutSection'
import { aboutPhase } from '@/lib/phase'

type Cut = { start: number; end: number }
function useSectionProgress(global: MotionValue<number>, cut: Cut) {
  return useTransform(global, [cut.start, cut.end], [0, 1], { clamp: true })
}

export function ScrollOrchestrator() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  // 섹션 경계
  const CUTS = [0, 0.08, 0.3, 0.54, 0.78, 0.92, 1] as const
  const cut = (i: 0 | 1 | 2 | 3 | 4 | 5): Cut => ({ start: CUTS[i], end: CUTS[i + 1] })

  // 해시 ↔ 진행도 매핑
  const HASH_TO_INDEX: Record<string, number> = {
    section1: 1, // CUTS[1] (0→1 끝)
    section2: 2,
    section3: 3,
    section4: 4,
    section5: 5,
  }
  const lastHashRef = useRef<string | null>(null)
  const isSnappingRef = useRef(false)

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    chromeProgress.set(0)
    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto'
      }
      chromeProgress.set(0)
    }
  }, [])

  useEffect(() => {
    const onPageShow = (e: any) => {
      if (e?.persisted) {
        chromeProgress.set(0)
        window.scrollTo(0, 0)
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end start'],
  })

  // progress <-> scroll 픽셀 변환
  const progressToScroll = (el: HTMLElement, p: number) => {
    const rect = el.getBoundingClientRect()
    const offsetTop = rect.top + window.scrollY
    const wrapHeight = el.offsetHeight
    const vh = window.innerHeight
    const scrollable = Math.max(wrapHeight - vh, 1)
    return offsetTop + p * scrollable
  }

  const goToProgress = (p: number) => {
    const el = wrapRef.current
    if (!el) return
    isSnappingRef.current = true
    const target = progressToScroll(el, p)
    window.scrollTo({ top: target, behavior: 'smooth' })

    // 스냅 해제: 근접 or 몇 프레임 후
    let ticks = 0
    const onScrollEndCheck = () => {
      const near = Math.abs(window.scrollY - target) < 2
      if (near || ticks > 20) {
        isSnappingRef.current = false
        window.removeEventListener('scroll', onScrollEndCheck)
      } else {
        ticks++
        requestAnimationFrame(onScrollEndCheck)
      }
    }
    window.addEventListener('scroll', onScrollEndCheck)
    requestAnimationFrame(onScrollEndCheck)
  }

  // --- 0→1 구간 스냅: 한 번의 스크롤/스와이프로 CUTS[1]까지 이동 ---
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    let touchStartY = 0

    const inStep0 = () => {
      const p = scrollYProgress.get()
      return p >= CUTS[0] && p < CUTS[1]
    }

    const onWheel = (e: WheelEvent) => {
      if (isSnappingRef.current || !inStep0()) return
      if (e.deltaY > 0) {
        e.preventDefault()
        goToProgress(CUTS[1])
      } else if (e.deltaY < 0) {
        e.preventDefault()
        goToProgress(CUTS[0])
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      if (isSnappingRef.current || !inStep0()) return
      const dy = e.touches[0].clientY - touchStartY
      if (dy < -8) {
        e.preventDefault()
        goToProgress(CUTS[1])
      } else if (dy > 8) {
        e.preventDefault()
        goToProgress(CUTS[0])
      }
    }

    // passive:false로 해야 preventDefault가 적용됨
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel as any)
      window.removeEventListener('touchstart', onTouchStart as any)
      window.removeEventListener('touchmove', onTouchMove as any)
    }
  }, [scrollYProgress])

  // 페이지 최초 진입 시 해시로 복원
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
    const idx = HASH_TO_INDEX[hash]
    if (idx !== undefined) {
      goToProgress(CUTS[idx])
      lastHashRef.current = hash ? `#${hash}` : null
    }
  }, [])

  // ── 섹션별 진행도
  const p0 = useSectionProgress(scrollYProgress, cut(0))
  const p1 = useSectionProgress(scrollYProgress, cut(1))
  const p2 = useSectionProgress(scrollYProgress, cut(2))
  const p3 = useSectionProgress(scrollYProgress, cut(3))
  const p4 = useSectionProgress(scrollYProgress, cut(4))
  const p5 = useSectionProgress(scrollYProgress, cut(5))

  // 해시 업데이트 (스냅 중엔 일시 정지, 중복 방지)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (isSnappingRef.current) return

    let current: string | null = null
    // 원하는 구간 범위로 해시 지정
    if (v >= CUTS[2] && v < CUTS[3]) current = '#section2'
    else if (v >= CUTS[3] && v < CUTS[4]) current = '#section3'
    else if (v >= CUTS[1] && v < CUTS[2]) current = '#section1'
    else current = null

    if (current !== lastHashRef.current) {
      lastHashRef.current = current
      const url = current ? `${window.location.pathname}${current}` : window.location.pathname
      window.history.replaceState(null, '', url)
    }
  })

  // 어바웃 인터랙션 상태
  useMotionValueEvent(p5, 'change', (v) => {
    aboutPhase.set(v)
  })

  const p0Local = p0
  useMotionValueEvent(p0Local, 'change', (v) => {
    chromeProgress.set(v)
  })

  // ───────────────── Section 1 ─────────────────
  const titleScaleIn = useTransform(p0Local, [0, 1], [1, 2.2])
  const subtitleScaleIn = useTransform(p0Local, [0, 1], [1, 2.2])
  const opacityScale = useTransform(chromeProgress, [0, 0.2, 0.6], [0, 0, 1])
  const [coverScale, setCoverScale] = useState(1)

  useLayoutEffect(() => {
    const calc = () => {
      const el = rectRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight + +100
      const s = Math.max(vw / Math.max(r.width, 1), vh / Math.max(r.height, 1)) * 1.03
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

  const [lottiePlayed, setLottiePlayed] = useState(false)
  useMotionValueEvent(p0Local, 'change', (v) => {
    if (v >= 0.9 && !lottiePlayed) {
      lottieRef.current?.play()
      setLottiePlayed(true)
    }
  })
  useMotionValueEvent(p1, 'change', (v) => {
    if (v >= 0.95 && lottiePlayed) {
      lottieRef.current?.stop()
      lottieRef.current?.goToAndStop(0, true)
      setLottiePlayed(false)
    }
  })

  // ───────────────── Section 2 ─────────────────
  const lottieFadeOut = useTransform(p1, [0.15, 0.85], [1, 0], { ease: easeInOut })
  const lottieOpacity = useTransform([opacityScale, lottieFadeOut], ([a, b]) => Number(a) * Number(b))

  // ───────────────── Section 3 ─────────────────
  const planesOpacity = useTransform(p2, [0.05, 0.55], [0, 1], { clamp: true })
  const planeTiltDegRaw = useTransform(p2, [0, 1], [0, 83])
  const planeTiltDeg = useSpring(planeTiltDegRaw, { stiffness: 120, damping: 20, mass: 0.6 })
  const lift3 = useTransform(p2, [0.1, 0.8], [0, -230])
  const yAll3 = lift3
  const rectOpacity = useTransform(p2, [0.2, 0.85], [1, 0], { clamp: true, ease: easeInOut })
  const infoFadeOut = useTransform(p2, [0, 0.2], [1, 0], { ease: easeInOut })
  const infoOpacity = useTransform([opacityScale, infoFadeOut], ([a, b]) => Number(a) * Number(b))

  // ───────────────── Section 4 ─────────────────
  const sep4 = useTransform(p3, [0.0, 0.25, 1.0], [0, 0, 200], { ease: easeInOut })
  const midY = yAll3
  const frontY = useTransform([p3, yAll3, sep4], ([t, b, sep]: [number, number, number]) => b + (t > 0 ? -sep * 0.2 : 0))
  const backY  = useTransform([p3, yAll3, sep4], ([t, b, sep]: [number, number, number]) => b + (t > 0 ? +sep * 0.6 : 0))

  // ───────────────── Section 5 ─────────────────
  const planesLiftUp = useTransform(p4, [0, 1], [0, -4100])
  const backYFinal  = useTransform([backY,  planesLiftUp], ([b, u]: [number, number]) => b + u)
  const midYFinal   = useTransform([midY,  planesLiftUp], ([m, u]: [number, number]) => m + u)
  const frontYFinal = useTransform([frontY, planesLiftUp], ([f, u]: [number, number]) => f + u)

  const photos = useMemo(
    () => [
      { src: '/images/intro/1.png', base: 800,  left: '20vw', width: '20vw',     z: 0,  fade: [0.05, 0.25] },
      { src: '/images/intro/2.png', base: 940,  left: '60vw', width: '20vw',     z: 10, fade: [0.1,  0.3]  },
      { src: '/images/intro/3.png', base: 1280, left: '23vw', width: '26.66vw',  z: 16, fade: [0.15, 0.35] },
      { src: '/images/intro/4.png', base: 1780, left: '7vw',  width: '22vw',     z: -8, fade: [0.2,  0.4]  },
      { src: '/images/intro/5.png', base: 1900, left: '65vw', width: '24vw',     z: -16,fade: [0.25, 0.45] },
    ],
    [],
  )

  // ───────────────── Section 6 ─────────────────
  const arrowOpacity     = useTransform(p5, [0, 0.2], [1, 0], { ease: easeInOut, clamp: true })
  const titleLift_p4     = useTransform(p4, [0, 1], [0, 0])
  const subtitleLift_p4  = useTransform(p4, [0, 1], [0, 0])
  const titleShrink_p4   = useTransform(p4, [0, 1], [1, 1])
  const subtitleShrink_p4= useTransform(p4, [0, 1], [1, 1])

  const titleLift_p5     = useTransform(p5, [0.0, 0.3, 1.0], [0, -128, -128], { clamp: true })
  const subtitleLift_p5  = useTransform(p5, [0.0, 0.3, 1.0], [0, -220, -220], { clamp: true })
  const titleShrink_p5   = useTransform(p5, [0.0, 0.3, 1.0], [1, 0.5, 0.5], { clamp: true })
  const subtitleShrink_p5= useTransform(p5, [0.0, 0.3, 1.0], [1, 0.5, 0.5], { clamp: true })

  const titleLift    = useTransform([titleLift_p4,    titleLift_p5],    ([a, b]) => Number(a) + Number(b))
  const subtitleLift = useTransform([subtitleLift_p4, subtitleLift_p5], ([a, b]) => Number(a) + Number(b))

  const titleScale = useTransform([titleScaleIn,    titleShrink_p4,    titleShrink_p5],    ([a, b, c]) => Number(a) * Number(b) * Number(c))
  const subtitleScale = useTransform([subtitleScaleIn, subtitleShrink_p4, subtitleShrink_p5], ([a, b, c]) => Number(a) * Number(b) * Number(c))

  // ───────────────── 어바웃 등장 ─────────────────
  const [aboutInteractive, setAboutInteractive] = useState(false)
  useMotionValueEvent(p5, 'change', (v) => {
    if (!aboutInteractive && v >= 0.999) setAboutInteractive(true)
    if (aboutInteractive && v < 0.98) setAboutInteractive(false)
  })

  return (
    <>
      <div className='relative w-full top-0'>
        <div ref={wrapRef}>
          <section className='relative h-[1400dvh] bg-black'>
            <div className='sticky h-[100dvh] top-0' style={{ contain: 'layout style paint' }}>
              <section className='relative w-full h-full bg-white'>
                {/* 핑크 사각형 */}
                <div className='absolute left-1/2 top-[45dvh] -translate-x-1/2 -translate-y-1/2'>
                  <motion.div
                    ref={rectRef}
                    initial={false}
                    className='bg-[#FF60B9]'
                    style={{
                      width: '17vw',
                      height: '8.33vw',
                      borderRadius: '5px',
                      scale: rectScale,
                      opacity: rectOpacity,
                      transformOrigin: 'center',
                      willChange: 'transform',
                    }}
                  />
                </div>

                {/* Lottie BG */}
                <motion.div
                  className='absolute inset-0 pointer-events-none overflow-hidden'
                  aria-hidden
                  style={{ opacity: lottieOpacity }}
                >
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={bgAnim}
                    autoplay={false}
                    loop={false}
                    rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                    style={{ width: '100%', height: '100%' }}
                    className='[&_svg]:w-full [&_svg]:h-full [&_svg]:block'
                  />
                </motion.div>

                {/* Title */}
                <div className='absolute left-1/2 top-[33dvh] -translate-x-1/2 -translate-y-1/2 font-english mix-blend-difference text-center text-white font-semibold z-[9999]'>
                  <motion.span initial={false} style={{ scale: titleScale, y: titleLift }} className='block leading-none text-[2.77vw]'>
                    New Formative
                  </motion.span>
                </div>

                {/* Subtitle */}
                <div className='absolute left-1/2 top-[60.56dvh] w-[400px] -translate-x-1/2 -translate-y-1/2 font-english mix-blend-difference text-center text-white font-semibold leading-[270%] z-[9999]'>
                  <motion.span initial={false} style={{ scale: subtitleScale, y: subtitleLift }} className='block text-[2.77vw]'>
                    Steady Movement
                    <br />
                    For Progress
                  </motion.span>
                </div>

                {/* Infos */}
                <div className='absolute left-1/4 top-[42.86dvh] -translate-x-1/2 -translate-y-1/2 font-english mix-blend-difference text-center text-white font-medium w-[424px] leading-[160%] z-[9999]'>
                  <motion.span initial={false} style={{ opacity: infoOpacity }} className='block text-[25px]'>
                    Samsung Design Membership Emergence Project
                  </motion.span>
                </div>
                <div className='absolute left-3/4 top-[42.86dvh] -translate-x-1/2 -translate-y-1/2 font-english mix-blend-difference text-center text-white font-medium w-[305px] leading-[160%] z-[9999]'>
                  <motion.span initial={false} style={{ opacity: infoOpacity }} className='block text-[25px]'>
                    Aug 22 – 27 (Fri – Wed) Open daily 10AM – 5PM
                  </motion.span>
                </div>

                {/* Scroll arrow */}
                <motion.div
                  initial={false}
                  style={{ opacity: arrowOpacity }}
                  className='absolute left-1/2 bottom-[7.6dvh] -translate-x-1/2 -translate-y-1/2 text-white mix-blend-difference'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='29' height='16' viewBox='0 0 29 16' fill='none'>
                    <path d='M14.4974 16c-.407 0-.811-.155-1.12-.463L.4638 2.691A1.5 1.5 0 0 1 2.7076.461L14.5 12.193 26.2924.461a1.5 1.5 0 1 1 2.2438 2.23L15.6232 15.537A1.5 1.5 0 0 1 14.4974 16Z' fill='currentColor'/>
                  </svg>
                </motion.div>
              </section>

              {/* 3D planes */}
              <section className='absolute inset-0 flex items-center justify-center pointer-events-none z-0'>
                <motion.div
                  className='relative w-[84vw] h-[42vw] max-w-[1440px]'
                  style={{
                    transformStyle: 'preserve-3d',
                    opacity: planesOpacity,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    x: '-50%',
                    y: '-50%',
                    perspective: 1400,
                  }}
                >
                  <motion.div
                    className='absolute inset-0 m-auto rounded-lg'
                    style={{
                      width: '100%',
                      height: '95%',
                      background: '#FF60B9',
                      rotateX: planeTiltDeg,
                      translateZ: 0,
                      y: backYFinal,
                      willChange: 'transform',
                      transformOrigin: 'center bottom',
                    }}
                  />
                  <motion.div
                    className='absolute inset-0 m-auto rounded-lg'
                    style={{
                      width: '90%',
                      height: '80%',
                      background: '#FFF790',
                      rotateX: planeTiltDeg,
                      translateZ: 8,
                      y: midYFinal,
                      willChange: 'transform',
                      transformOrigin: 'center bottom',
                    }}
                  />
                  <motion.div
                    className='absolute inset-0 m-auto rounded-lg'
                    style={{
                      width: '72%',
                      height: '69%',
                      background: '#FF5E1F',
                      rotateX: planeTiltDeg,
                      translateZ: 20,
                      y: frontYFinal,
                      willChange: 'transform',
                      transformOrigin: 'center bottom',
                    }}
                  />
                </motion.div>
              </section>

              {/* photos */}
              <section className='absolute inset-0 pointer-events-none z-[100]' style={{ overflow: 'visible' }}>
                <motion.div className='relative w-full h-full'>
                  {photos.map((ph) => {
                    const y = useTransform(p4, (v) => ph.base + v * -4100) // planesLiftUp과 동일한 값 반영
                    const scale = useTransform(p4, ph.fade as [number, number], [0.96, 1])
                    return (
                      <motion.img
                        key={ph.src}
                        src={ph.src}
                        alt=''
                        className='absolute top-1/2 -translate-y-1/2'
                        style={{ left: ph.left, width: ph.width, y, scale }}
                      />
                    )
                  })}
                </motion.div>
              </section>
            </div>
          </section>
        </div>

        {/* About */}
        <section aria-label='About' className='relative bg-white'>
          <motion.div initial={false} className={aboutInteractive ? 'pointer-events-auto' : 'pointer-events-none'}>
            <AboutSection />
          </motion.div>
        </section>
      </div>
    </>
  )
}
