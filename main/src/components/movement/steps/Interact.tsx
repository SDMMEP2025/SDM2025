'use client'

import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import animationData from '@/animation/interact_loading.json'
import FloatingConcentricSquares from './FloatingConcentricSquares'

// ──────────────────────────────────────────────────────────────────────────────
// 타입들
// ──────────────────────────────────────────────────────────────────────────────
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
  axisLock?: 'none' | 'x' | 'y' | 'dominant'
  axisLockThreshold?: number
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

// optional: 외부에서 쓰면 import로 대체
export function InteractMotionControlPanel({
  isVisible,
  onToggle,
  onMotionParamsChange,
}: {
  isVisible: boolean
  onToggle: () => void
  onMotionParamsChange: (p: InteractMotionParams) => void
}) {
  return (
    <div className="fixed right-4 bottom-4 z-[200]">
      <button
        className="px-3 py-2 rounded-full bg-black text-white"
        onClick={onToggle}
      >
        {isVisible ? 'Hide Motion' : 'Show Motion'}
      </button>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// 유틸
// ──────────────────────────────────────────────────────────────────────────────
function interpolateColor(color1: string, color2: string, factor: number): string {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null
  }
  const rgbToHex = (r: number, g: number, b: number) =>
    '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

  const a = hexToRgb(color1)
  const b = hexToRgb(color2)
  if (!a || !b) return color1

  const r = Math.round(a.r + factor * (b.r - a.r))
  const g = Math.round(a.g + factor * (b.g - a.g))
  const bl = Math.round(a.b + factor * (b.b - a.b))
  return rgbToHex(r, g, bl)
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return hex
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  return `rgb(${r}, ${g}, ${b})`
}

// 축 고정 유틸 + 히스테리시스
function makeAxisLocker() {
  const lastAxisRef = { current: 'x' as 'x' | 'y' }
  return function applyAxisLock(
    x: number,
    y: number,
    mode: 'none' | 'x' | 'y' | 'dominant',
    thr: number,
  ) {
    if (mode === 'x') return { x, y: 0 }
    if (mode === 'y') return { x: 0, y }
    if (mode === 'dominant') {
      const ax = Math.abs(x), ay = Math.abs(y)
      if (ax > ay + thr) lastAxisRef.current = 'x'
      else if (ay > ax + thr) lastAxisRef.current = 'y'
      return lastAxisRef.current === 'x' ? { x, y: 0 } : { x: 0, y }
    }
    return { x, y }
  }
}
const applyAxisLock = makeAxisLocker()


// ──────────────────────────────────────────────────────────────────────────────
export function InteractPage({ interactionData, onStartOver }: InteractPageProps) {
  const { steps, positions, brandColorName, brandColorHex, refinedColorName, refinedColorHex, text } = interactionData

  const [isLoadingDone, setIsLoadingDone] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const lottieRef = useRef<LottieRefCurrentProps>(null)

  const [motionParams, setMotionParams] = useState<InteractMotionParams>({
    speedBase: 0.01,
    followSpeedMultiplier: 2,
    followSpeedOffset: 1,
    colorInterpolationPower: 0.9,
    floatAmplitude: 8,
    floatSpeed: 0.02,
    tiltSensitivity: 25,
    hoverScale: 1.1,
    shadowIntensity: 0,
    borderRadiusOuter: 8,
    gyroSensitivity: 0.9,
    axisLock: 'dominant',       // ← 축 고정 기본값
    axisLockThreshold: 0.1,     // ← 우세 축 전환 히스테리시스
  })
  const [isMotionPanelVisible, setIsMotionPanelVisible] = useState(false)

  // 로딩 타이머
  useEffect(() => {
    const t = setTimeout(() => setIsLoadingDone(true), 1200)
    return () => clearTimeout(t)
  }, [])

  // 로컬 캔버스 렌더 → 이미지 다운로드
  const generateShareImageLocally = async (d: InteractPageProps['interactionData']): Promise<string> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = 1080
    canvas.height = 1920
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#4B4F57'
    ctx.font = '400 40px "saans", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('New Formative', canvas.width / 2, 82)

    const gradientTop = ctx.createLinearGradient(0, 200, 0, 540)
    gradientTop.addColorStop(0, '#000000')
    gradientTop.addColorStop(0.6, '#000000')
    gradientTop.addColorStop(1, '#818181')
    ctx.fillStyle = gradientTop

    ctx.font = 'bold 182px "saans", system-ui, -apple-system, sans-serif'
    ctx.fillText('Your', canvas.width / 2, 328)
    ctx.fillText('Movement', canvas.width / 2, 494)

    const scale = 2.3
    const maxWidth = 420
    const maxHeight = 316
    const stepReduction = 25
    const centerX = canvas.width / 2
    const centerY = 952

    for (let i = 0; i < d.steps; i++) {
      const factor = d.steps > 1 ? Math.pow(i / (d.steps - 1), motionParams.colorInterpolationPower) : 0
      const w = (maxWidth - stepReduction * i) * scale
      const h = (maxHeight - stepReduction * i) * scale
      const color = interpolateColor(d.brandColorHex, d.refinedColorHex, factor)
      const p = d.positions[i] || { x: 0, y: 0 }
      const x = centerX + p.x * scale - w / 2
      const y = centerY + p.y * scale - h / 2
      ctx.fillStyle = color
      if (i === 0) {
        const radius = motionParams.borderRadiusOuter * scale
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + w - radius, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
        ctx.lineTo(x + w, y + h - radius)
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
        ctx.lineTo(x + radius, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.fill()
      } else {
        ctx.fillRect(x, y, w, h)
      }
    }

    const gradientBottom = ctx.createLinearGradient(0, 1400, 0, 1760)
    gradientBottom.addColorStop(0, '#000000')
    gradientBottom.addColorStop(0.6, '#000000')
    gradientBottom.addColorStop(1, '#818181')
    ctx.fillStyle = gradientBottom
    ctx.font = 'bold 182px "saans", system-ui, -apple-system, sans-serif'
    ctx.fillText('Is New', canvas.width / 2, 1552)
    ctx.fillText('Formative', canvas.width / 2, 1720)

    ctx.fillStyle = '#4B4F57'
    ctx.font = '400 37px "saans", system-ui, -apple-system, sans-serif'
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
      const response = await fetch(await generateShareImageLocally(interactionData))
      const blob = await response.blob()
      const photoFile = new File([blob], `your-movement-creation-${Date.now()}.png`, { type: 'image/png' })
      const shareOptions: any = { title: '', text: 'SAMSUNG DESIGN MEMBERSHIP MOVEMENT', files: [photoFile] }
      const nav: any = navigator
      if (nav.canShare && nav.canShare(shareOptions)) {
        await nav.share(shareOptions)
      } else {
        await nav.share({ title: '', text: 'SAMSUNG DESIGN MEMBERSHIP MOVEMENT', url: window.location.href })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="w-full h-full bg-white">
      <InteractMotionControlPanel
        onMotionParamsChange={setMotionParams}
        isVisible={isMotionPanelVisible}
        onToggle={() => setIsMotionPanelVisible(!isMotionPanelVisible)}
      />

      {/* Loading */}
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

      {/* Main */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: isLoadingDone ? 1 : 0 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={classNames(
          'w-fit h-full flex flex-col items-center justify-center relative',
          'left-1/2 transform -translate-x-1/2 ',
          'top-[18vh] gap-[7px] md:gap-[10px] lg:gap-[12px] 2xl:gap-[15px]',
          'md:top-[20vh] md-landscape:top-[15vh] lg:top-[10vh] 2xl:top-[10vh]',
        )}
      >
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: isLoadingDone ? 1 : 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-1/2 -translate-x-1/2 flex flex-col-reverse justify-center items-center z-[10] h-[70dvh] w-[100vw] gap-4 top-[0] lg:top-[3dvh]"
        >
          <FloatingConcentricSquares
            steps={steps}
            positions={positions}
            brandColorHex={brandColorHex}
            refinedColorHex={refinedColorHex}
            motionParams={motionParams}
          />
        </motion.div>

        {/* 측면 텍스트 */}
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
              'font-medium text-black text-[18px] md:text-[17px] md-landscape:text-[24px] lg:text-[28px]  leading-[1.3] md:leading-[1.5] md-landscape:leading-[1.2] lg:leading-[1.2] mix-blend-difference',
            )}
          >
            <div className="block md:hidden">Rgb</div>
            <div className="block md:hidden">{hexToRgb(refinedColorHex).replace('rgb(', '').replace(')', '')}</div>
            <div className="hidden md:block whitespace-nowrap">{refinedColorName}</div>
            <div className="hidden md:block whitespace-nowrap">{hexToRgb(refinedColorHex)}</div>
          </motion.div>
        </div>

        <h3
          style={{
            background: 'linear-gradient(180deg, #000 42%, #818181 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          className={classNames(
            'display-none z-[0] text-[clamp(34px,calc(-20.705px+15.196vw),126px)] leading-[95%] letterSpacing-[-0.68px]',
            'md-landscape:text-[132px] md:leading-[100%] md:letterSpacing-[-3.168px]',
            'lg:text-[clamp(160px,calc(-1.8px+11.25vw),286px)] lg:leading-[100%] lg:letterSpacing-[-3.84px]',
            '2xl:text-[286px] 2xl:leading-[100%] 2xl:letterSpacing-[-6.864px]',
            'whitespace-nowrap text-center font-semibold font-english',
          )}
        >
          Your Movement
        </h3>

        <div className="text-[#FF60B9] block md:hidden text-[17px] leading-[100%] letterSpacing-[-0.34px]">
          {interactionData.text}
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
          onClick={handleDownload} disabled={isGenerating}
          className={classNames(
            'bg-black text-white rounded-full flex justify-center items-center transition-all duration-200 md:hover:bg-neutral-700',
            'h-auto aspect-square w-[46px] md:w-[46px] lg:w-[clamp(46px,calc(0.85714px+2.14286vw),74px)] 2xl:w-[74px] cursor-pointer',
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={classNames('text-white w-4', 'w-[clamp(20px,calc(27.529px-0.980392vw),24px)]','lg:w-[clamp(20px,calc(2px+1.25vw),34px)]','2xl:w-[34px]')} viewBox="0 0 20 21" fill="currentColor">
            <path d="M4.44144 9.35876C4.07276 8.98884 4.07081 8.391 4.43708 8.01868C4.80872 7.6409 5.41727 7.63918 5.79104 8.01485L7.27674 9.50814C7.66696 9.89836 8.03877 10.2886 8.39218 10.6788C8.75295 11.0764 9.01432 11.3782 9.1763 11.5844C9.2542 11.6759 9.40501 11.6123 9.39538 11.4926C9.33031 10.6842 9.29778 9.74289 9.29778 8.6688L9.29778 1.34665C9.29778 0.755012 9.7774 0.27539 10.369 0.27539C10.9607 0.27539 11.4403 0.755011 11.4403 1.34665L11.4403 8.6688C11.4403 9.22099 11.4256 9.76215 11.3961 10.2923C11.374 10.8224 11.3483 11.2163 11.3188 11.474C11.3087 11.5916 11.4578 11.6528 11.5343 11.5628C12.0588 10.9459 12.6975 10.261 13.4503 9.50814L14.9462 8.02744C15.3222 7.65527 15.9282 7.65682 16.3023 8.0309C16.6786 8.40723 16.6776 9.01769 16.3 9.39276L10.9398 14.7172C10.6183 15.0366 10.099 15.0353 9.7791 14.7143L4.44144 9.35876Z" />
            <rect x="0.554688" y="18.5811" width="18.8929" height="1.64286" rx="0.821429" />
          </svg>
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0 }} animate={{ opacity: isSharing ? 0.2 : 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ opacity: 1 }} whileTap={{ scale: 0.95, opacity: 1 }}
          onClick={handleShare} disabled={isSharing}
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
