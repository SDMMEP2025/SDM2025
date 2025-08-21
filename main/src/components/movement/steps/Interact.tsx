'use client'

import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import animationData from '@/animation/interact_loading.json'
import FloatingConcentricSquares, { InteractMotionParams } from './FloatingConcentricSquares'

function hexToRgb(hex: string): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return hex
  const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16)
  return `rgb(${r}, ${g}, ${b})`
}

export interface InteractPageProps {
  interactionData: {
    steps: number
    positions: Array<{ x: number; y: number }>
    brandColorName: string
    brandColorHex: string
    refinedColorName: string
    refinedColorHex: string
    text: string
  }
  onStartOver: () => void
}

export function InteractPage({ interactionData, onStartOver }: InteractPageProps) {
  const { steps, positions, brandColorName, brandColorHex, refinedColorName, refinedColorHex, text } = interactionData

  const [isLoadingDone, setIsLoadingDone] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  // 축 고정 포함 기본 파라미터
  const [motionParams, setMotionParams] = useState<InteractMotionParams>({
    speedBase: 0.01,
    followSpeedMultiplier: 2,
    followSpeedOffset: 1,
    colorInterpolationPower: 0.9,
    floatAmplitude: 8,
    floatSpeed: 0.02,
    tiltSensitivity: 25,
    hoverScale: 1.3,
    shadowIntensity: 0,
    borderRadiusOuter: 8,
    gyroSensitivity: 0.1,
    axisLock: 'dominant',
    axisLockThreshold: 0.1,
  })

  useEffect(() => {
    const t = setTimeout(() => setIsLoadingDone(true), 1200)
    return () => clearTimeout(t)
  }, [])

  // 공유/다운로드용 캔버스 렌더러 (기존 로직 그대로)
  const generateShareImageLocally = async (d: InteractPageProps['interactionData']): Promise<string> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = 1080
    canvas.height = 1920

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#4B4F57'
    ctx.font = '400 40px system-ui,-apple-system,sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('New Formative', canvas.width / 2, 82)

    const gTop = ctx.createLinearGradient(0, 200, 0, 540)
    gTop.addColorStop(0, '#000')
    gTop.addColorStop(0.6, '#000')
    gTop.addColorStop(1, '#818181')
    ctx.fillStyle = gTop
    ctx.font = 'bold 182px system-ui,-apple-system,sans-serif'
    ctx.fillText('Your', canvas.width / 2, 328)
    ctx.fillText('Movement', canvas.width / 2, 494)

    // 간단 버전: 정중앙에 정사각형군만 렌더 (정밀한 재현은 생략)
    const s = 2.3, baseW = 420, baseH = 316, step = 25
    const cx = canvas.width / 2, cy = 952
    for (let i = 0; i < d.steps; i++) {
      const t = d.steps > 1 ? Math.pow(i / (d.steps - 1), motionParams.colorInterpolationPower) : 0
      const w = (baseW - step * i) * s
      const h = (baseH - step * i) * s
      const col = (function lerp(c1: string, c2: string, f: number) {
        const rx = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
        const a = rx.exec(c1), b = rx.exec(c2)
        if (!a || !b) return c1
        const h2i = (x: string) => parseInt(x, 16)
        const i2h = (x: number) => x.toString(16).padStart(2, '0')
        const R = Math.round(h2i(a[1]) + f * (h2i(b[1]) - h2i(a[1])))
        const G = Math.round(h2i(a[2]) + f * (h2i(b[2]) - h2i(a[2])))
        const B = Math.round(h2i(a[3]) + f * (h2i(b[3]) - h2i(a[3])))
        return `#${i2h(R)}${i2h(G)}${i2h(B)}`
      })(d.brandColorHex, d.refinedColorHex, t)

      const p = d.positions[i] || { x: 0, y: 0 }
      const x = cx + p.x * s - w / 2
      const y = cy + p.y * s - h / 2
      ctx.fillStyle = col
      if (i === 0) {
        const r = motionParams.borderRadiusOuter * s
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        ctx.lineTo(x + w, y + h - r)
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        ctx.lineTo(x + r, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.fill()
      } else {
        ctx.fillRect(x, y, w, h)
      }
    }

    const gBot = ctx.createLinearGradient(0, 1400, 0, 1760)
    gBot.addColorStop(0, '#000')
    gBot.addColorStop(0.6, '#000')
    gBot.addColorStop(1, '#818181')
    ctx.fillStyle = gBot
    ctx.font = 'bold 182px system-ui,-apple-system,sans-serif'
    ctx.fillText('Is New', canvas.width / 2, 1552)
    ctx.fillText('Formative', canvas.width / 2, 1720)

    ctx.fillStyle = '#4B4F57'
    ctx.font = '400 37px system-ui,-apple-system,sans-serif'
    ctx.fillText('©2025 Samsung Design Membership Emergence Project', canvas.width / 2, 1860)

    return canvas.toDataURL('image/png')
  }

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const url = await generateShareImageLocally(interactionData)
      const a = document.createElement('a')
      a.download = 'your-movement-creation.png'
      a.href = url
      a.click()
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    try {
      setIsSharing(true)
      const res = await fetch(await generateShareImageLocally(interactionData))
      const blob = await res.blob()
      const photoFile = new File([blob], `your-movement-creation-${Date.now()}.png`, { type: 'image/png' })
      const nav: any = navigator
      const opts: any = { title: '', text: 'SAMSUNG DESIGN MEMBERSHIP MOVEMENT', files: [photoFile] }
      if (nav.canShare && nav.canShare(opts)) await nav.share(opts)
      else await nav.share({ title: '', text: 'SAMSUNG DESIGN MEMBERSHIP MOVEMENT', url: location.href })
    } catch (e) {
      console.error(e)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="w-full h-full bg-white">
      {/* 로딩 커버 */}
      <AnimatePresence>
        {!isLoadingDone && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={classNames('absolute inset-0 z-10', 'flex items-center justify-center bg-white')}
          >
            <div className="w-[90%] md:w-[70%]">
              <Lottie lottieRef={lottieRef} animationData={animationData} loop autoplay className="w-full h-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메인 */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: isLoadingDone ? 1 : 0 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={classNames(
          'w-fit h-full flex flex-col items-center justify-center relative',
          'left-1/2 transform -translate-x-1/2',
          'top-[18vh] gap-[7px] md:gap-[10px] lg:gap-[12px] 2xl:gap-[15px]',
          'md:top-[20vh] md-landscape:top-[15vh] lg:top-[10vh] 2xl:top-[10vh]',
        )}
      >
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col justify-center items-center z-[10] h-[70dvh] w-[100vw] gap-4 top-[0] lg:top-[10dvh]">
          <FloatingConcentricSquares
            steps={steps}
            positions={positions}
            brandColorHex={brandColorHex}
            refinedColorHex={refinedColorHex}
            motionParams={motionParams}
            showMobileGyroUI
          />
        </div>

        {/* 좌/우 텍스트 */}
        <div className="absolute z-[40] flex flex-row justify-between w-[90vw] md:w-full pt-[50dvh]">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: isLoadingDone ? 1 : 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={classNames(
              'w-fit max-w-28 md:max-w-36 md-landscape:max-w-48 lg:max-w-56 text-center',
              'font-medium text-black text-[18px] z-[40] md:text-[17px] md-landscape:text-[24px] lg:text-[28px] leading-[1.3] md:leading-[1.5] md-landscape:leading-[1.2] lg:leading-[1.2] mix-blend-difference',
            )}
          >
            <p className="block md:hidden break-keep z-[40]">{refinedColorName}</p>
            <p className="hidden md:block break-keep z-[40]">{text}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: isLoadingDone ? 1 : 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={classNames(
              'z-[60] w-fit max-w-28 md:max-w-36 md-landscape:max-w-48 lg:max-w-56 text-center',
              'font-medium text-black text-[18px] md:text-[17px] md-landscape:text-[24px] lg:text-[28px] leading-[1.3] md:leading-[1.5] md-landscape:leading-[1.2] lg:leading-[1.2] mix-blend-difference',
            )}
          >
            <div className="block md:hidden">Rgb</div>
            <div className="block md:hidden">{hexToRgb(refinedColorHex).replace('rgb(', '').replace(')', '')}</div>
            <div className="hidden md:block whitespace-nowrap">{refinedColorName}</div>
            <div className="hidden md:block whitespace-nowrap">{hexToRgb(refinedColorHex)}</div>
          </motion.div>
        </div>
      </motion.div>

      {/* 버튼들 */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: isLoadingDone ? 1 : 0 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={classNames('absolute flex bottom-[14.3%] left-1/2 transform -translate-x-1/2', 'gap-4 md:gap-4 lg:gap-4 2xl:gap-5')}
      >
        <motion.button
          type="button"
          initial={{ opacity: 0 }} animate={{ opacity: isGenerating ? 0.2 : 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ opacity: 1 }} whileTap={{ scale: 0.95, opacity: 1 }}
          onClick={async () => {
            setIsGenerating(true)
            try {
              const url = await generateShareImageLocally(interactionData)
              const a = document.createElement('a')
              a.download = 'your-movement-creation.png'
              a.href = url
              a.click()
            } finally {
              setIsGenerating(false)
            }
          }}
          disabled={isGenerating}
          className={classNames(
            'bg-black text-white rounded-full flex justify-center items-center transition-all duration-200 md:hover:bg-neutral-700',
            'h-auto aspect-square w-[46px] md:w-[46px] lg:w-[clamp(46px,calc(0.85714px+2.14286vw),74px)] 2xl:w-[74px] cursor-pointer',
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={classNames('text-white w-4','w-[clamp(20px,calc(27.529px-0.980392vw),24px)]','lg:w-[clamp(20px,calc(2px+1.25vw),34px)]','2xl:w-[34px]')} viewBox="0 0 20 21" fill="currentColor">
            <path d="M4.44144 9.35876C4.07276 8.98884 4.07081 8.391 4.43708 8.01868C4.80872 7.6409 5.41727 7.63918 5.79104 8.01485L7.27674 9.50814C7.66696 9.89836 8.03877 10.2886 8.39218 10.6788C8.75295 11.0764 9.01432 11.3782 9.1763 11.5844C9.2542 11.6759 9.40501 11.6123 9.39538 11.4926C9.33031 10.6842 9.29778 9.74289 9.29778 8.6688L9.29778 1.34665C9.29778 0.755012 9.7774 0.27539 10.369 0.27539C10.9607 0.27539 11.4403 0.755011 11.4403 1.34665L11.4403 8.6688C11.4403 9.22099 11.4256 9.76215 11.3961 10.2923C11.374 10.8224 11.3483 11.2163 11.3188 11.474C11.3087 11.5916 11.4578 11.6528 11.5343 11.5628C12.0588 10.9459 12.6975 10.261 13.4503 9.50814L14.9462 8.02744C15.3222 7.65527 15.9282 7.65682 16.3023 8.0309C16.6786 8.40723 16.6776 9.01769 16.3 9.39276L10.9398 14.7172C10.6183 15.0366 10.099 15.0353 9.7791 14.7143L4.44144 9.35876Z" />
            <rect x="0.554688" y="18.5811" width="18.8929" height="1.64286" rx="0.821429" />
          </svg>
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0 }} animate={{ opacity: isSharing ? 0.2 : 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ opacity: 1 }} whileTap={{ scale: 0.95, opacity: 1 }}
          onClick={async () => {
            try {
              setIsSharing(true)
              const res = await fetch(await generateShareImageLocally(interactionData))
              const blob = await res.blob()
              const file = new File([blob], `your-movement-creation-${Date.now()}.png`, { type: 'image/png' })
              const nav: any = navigator
              const opts: any = { title: '', text: 'SAMSUNG DESIGN MEMBERSHIP MOVEMENT', files: [file] }
              if (nav.canShare && nav.canShare(opts)) await nav.share(opts)
              else await nav.share({ title: '', text: 'SAMSUNG DESIGN MEMBERSHIP MOVEMENT', url: location.href })
            } finally {
              setIsSharing(false)
            }
          }}
          disabled={isSharing}
          className={classNames(
            'bg-black text-white rounded-full flex justify-center items-center transition-all duration-200 md:hover:bg-neutral-700',
            'w-[160px] h-[46px] md:h-[46px] md:w-[clamp(160px,calc(207.154px-3.27381vw),182px)] lg:h-[clamp(46px,calc(0.85714px+2.14286vw),74px)] lg:w-[clamp(160px,calc(31.4286px+8.92857vw),260px)] 2xl:w-[260px] 2xl:h-[74px] cursor-pointer',
          )}
        >
          <div className={classNames('text-white font-medium','text-[clamp(17px,calc(16.118px+0.2451vw),18px)]','lg:text-[clamp(18px,calc(0px+1.25vw),32px)]','2xl:text-[32px]')}>
            {isSharing ? 'Sharing...' : 'Share'}
          </div>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default InteractPage
