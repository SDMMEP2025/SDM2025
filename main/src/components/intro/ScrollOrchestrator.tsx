'use client'

import { useMemo, useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { easeInOut, useSpring } from 'framer-motion'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import bgAnim from '@/animation/main.json'
import AboutSection from '../about/AboutSection'
import { chromeProgress } from '@/lib/chromeProgress'
import { aboutPhase } from '@/lib/phase'
import { useSnapP0toP4 } from '@/utils/snapping'
import ThickPlane from './Cube'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useIsLandscape } from '@/hooks/useIsLandscape'
import { FloatingPhoto } from './Photo'
import { MediaContainer } from '../projects'
import AboutSectionWithoutLottie from '../about/AboutSectionWithoutLottie'
import aboutAnim from '@/animation/about_1.json'

function useStableVh() {
  useEffect(() => {
    const set = () => {
      const h1 = window.innerHeight
      const h2 = window.visualViewport?.height ?? h1
      const vh = Math.floor(Math.max(h1, h2) / 100)
      document.documentElement.style.setProperty('--vh-stable', `${vh}px`)
    }
    const on = () => requestAnimationFrame(set)
    set()
    window.addEventListener('resize', on)
    window.visualViewport?.addEventListener?.('resize', on)
    window.addEventListener('orientationchange', on)
    return () => {
      window.removeEventListener('resize', on)
      window.visualViewport?.removeEventListener?.('resize', on)
      window.removeEventListener('orientationchange', on)
    }
  }, [])
}

type Cut = { start: number; end: number }
const WEIGHTS: number[] = [1, 1, 2, 3, 1]

function makeCuts(weights: number[]): Cut[] {
  const total = weights.reduce((a, b) => a + b, 0)
  let acc = 0
  return weights.map((w) => {
    const start = acc / total
    acc += w
    return { start, end: acc / total }
  })
}

function useSectionProgress(global: MotionValue<number>, cut: Cut) {
  return useTransform(global, [cut.start, cut.end], [0, 1], { clamp: true })
}

function getStageFromURL(): string | null {
  if (typeof window === 'undefined') return null
  const url = new URL(window.location.href)
  const q = (url.searchParams.get('stage') || '').toLowerCase()
  const hash = (url.hash || '').replace('#', '').toLowerCase()
  return q || hash || null
}

function scrollToProgress(scrollerEl: HTMLElement, wrapEl: HTMLElement, progress: number) {
  const startY = wrapEl.offsetTop
  const total = wrapEl.offsetHeight
  const y = startY + Math.max(0, Math.min(1, progress)) * total
  scrollerEl.scrollTo({ top: y, behavior: 'auto' })
}

export function ScrollOrchestrator() {
  useStableVh() // 주소창 들림/하단 여백 방지

  const boxRef = useRef<HTMLDivElement>(null) // ★ 내부 스크롤 컨테이너
  const wrapRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const hasStageRef = useRef<boolean>(typeof window !== 'undefined' && !!getStageFromURL())

  const isLandscape = useIsLandscape()
  const isMdUp = useMediaQuery('(min-width: 768px)')
  const isMdPortrait = useMediaQuery('(min-width: 768px)') && isLandscape

  const vhPx = useVhPx()
  const u = useVminPx()

  const cuts = useMemo(() => makeCuts(WEIGHTS), [])

  const stageIndexByName = { main: 1 } as const
  type StageName = keyof typeof stageIndexByName
  useLayoutEffect(() => {
    if (!boxRef.current) return
    if (!hasStageRef.current) {
      boxRef.current.scrollTo({ top: 0, behavior: 'auto' })
      chromeProgress.set(0)
    }
    return () => {
      chromeProgress.set(0)
    }
  }, [])

  useEffect(() => {
    const onPageShow = (e: any) => {
      if (e?.persisted && !hasStageRef.current && boxRef.current) {
        chromeProgress.set(0)
        boxRef.current.scrollTo({ top: 0, behavior: 'auto' })
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  const jumpToStage = useCallback(
    (stage: string) => {
      const wrapEl = wrapRef.current
      const scrollerEl = boxRef.current
      if (!wrapEl || !stage || !scrollerEl) return
      const key = stage.toLowerCase() as StageName
      const idx = stageIndexByName[key]
      if (idx == null) return
      const { start, end } = cuts[idx]
      const center = (start + end) / 2
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToProgress(scrollerEl, wrapEl, center)
        })
      })
    },
    [cuts],
  )

  useEffect(() => {
    const handler = (e: Event) => {
      const stage = (e as CustomEvent).detail?.stage as string
      if (!stage) return
      jumpToStage(stage)
    }
    window.addEventListener('nf:jump', handler as EventListener)
    return () => window.removeEventListener('nf:jump', handler as EventListener)
  }, [jumpToStage])

  useEffect(() => {
    const stageNow = getStageFromURL()
    if (!stageNow) return
    let tries = 0
    const maxTries = 10
    const tick = () => {
      tries += 1
      const wrap = wrapRef.current
      const ready = !!wrap && wrap.offsetHeight > 0 && document.readyState !== 'loading' && !!boxRef.current
      if (ready) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            jumpToStage(stageNow)
          })
        })
      } else if (tries < maxTries) {
        requestAnimationFrame(tick)
      }
    }
    requestAnimationFrame(tick)
  }, [jumpToStage])

  useEffect(() => {
    const onHash = () => {
      const s = (location.hash || '').replace('#', '').toLowerCase()
      if (s) jumpToStage(s)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [jumpToStage])

  /** 핵심: window가 아니라 container 기준 진행도 */
  const { scrollYProgress } = useScroll({
    container: boxRef,
    target: wrapRef,
    offset: ['start start', 'end start'],
  })
  const [p0, p1,p2, p3] = cuts.map((c) => useSectionProgress(scrollYProgress, c))

  useMotionValueEvent(p0, 'change', (v) => chromeProgress.set(v))
  useMotionValueEvent(p3, 'change', (v) => aboutPhase.set(v))

  useSnapP0toP4(wrapRef, scrollYProgress, cuts, {
    scrollerRef: boxRef,
  })

  // ---------- Section 1 ----------
  const clampPx = (min: number, ideal: number, max: number) => Math.max(min, Math.min(ideal, max))
  const GAP = clampPx(36, 61 * u, 240)
  const TITLE_LIFT_P0 = isMdUp ? -30.2 : (-GAP * 1.05) / 2
  const SUBTITLE_LIFT_P0 = isMdUp ? 30.2 : +GAP / 2
  const TITLE_SCALE_TARGET = isMdUp ? 2.2 : 1.2
  const SUBTITLE_SCALE_TARGET = isMdUp ? 2.2 : 1.2

  const titleScaleIn = useTransform(p0, [0, 0.3], [1, TITLE_SCALE_TARGET])
  const subtitleScaleIn = useTransform(p0, [0, 0.3], [1, SUBTITLE_SCALE_TARGET])
  const opacityScale = useTransform(chromeProgress, [0, 0.3], [0, 1])

  const [coverScale, setCoverScale] = useState(1)
  useLayoutEffect(() => {
    let raf = 0
    const calc = () => {
      const el = rectRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const s = Math.max(vw / Math.max(r.width, 1), vh / Math.max(r.height, 1)) * 2
      raf = requestAnimationFrame(() => setCoverScale(s))
    }
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(calc)
    }
    calc()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const rectScale = useTransform(p0, [0, 0.3], [1, coverScale])
  const rectOpacity = useTransform(p0, [0.2, 0.3], [1, 0], { clamp: true })

  const [lottiePlayed, setLottiePlayed] = useState(false)
  useMotionValueEvent(p0, 'change', (v) => {
    if (v >= 0.99 && !lottiePlayed) {
      lottieRef.current?.play()
      setLottiePlayed(true)
    }
  })

  // ---------- Section 2 ----------
  const lottieHardCut = useTransform(p2, (v) => (v > 0.1 ? 0 : 1))
  const lottieOpacity = useTransform([opacityScale, lottieHardCut], ([a, b]) => Number(a) * Number(b))

  // ---------- Section 3 ---------- 여기가 plane이 눕혀지는 곳
  const planesOpacity = useTransform(p2, [0.1, 0.3], [0, 1])
  const p2Ease = useTransform(p2, (t) => t * t * (3 - 2 * t))
  const planeTiltDegRaw = useTransform(p2Ease, [0.1, 0.3], [0, 80.5])
  const planeTiltDeg = useSpring(planeTiltDegRaw, { stiffness: 120, damping: 20, mass: 0.4 })
  const LIFT_P3 = isMdUp ? 0 * vhPx : -2 * vhPx
  const lift3 = useTransform(p2, [0.1, 0.3], [0, LIFT_P3])
  const yAll3 = lift3
  const infoFadeOut = useTransform(p2, [0, 0.2], [1, 0], { ease: easeInOut })
  const infoOpacity = useTransform([opacityScale, infoFadeOut], ([a, b]) => Number(a) * Number(b))

  const sep4 = useTransform(p2, [0.3, 1.0], [0, 200], { ease: easeInOut })
  const frontY_P4 = isMdUp ? 0.3 : 0.6
  const midY_P4 = isMdUp ? 0.15 : 0.3
  const backY_P4 = isMdUp ? 0.1 : 0.2

  const frontY = useTransform(
    [p2, yAll3, sep4],
    ([t, b, sep]: [number, number, number]) => b + (t > 0.1 ? -sep * frontY_P4 : 0),
  )
  const midY = useTransform(
    [p2, yAll3, sep4],
    ([t, b, sep]: [number, number, number]) => b + (t > 0.1 ? -sep * midY_P4 : 0),
  )
  const backY = useTransform(
    [p2, yAll3, sep4],
    ([t, b, sep]: [number, number, number]) => b + (t > 0.1 ? +sep * backY_P4 : 0),
  )

  // ---------- Section 5 ----------
  const planeLiftMd = isMdUp ? -1570 : -2000
  const planesLiftUp = useTransform(p3, [0, 0.5], [0, planeLiftMd])
  const backYFinal = useTransform([backY, planesLiftUp], ([b, u]: [number, number]) => b + u)
  const midYFinal = useTransform([midY, planesLiftUp], ([m, u]: [number, number]) => m + u)
  const frontYFinal = useTransform([frontY, planesLiftUp], ([f, u]: [number, number]) => f + u)
  // ---------- Section 6 ----------
  const arrowOpacity = useTransform(p3, [0, 0.5], [1, 0], { ease: easeInOut, clamp: true })
  const MdtitleLift_p5 = isMdUp ? -80 : 0
  const MdsubtitleLift_p5 = isMdUp ? -240 : 0
  const MdtitleScale_p5 = isMdUp ? 0.5 : 1
  const titleShrink_p4 = useTransform(p3, [0.8, 1], [1, 1])
  const subtitleShrink_p4 = useTransform(p3, [0.8, 1], [1, 1])

  const titleLift_p5 = useTransform(p3, [0.8, 0.9], [0, MdtitleLift_p5], { clamp: true })
  const subtitleLift_p5 = useTransform(p3, [0.8, 0.9], [0, MdsubtitleLift_p5], { clamp: true })
  const titleShrink_p5 = useTransform(p3, [0.8, 0.9], [1, MdtitleScale_p5], { clamp: true })
  const subtitleShrink_p5 = useTransform(p3, [0.8, 0.9], [1, MdtitleScale_p5], { clamp: true })

  const titleLift = useTransform(
    [useTransform(p0, [0, 0.3], [1, TITLE_LIFT_P0]), titleLift_p5],
    ([a, b]) => Number(a) + Number(b),
  )
  const subtitleLift = useTransform(
    [useTransform(p0, [0, 0.3], [1, SUBTITLE_LIFT_P0]), subtitleLift_p5],
    ([a, b]) => Number(a) + Number(b),
  )
  const titleScale = useTransform(
    [titleScaleIn, titleShrink_p4, titleShrink_p5],
    ([a, b, c]) => Number(a) * Number(b) * Number(c),
  )
  const subtitleScale = useTransform(
    [subtitleScaleIn, subtitleShrink_p4, subtitleShrink_p5],
    ([a, b, c]) => Number(a) * Number(b) * Number(c),
  )

  const [aboutInteractive, setAboutInteractive] = useState(false)
  useMotionValueEvent(p3, 'change', (v) => {
    if (!aboutInteractive && v >= 0.1) setAboutInteractive(true)
    if (aboutInteractive && v < 0.1) setAboutInteractive(false)
  })

  const vimeoFadeIn = useTransform(p3, [0.9, 0.93], [0, 1], { clamp: true })
  const vimeoOpacity = useTransform([opacityScale, vimeoFadeIn], ([a, b]) => Number(a) * Number(b))

  return (
    <>
      <div
        ref={boxRef}
        className='fixed inset-0 overflow-y-auto'
        style={{
          contain: 'layout style paint',
          willChange: 'transform',
        }}
      >
        <div ref={wrapRef} style={{ height: '1300dvh' }}>
          <section className='relative' style={{ height: '1300dvh' }}>
            <div className='sticky top-0' style={{ height: '100dvh', contain: 'layout style' }}>
              <div className='relative w-full h-full bg-white'>
                {/* 핑크 사각형 */}
                <div className='absolute left-1/2 top-[45dvh] md:top-[45dvh] -translate-x-1/2 -translate-y-1/2'>
                  <motion.div
                    ref={rectRef}
                    initial={false}
                    className='bg-[#FF60B9] w-[clamp(208px,17vw,256px)] aspect-[236/120] h-auto'
                    style={{
                      borderRadius: '5px',
                      scale: rectScale,
                      opacity: rectOpacity,
                      transformOrigin: 'center',
                      willChange: 'transform',
                    }}
                  />
                </div>

                {/* Lottie */}
                <motion.div
                  className='absolute inset-0 overflow-hidden'
                  aria-hidden
                  style={{ opacity: lottieOpacity }}
                >
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={bgAnim}
                    autoplay={false}
                    loop={true}
                    rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                    style={{ width: '100%', height: '100%' }}
                    className='[&_svg]:w-full [&_svg]:h-full [&_svg]:block'
                  />
                </motion.div>

                {/* 모바일 타이틀 */}
                <div className='md:hidden absolute left-1/2 top-[45dvh] -translate-x-1/2 -translate-y-[90px] z-[9999] mix-blend-difference text-center text-white'>
                  <div className='flex flex-col items-center gap-2 font-english'>
                    <motion.span
                      initial={false}
                      style={{ scale: titleScale, y: titleLift }}
                      className='font-semibold leading-none text-[clamp(30px,2.17vw,40px)]'
                    >
                      New Formative
                    </motion.span>
                    <motion.span
                      initial={false}
                      style={{ opacity: infoOpacity, y: titleLift }}
                      className='font-medium whitespace-nowrap text-[18px] leading-[120%]'
                    >
                      Samsung Design Membership
                      <br />
                      Emergence Project
                    </motion.span>
                  </div>
                </div>

                <div className='md:hidden absolute left-1/2 top-[45dvh] -translate-x-1/2 translate-y-[0px] z-[9999] mix-blend-difference text-center text-white'>
                  <div className='flex flex-col-reverse items-center gap-4 font-english'>
                    <motion.span
                      initial={false}
                      style={{ scale: subtitleScale, y: subtitleLift }}
                      className='font-semibold whitespace-nowrap leading-none text-[clamp(30px,2.77vw,40px)]'
                    >
                      Steady Movement
                      <br />
                      For Progress
                    </motion.span>
                    <motion.span
                      initial={false}
                      style={{ opacity: infoOpacity, y: subtitleLift }}
                      className='font-medium text-[18px] leading-[120%]'
                    >
                      Aug 22 – 27 (Fri – Wed)
                      <br />
                      Open daily 10AM – 5PM
                    </motion.span>
                  </div>
                </div>

                {/* 데스크탑 타이틀/서브 */}
                <div className='hidden md:block absolute left-1/2 top-[50dvh] -translate-y-[32svh] md:left-1/4 md:top-1/2 -translate-x-1/2 md:-translate-y-[90px] font-english mix-blend-difference text-center text-white font-medium w-fit leading-[120%] md:leading-[160%] z-[9999]'>
                  <motion.span
                    initial={false}
                    style={{ opacity: infoOpacity }}
                    className='text-center text-[16px] md:text-[25px]'
                  >
                    Samsung Design Membership
                    <br />
                    Emergence Project
                  </motion.span>
                </div>

                <div className='hidden md:block absolute whitespace-nowrap left-1/2 top-[43dvh] md:-translate-y-[80px] -translate-x-1/2 lg:-translate-y-[100px] font-english mix-blend-difference text-center text-white font-semibold z-[9999]'>
                  <motion.span
                    initial={false}
                    style={{ scale: titleScale, y: titleLift }}
                    className='block leading-none text-[26px] lg:text-[40px]'
                  >
                    New Formative
                  </motion.span>
                </div>

                <div className='hidden md:block absolute left-1/2 top-[43dvh] -translate-x-1/2 md:translate-y-[100px] lg:translate-y-[90px] font-english mix-blend-difference text-center text-white font-semibold leading-none md-landscape-coming:leading-[270%] z-[9999]'>
                  <motion.span
                    initial={false}
                    style={{ scale: subtitleScale, y: subtitleLift }}
                    className='block whitespace-nowrap leading-none text-[26px] lg:text-[40px]'
                  >
                    Steady Movement
                    <br />
                    For Progress
                  </motion.span>
                </div>

                <div className='hidden md:block absolute text-[20px] left-1/2 top-1/2 leading-[140%] md:left-3/4 -translate-x-1/2 md:-translate-y-[90px] font-english mix-blend-difference text-center text-white font-medium w-[305px] leading-[120%] md:leading-[160%] z-[9999]'>
                  <motion.span
                    initial={false}
                    style={{ opacity: infoOpacity }}
                    className='block text-[16px] md:text-[25px]'
                  >
                    Aug 22 – 27 (Fri – Wed)
                    <br />
                    Open daily 10AM – 5PM
                  </motion.span>
                </div>

                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: 3, ease: 'easeInOut' }}
                  style={{ opacity: arrowOpacity }}
                  className='fixed left-1/2 top-[93dvh] -translate-x-1/2 text-white mix-blend-difference'
                  aria-hidden
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='29' height='16' viewBox='0 0 29 16' fill='none'>
                    <path
                      d='M14.4974 16c-.407 0-.811-.155-1.12-.463L.4638 2.691A1.5 1.5 0 0 1 2.7076.461L14.5 12.193 26.2924.461a1.5 1.5 0 1 1 2.2438 2.23L15.6232 15.537A1.5 1.5 0 0 1 14.4974 16Z'
                      fill='currentColor'
                    />
                  </svg>
                </motion.div>
                <motion.div
                  className='h-full -translate-y-1/2 top-[45dvh] md:-translate-y-0 md:top-0 md:w-full md-landscape-coming:h-auto lg:h-auto absolute flex justify-center items-center pointer-events-none overflow-hidden'
                  aria-hidden
                  style={{ opacity: vimeoOpacity, willChange: 'opacity' }}
                >
                  <Lottie
                    animationData={aboutAnim}
                    autoplay={true}
                    loop={true}
                    rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                    className='w-full aspect-[1440/1100] md:aspect-[1440/1500] md:h-full md-landscape-coming:h-auto md-landscape-coming:w-full lg:h-auto lg:w-full [&_svg]:w-full [&_svg]:h-full [&_svg]:block'
                  />
                </motion.div>
              </div>

              {/* 3D planes */}
              <div className='absolute inset-0 flex items-center justify-center z-0'>
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
                  <ThickPlane
                    widthPct={isMdPortrait ? 90 : 90}
                    heightPct={isMdPortrait ? 100 : 305}
                    color='#FF60B9'
                    radius={10}
                    rotateX={planeTiltDeg}
                    translateY={isMdPortrait ? 0 : 20}
                    y={backYFinal}
                    origin='center center'
                  />
                  <ThickPlane
                    widthPct={isMdPortrait ? 80 : 80}
                    heightPct={isMdPortrait ? 80 : 305}
                    color='#FFF790'
                    radius={10}
                    rotateX={planeTiltDeg}
                    translateY={isMdPortrait ? -40 : 0}
                    y={midYFinal}
                    origin='center center'
                  />
                  <ThickPlane
                    widthPct={isMdPortrait ? 72 : 64}
                    heightPct={isMdPortrait ? 72 : 305}
                    color='#FF5E1F'
                    radius={10}
                    rotateX={planeTiltDeg}
                    translateY={isMdPortrait ? -80 : -20}
                    y={frontYFinal}
                    origin='center center'
                  />
                </motion.div>
              </div>

              {/* 떠다니는 사진 */}
              <div className='inset-0 z-[100]' style={{ overflow: 'visible' }}>
                <motion.div className='relative w-full h-full'>
                  <FloatingPhoto
                    p4={p3}
                    src={isMdPortrait ? '/images/intro/pc.png' : '/images/intro/mo.png'}
                    left='0'
                    base={isMdPortrait ? 200 : 20}
                    width='100vw'
                    fade={[0, 1]}
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* About */}
          <section aria-label='About' className='relative bg-white md:mt-0'>
            <motion.div initial={false} className={aboutInteractive ? 'pointer-events-auto' : 'pointer-events-none'}>
              <AboutSectionWithoutLottie />
            </motion.div>
          </section>
        </div>
      </div>
    </>
  )
}

function useVhPx() {
  const [dvh, setdvh] = useState(0)
  useEffect(() => {
    const get = () => Math.round(window.innerHeight / 100)
    const update = () => setdvh(get())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])
  return dvh
}

function useVminPx() {
  const [u, setU] = useState(0)
  useEffect(() => {
    const get = () => Math.round(Math.min(innerWidth, innerHeight) / 100)
    const update = () => setU(get())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])
  return u
}
