'use client'

import dynamic from 'next/dynamic'
import { useMemo, useRef, useLayoutEffect, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { chromeProgress } from '@/lib/chromeProgress'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import bgAnim from '@/animation/main.json'
import { easeInOut } from 'framer-motion'
import { useSpring } from 'framer-motion'
import AboutSection from '../about/AboutSection'
import { aboutPhase } from '@/lib/phase'
import { useSnapP0toP5 } from '@/utils/snapping'
import ThickPlane from './Cube'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useIsLandscape } from '@/hooks/useIsLandscape'
import { FloatingPhoto } from './Photo'

type Cut = { start: number; end: number }
const seg = (i: number, N: number): Cut => ({ start: i / N, end: (i + 1) / N })
function useSectionProgress(global: MotionValue<number>, cut: Cut) {
  return useTransform(global, [cut.start, cut.end], [0, 1], { clamp: true })
}

export function ScrollOrchestrator() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const N = 6
  const isLandscape = useIsLandscape()
  const isMdUp = useMediaQuery('(min-width: 768px)')
  const isMdPortrait = useMediaQuery('(min-width: 768px)') && isLandscape

  const vhPx = useVhPx()

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

  const cuts = useMemo(() => Array.from({ length: N }, (_, i) => seg(i, N)), [N])
  const p0 = useSectionProgress(scrollYProgress, cuts[0])
  const p1 = useSectionProgress(scrollYProgress, cuts[1])
  const p2 = useSectionProgress(scrollYProgress, cuts[2])
  const p3 = useSectionProgress(scrollYProgress, cuts[3])
  const p4 = useSectionProgress(scrollYProgress, cuts[4])
  const p5 = useSectionProgress(scrollYProgress, cuts[5])

  useMotionValueEvent(p5, 'change', (v) => {
    aboutPhase.set(v)
  })

  const p0Local = p0
  useMotionValueEvent(p0Local, 'change', (v) => {
    chromeProgress.set(v)
  })

  useSnapP0toP5(wrapRef, scrollYProgress, cuts, {
    duration: 750,
    nearPct: 0.05,
  })

  // ───────────────── Section 1 ─────────────────
  const TITLE_LIFT_P0 = isMdUp ? -30.2 : -20 * vhPx
  const SUBTITLE_LIFT_P0 = isMdUp ? 30.2 : 20 * vhPx
  const TITLE_SCALE_TARGET = isMdUp ? 2.2 : 1.2
  const SUBTITLE_SCALE_TARGET = isMdUp ? 2.2 : 1.2

  const titleLift_p0 = useTransform(p0Local, [0, 1.0], [1, TITLE_LIFT_P0])
  const subtitleLift_p0 = useTransform(p0Local, [0, 1.0], [1, SUBTITLE_LIFT_P0])

  const titleScaleIn = useTransform(p0Local, [0, 1.0], [1, TITLE_SCALE_TARGET])
  const subtitleScaleIn = useTransform(p0Local, [0, 1.0], [1, SUBTITLE_SCALE_TARGET])

  const opacityScale = useTransform(chromeProgress, [0, 0.3, 1.0], [0, 0, 1])
  const [coverScale, setCoverScale] = useState(1)

  useLayoutEffect(() => {
    const calc = () => {
      const el = rectRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight + +100
      const s = Math.max(vw / Math.max(r.width, 1), vh / Math.max(r.height, 1)) * 2
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

  const rectScale = useTransform(p0Local, [0, 0.1], [1, coverScale])
  const rectOpacity = useTransform(p0Local, [0.2, 0.9], [1, 0], { clamp: true })

  const [lottiePlayed, setLottiePlayed] = useState(false)
  useMotionValueEvent(p0Local, 'change', (v) => {
    if (v >= 0.99 && !lottiePlayed) {
      lottieRef.current?.play()
      setLottiePlayed(true)
    }
  })

  // ───────────────── Section 2 ─────────────────
  const lottieHardCut = useTransform(p2, (v) => (v > 0 ? 0 : 1))
  const lottieOpacity = useTransform([opacityScale, lottieHardCut], ([a, b]) => Number(a) * Number(b))

  // ───────────────── Section 3 ─────────────────
  const planesOpacity = useTransform(p2, [0.0, 0.1], [0, 1], { clamp: true, ease: easeInOut })
  const planeTiltDegRaw = useTransform(p2, [0, 1], [0, 82])
  const planeTiltDeg = useSpring(planeTiltDegRaw, { stiffness: 120, damping: 20, mass: 0.6 })
  const LIFT_P3 = isMdUp ? -8 * vhPx : -13 * vhPx

  const lift3 = useTransform(p2, [0.1, 0.8], [0, LIFT_P3])
  const yAll3 = lift3
  const INFO_OPACITY = isMdPortrait ? 0 : 1
  const infoFadeOut = useTransform(p2, [0, 0.2], [1, INFO_OPACITY], { ease: easeInOut })
  const infoOpacity = useTransform([opacityScale, infoFadeOut], ([a, b]) => Number(a) * Number(b))

  // ───────────────── Section 4 ─────────────────
  const sep4 = useTransform(p3, [0.0, 0.5, 1.0], [0, 0, 200], { ease: easeInOut })
  const midY = yAll3
  const frontY = useTransform(
    [p3, yAll3, sep4],
    ([t, b, sep]: [number, number, number]) => b + (t > 0 ? -sep * 0.2 : 0),
  )
  const backY = useTransform([p3, yAll3, sep4], ([t, b, sep]: [number, number, number]) => b + (t > 0 ? +sep * 0.6 : 0))

  // ───────────────── Section 5 ─────────────────
  const planesLiftUp = useTransform(p4, [0, 1], [0, -4100])
  const backYFinal = useTransform([backY, planesLiftUp], ([b, u]: [number, number]) => b + u)
  const midYFinal = useTransform([midY, planesLiftUp], ([m, u]: [number, number]) => m + u)
  const frontYFinal = useTransform([frontY, planesLiftUp], ([f, u]: [number, number]) => f + u)
  const photos = useMemo(
    () => [
      {
        src: '/images/intro/1.png',
        base: 800,
        left: '20vw',
        width: isMdPortrait ? '20vw' : '32vw',
        z: 0,
        fade: [0.0, 0.35],
      },
      {
        src: '/images/intro/2.png',
        base: 940,
        left: '60vw',
        width: isMdPortrait ? '20vw' : '30vw',
        z: 10,
        fade: [0.0, 0.35],
      },
      {
        src: '/images/intro/3.png',
        base: 1280,
        left: '23vw',
        width: isMdPortrait ? '26.66vw' : '30vw',
        z: 16,
        fade: [0.0, 0.35],
      },
      {
        src: '/images/intro/4.png',
        base: 1700,
        left: '7vw',
        width: isMdPortrait ? '22vw' : '40vw',
        z: -8,
        fade: [0.0, 0.35],
      },
      {
        src: '/images/intro/5.png',
        base: 1900,
        left: '65vw',
        width: isMdPortrait ? '24vw' : '40vw',
        z: -16,
        fade: [0.0, 0.35],
      },
    ],
    [isMdPortrait],
  )

  // ───────────────── Section 6 바인딩 ─────────────────
  const arrowOpacity = useTransform(p5, [0, 0.2], [1, 0], { ease: easeInOut, clamp: true })
  const MdtitleLift_p5 = isMdUp ? -128 : 0
  const MdsubtitleLift_p5 = isMdUp ? -220 : 0

  const MdtitleScale_p5 = isMdUp ? 0.5 : 1

  const titleShrink_p4 = useTransform(p4, [0, 1], [1, 1])
  const subtitleShrink_p4 = useTransform(p4, [0, 1], [1, 1])

  const titleLift_p5 = useTransform(p5, [0.0, 0.3], [0, MdtitleLift_p5], { clamp: true })
  const subtitleLift_p5 = useTransform(p5, [0.0, 0.3], [0, MdsubtitleLift_p5], { clamp: true })
  const titleShrink_p5 = useTransform(p5, [0.0, 0.3], [1, MdtitleScale_p5], { clamp: true })
  const subtitleShrink_p5 = useTransform(p5, [0.0, 0.3], [1, MdtitleScale_p5], { clamp: true })

  const titleLift = useTransform([titleLift_p0, titleLift_p5], ([a, b, c]) => Number(a) + Number(b))

  const subtitleLift = useTransform([subtitleLift_p0, subtitleLift_p5], ([a, b, c]) => Number(a) + Number(b))

  const titleScale = useTransform(
    [titleScaleIn, titleShrink_p4, titleShrink_p5],
    ([a, b, c]) => Number(a) * Number(b) * Number(c),
  )
  const subtitleScale = useTransform(
    [subtitleScaleIn, subtitleShrink_p4, subtitleShrink_p5],
    ([a, b, c]) => Number(a) * Number(b) * Number(c),
  )

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
              <div className='relative w-full h-full bg-white'>
                {/* 핑크 사각형 */}
                <div className='absolute left-1/2 top-[45dvh] -translate-x-1/2 -translate-y-1/2'>
                  <motion.div
                    ref={rectRef}
                    initial={false}
                    className='bg-[#FF60B9] w-[clamp(208px,17vw,236px)] aspect-[236/120] h-auto'
                    style={{
                      borderRadius: '5px',
                      scale: rectScale,
                      opacity: rectOpacity,
                      transformOrigin: 'center',
                      willChange: 'transform',
                    }}
                  />
                </div>

                <motion.div
                  className='absolute inset-0 pointer-events-none overflow-hidden'
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

                <div className='absolute whitespace-nowrap left-1/2 top-[45dvh] -translate-y-[100px] -translate-x-1/2 font-english mix-blend-difference text-center text-white font-semibold z-[9999]'>
                  <motion.span
                    initial={false}
                    style={{ scale: titleScale, y: titleLift }}
                    className='block leading-none text-[clamp(32px,2.77vw,40px)] lg:text-[clamp(36px,2.77vw,40px)]'
                  >
                    New Formative
                  </motion.span>
                </div>

                <div className='absolute left-1/2 top-[45dvh] left-1/2 -translate-x-1/2 translate-y-[60px] font-english mix-blend-difference text-center text-white font-semibold leading-[270%] z-[9999]'>
                  <motion.span
                    initial={false}
                    style={{ scale: subtitleScale, y: subtitleLift }}
                    className='block whitespace-nowrap text-[clamp(32px,2.77vw,40px)] lg:text-[clamp(36px,2.77vw,40px)]'
                  >
                    Steady Movement
                    <br />
                    For Progress
                  </motion.span>
                </div>

                <div className='absolute text-[20px] left-1/2 top-1/2 -translate-y-[32dvh] leading-[140%] md:left-1/4 md:top-[42.86dvh] -translate-x-1/2 md:-translate-y-1/2 font-english mix-blend-difference text-center text-white font-medium w-[424px] md:leading-[160%] z-[9999]'>
                  <motion.span initial={false} style={{ opacity: infoOpacity }} className='block text-[25px]'>
                    Samsung Design Membership Emergence Project
                  </motion.span>
                </div>

                <div className='absolute text-[20px] left-1/2 top-1/2 translate-y-[14dvh] leading-[140%] md:left-3/4 md:top-[42.86dvh] -translate-x-1/2 md:-translate-y-1/2 font-english mix-blend-difference text-center text-white font-medium w-[305px] md:leading-[160%] z-[9999]'>
                  <motion.span initial={false} style={{ opacity: infoOpacity }} className='block text-[25px]'>
                    Aug 22 – 27 (Fri – Wed) Open daily 10AM – 5PM
                  </motion.span>
                </div>

                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 1,
                    repeat: 3,
                    ease: 'easeInOut',
                  }}
                  style={{ opacity: arrowOpacity }}
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

              <div className='absolute inset-0 flex items-center justify-center pointer-events-none z-0'>
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
                  {/* 뒤(핑크) */}
                  <ThickPlane
                    widthPct={isMdPortrait ? 90 : 100}
                    heightPct={isMdPortrait ? 100 : 305}
                    color='#FF60B9'
                    radius={24}
                    rotateX={planeTiltDeg}
                    translateY={isMdPortrait ? -15 : 20}
                    y={backYFinal}
                    origin='center center'
                  />

                  <ThickPlane
                    widthPct={isMdPortrait ? 80 : 90}
                    heightPct={isMdPortrait ? 80 : 305}
                    color='#FFF790'
                    radius={24}
                    rotateX={planeTiltDeg}
                    translateY={isMdPortrait ? -25 : 0}
                    y={midYFinal}
                    origin='center center'
                  />

                  {/* 앞(주황) */}
                  <ThickPlane
                    widthPct={isMdPortrait ? 72 : 72}
                    heightPct={isMdPortrait ? 72 : 305}
                    color='#FF5E1F'
                    radius={40}
                    rotateX={planeTiltDeg}
                    translateY={isMdPortrait ? -30 : -20}
                    y={frontYFinal}
                    origin='center center'
                  />
                </motion.div>
              </div>
              <div className='absolute inset-0 pointer-events-none z-[100]' style={{ overflow: 'visible' }}>
                <motion.div className='relative w-full h-full'>
                  {photos.map((ph, i) => (
                    <FloatingPhoto
                      key={ph.src ?? i}
                      p4={p4}
                      src={ph.src}
                      left={ph.left}
                      base={ph.base}
                      width={ph.width}
                      fade={ph.fade}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </section>
        </div>
        <section aria-label='About' className='relative bg-white'>
          <motion.div initial={false} className={aboutInteractive ? 'pointer-events-auto' : 'pointer-events-none'}>
            <AboutSection />
          </motion.div>
        </section>
      </div>
    </>
  )
}

function useVhPx() {
  const [vh, setVh] = useState(0)
  useEffect(() => {
    const get = () => Math.round((window.visualViewport?.height ?? innerHeight) / 100)
    const update = () => setVh(get())
    update()
    window.visualViewport?.addEventListener?.('resize', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.visualViewport?.removeEventListener?.('resize', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])
  return vh
}
