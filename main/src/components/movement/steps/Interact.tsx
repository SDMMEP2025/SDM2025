// InteractPage 컴포넌트에 다음과 같이 모션 컨트롤을 추가하세요:

import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { InteractMotionControlPanel, InteractMotionParams } from '../InteractMotionControlPanel' // 경로는 실제 구조에 맞게 조정
import FloatingConcentricSquares from './FloatingConcentricSquares' // 업데이트된 컴포넌트

interface InteractPageProps {
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

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return hex

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return `rgb(${r}, ${g}, ${b})`
}

export function InteractPage({ interactionData, onStartOver }: InteractPageProps) {
  const { steps, positions, brandColorName, brandColorHex, refinedColorHex, text } = interactionData
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // 모션 컨트롤 관련 state 추가
  const [motionParams, setMotionParams] = useState<InteractMotionParams>({
    speedBase: 0.08,
    followSpeedMultiplier: 0.4,
    followSpeedOffset: 1.0,
    colorInterpolationPower: 0.9,
    floatAmplitude: 15,
    floatSpeed: 0.02,
    tiltSensitivity: 15,
    hoverScale: 1.08,
    shadowIntensity: 1.0,
    borderRadiusOuter: 8,
    gyroSensitivity: 1.0,
  })
  const [isMotionPanelVisible, setIsMotionPanelVisible] = useState(false)

  const handleMotionParamsChange = (params: InteractMotionParams) => {
    setMotionParams(params)
  }

  // 로컬 이미지 생성 함수 (기존 코드 유지)
  const generateShareImageLocally = async (interactionData: InteractPageProps['interactionData']): Promise<string> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    // 인스타그램 스토리 사이즈 (9:16 비율)
    canvas.width = 1080
    canvas.height = 1920

    // 배경색 (흰색)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 상단 "New Formative" 텍스트
    ctx.fillStyle = '#6B7280'
    ctx.font = '36px "Saans TRIAL", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('New Formative', canvas.width / 2, 120)

    // "Your Movement" 대형 텍스트
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 182px "Saans TRIAL", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'

    // "Your" 텍스트
    ctx.fillText('Your', canvas.width / 2, 280)

    // "Movement" 텍스트
    ctx.fillText('Movement', canvas.width / 2, 420)

    // ConcentricSquares 그리기 (motionParams의 colorInterpolationPower와 borderRadiusOuter 적용)
    const scale = 2.2
    const maxWidth = 420
    const maxHeight = 316
    const stepReduction = 25
    const centerX = canvas.width / 2
    const centerY = 842 // 중앙 위치

    // interpolateColor 함수 (motionParams 적용)
    const interpolateColor = (color1: string, color2: string, factor: number): string => {
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null
      }
      const rgbToHex = (r: number, g: number, b: number) =>
        '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

      const rgb1 = hexToRgb(color1)
      const rgb2 = hexToRgb(color2)
      if (!rgb1 || !rgb2) return color1

      const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r))
      const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g))
      const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b))
      return rgbToHex(r, g, b)
    }

    for (let i = 0; i < interactionData.steps; i++) {
      const factor = interactionData.steps > 1 ? Math.pow(i / (interactionData.steps - 1), motionParams.colorInterpolationPower) : 0
      const width = (maxWidth - stepReduction * i) * scale
      const height = (maxHeight - stepReduction * i) * scale

      const color = interpolateColor(interactionData.brandColorHex, interactionData.refinedColorHex, factor)

      const position = interactionData.positions[i] || { x: 0, y: 0 }
      const x = centerX + position.x * scale - width / 2
      const y = centerY + position.y * scale - height / 2

      ctx.fillStyle = color

      if (i === 0) {
        // 첫 번째 사각형은 둥근 모서리 (motionParams.borderRadiusOuter 적용)
        ctx.beginPath()
        const radius = motionParams.borderRadiusOuter * scale
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.fill()
      } else {
        ctx.fillRect(x, y, width, height)
      }
    }

    // 하단 "Is New Formative" 텍스트
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 182px "Saans TRIAL", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'

    ctx.fillText('Is New', canvas.width / 2, 1480)
    ctx.fillText('Formative', canvas.width / 2, 1620)

    ctx.fillStyle = '#6B7280'
    ctx.font = '37px "Saans TRIAL", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('©2025 Samsung Design Membership Emergence Project', canvas.width / 2, 1800)

    return canvas.toDataURL('image/png')
  }

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const imageDataUrl = await generateShareImageLocally(interactionData)

      const link = document.createElement('a')
      link.download = 'your-movement-creation.png'
      link.href = imageDataUrl
      link.click()
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='w-full h-full bg-white'>
      {/* 모션 컨트롤 패널 추가 */}
      <InteractMotionControlPanel
        onMotionParamsChange={handleMotionParamsChange}
        isVisible={isMotionPanelVisible}
        onToggle={() => setIsMotionPanelVisible(!isMotionPanelVisible)}
      />

      <div className='absolute top-[4vh] lg:top-0 z-20 md:z-0 left-1/2 transform -translate-x-1/2 w-full h-fit flex flex-col items-center justify-center relative'>
        <h3 className=' text-[34px] md:text-[96px] md-landscape:text-[132px] lg:text-[160px] whitespace-nowrap text-center font-semibold text-gray-800 font-english'>
          Your Movement
        </h3>
        <div className='block md:hidden'>{interactionData.text}</div>
      </div>

      <div
        className=' flex items-center justify-center w-full h-full md:h-[50vh] md-landscape:h-[60vh] lg:h-[80vh]'
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <FloatingConcentricSquares
          steps={steps}
          positions={positions}
          brandColorHex={brandColorHex}
          refinedColorHex={refinedColorHex}
          interactionData={interactionData}
          motionParams={motionParams} // 모션 파라미터 전달
        />
      </div>

      {/* left */}
      <div
        className={classNames(
          'absolute top-1/2 -translate-y-1/2 left-4 md:left-12 w-fit max-w-28 md:max-w-36 md-landscape:max-w-48 lg:max-w-56 text-center',
          'font-medium text-white text-[18px] md:text-[17px] md-landscape:text-[24px] lg:text-[28px] leading-[1.3] md:leading-[1.5] md-landscape:leading-[1.2] lg:leading-[1.2] mix-blend-difference',
        )}
      >
        <p className='block md:hidden break-keep'>{brandColorName}</p>
        <p className='hidden md:block break-keep'>{text}</p>
      </div>

      {/* right */}
      <div
        className={classNames(
          'absolute top-1/2 -translate-y-1/2 right-4 md:right-12 w-fit max-w-28 md:max-w-36 md-landscape:max-w-48 lg:max-w-56 text-center',
          'font-medium text-white text-[18px] md:text-[17px] md-landscape:text-[24px] lg:text-[28px]  leading-[1.3] md:leading-[1.5] md-landscape:leading-[1.2] lg:leading-[1.2] mix-blend-difference',
        )}
      >
        <div className='block md:hidden'>Rgb</div>
        <div className='block md:hidden'>{hexToRgb(brandColorHex).replace('rgb(', '').replace(')', '')}</div>
        <div className='hidden md:block whitespace-nowrap'>{brandColorName}</div>
        <div className='hidden md:block whitespace-nowrap'>{hexToRgb(brandColorHex)}</div>
      </div>

      <div className='absolute flex gap-3 bottom-20 left-1/2 transform -translate-x-1/2'>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className={classNames(
            'w-[150px] rounded-[100px] inline-flex justify-center items-center transition-all duration-200',
            'h-[44px] px-[36px]',
            isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#222222] hover:bg-[#333333]',
          )}
        >
          <div className='text-[18px] text-white font-medium'>{isGenerating ? 'Generating...' : 'Download'}</div>
        </button>
        <button
          disabled={isSharing}
          className={classNames(
            'w-[150px] rounded-[100px] inline-flex justify-center items-center transition-all duration-200',
            'h-[44px] px-[36px]',
            isSharing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#222222] hover:bg-[#333333]',
          )}
        >
          <div className='text-[18px] text-white font-medium'>{isSharing ? 'Sharing...' : 'Share'}</div>
        </button>
      </div>
    </div>
  )
}