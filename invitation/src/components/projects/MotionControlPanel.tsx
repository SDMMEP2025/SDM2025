'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface MotionSettings {
  deadZone: number
  smoothing: number
  positionSmoothing: number
  accelerationPower: number
  accelerationMultiplier: number
  tiltRotationMultiplier: number
  baseGap: number
  springGapMultiplier: number
  layerMovementMultiplier: number
  offsetXMultiplier: number
  offsetYMultiplier: number
}

interface MotionControlPanelProps {
  settings: MotionSettings
  onSettingsChange: (newSettings: MotionSettings) => void
  onToggle?: (isOpen: boolean) => void
}

const defaultSettings: MotionSettings = {
  deadZone: 0.5,
  smoothing: 0.8,
  positionSmoothing: 0.85,
  accelerationPower: 1.5,
  accelerationMultiplier: 0.03,
  tiltRotationMultiplier: 1.5,
  baseGap: 0.0,
  springGapMultiplier: 0.15,
  layerMovementMultiplier: 0.08,
  offsetXMultiplier: 1.2,
  offsetYMultiplier: 0.8,
}

export default function MotionControlPanel({ settings, onSettingsChange, onToggle }: MotionControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const togglePanel = (open: boolean) => {
    setIsOpen(open)
    onToggle?.(open)
  }

  const generateSettingsCode = () => {
    return `const motionSettings = {
  deadZone: ${settings.deadZone},
  smoothing: ${settings.smoothing},
  positionSmoothing: ${settings.positionSmoothing},
  accelerationPower: ${settings.accelerationPower},
  accelerationMultiplier: ${settings.accelerationMultiplier},
  tiltRotationMultiplier: ${settings.tiltRotationMultiplier},
  baseGap: ${settings.baseGap},
  springGapMultiplier: ${settings.springGapMultiplier},
  layerMovementMultiplier: ${settings.layerMovementMultiplier},
  offsetXMultiplier: ${settings.offsetXMultiplier},
  offsetYMultiplier: ${settings.offsetYMultiplier},
}`
  }

  const handleCopyCode = async () => {
    const code = generateSettingsCode()
    
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
      } catch (err) {
        console.error('Clipboard API 실패:', err)
      }
    }

    // 폴백: 임시 textarea 사용
    const textArea = document.createElement('textarea')
    textArea.value = code
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (fallbackErr) {
      console.error('폴백 복사도 실패:', fallbackErr)
    }

    document.body.removeChild(textArea)
  }

  const handleSliderChange = (key: keyof MotionSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    })
  }

  const resetToDefaults = () => {
    onSettingsChange(defaultSettings)
  }

  const SliderControl = ({
    label,
    settingKey,
    min,
    max,
    step,
  }: {
    label: string
    settingKey: keyof MotionSettings
    min: number
    max: number
    step: number
  }) => {
    const [isDragging, setIsDragging] = useState(false)
    const sliderRef = useRef<HTMLDivElement>(null)

    const calculateValue = (clientX: number) => {
      if (!sliderRef.current) return settings[settingKey]
      
      const rect = sliderRef.current.getBoundingClientRect()
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const rawValue = min + percentage * (max - min)
      return Math.round(rawValue / step) * step
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true)
      const newValue = calculateValue(e.clientX)
      handleSliderChange(settingKey, newValue)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return
      const newValue = calculateValue(e.clientX)
      handleSliderChange(settingKey, newValue)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchStart = (e: React.TouchEvent) => {
      e.stopPropagation()
      setIsDragging(true)
      const touch = e.touches[0]
      const newValue = calculateValue(touch.clientX)
      handleSliderChange(settingKey, newValue)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return
      e.stopPropagation()
      const touch = e.touches[0]
      const newValue = calculateValue(touch.clientX)
      handleSliderChange(settingKey, newValue)
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
      e.stopPropagation()
      setIsDragging(false)
    }

    // 전역 이벤트 리스너 추가
    useEffect(() => {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!isDragging) return
        const newValue = calculateValue(e.clientX)
        handleSliderChange(settingKey, newValue)
      }

      const handleGlobalMouseUp = () => {
        setIsDragging(false)
      }

      const handleGlobalTouchMove = (e: TouchEvent) => {
        if (!isDragging) return
        e.preventDefault()
        const touch = e.touches[0]
        const newValue = calculateValue(touch.clientX)
        handleSliderChange(settingKey, newValue)
      }

      const handleGlobalTouchEnd = () => {
        setIsDragging(false)
      }

      if (isDragging) {
        document.addEventListener('mousemove', handleGlobalMouseMove)
        document.addEventListener('mouseup', handleGlobalMouseUp)
        document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
        document.addEventListener('touchend', handleGlobalTouchEnd)
      }

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
        document.removeEventListener('touchmove', handleGlobalTouchMove)
        document.removeEventListener('touchend', handleGlobalTouchEnd)
      }
    }, [isDragging, settingKey, min, max, step])

    const percentage = ((settings[settingKey] - min) / (max - min)) * 100

    return (
      <div className='mb-4'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='w-20 text-xs text-gray-700 flex-shrink-0'>{label}</div>
          <div className='w-12 text-xs text-gray-500 text-right flex-shrink-0'>
            {settings[settingKey].toFixed(step < 1 ? 2 : 0)}
          </div>
        </div>
        <div
          ref={sliderRef}
          className='relative h-10 flex items-center cursor-pointer select-none'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 슬라이더 트랙 */}
          <div className='w-full h-2 bg-gray-200 rounded-full relative'>
            {/* 활성 부분 */}
            <div
              className='h-full bg-gray-800 rounded-full'
              style={{ width: `${percentage}%` }}
            />
            {/* 썸 */}
            <div
              className='absolute w-5 h-5 bg-gray-800 rounded-full transform -translate-y-1/2 -translate-x-1/2 top-1/2 shadow-md'
              style={{ 
                left: `${percentage}%`,
                touchAction: 'none'
              }}
            />
          </div>
        </div>
      </div>
    )
  }



  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => togglePanel(!isOpen)}
        className='fixed top-0 right-4 bg-black text-white w-12 h-12 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center text-lg'
        style={{ zIndex: 10000 }}
      >
     모션 패널
      </button>

      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black bg-opacity-30'
              style={{ zIndex: 10001 }}
              onClick={() => togglePanel(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed right-0 top-0 h-full w-72 bg-white shadow-2xl overflow-y-auto touch-auto'
              style={{ 
                zIndex: 10002,
                touchAction: 'pan-y'
              }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <div className='p-4'>
                {/* Header */}
                <div className='flex justify-between items-center mb-4 pb-3 border-b'>
                  <h2 className='text-lg font-bold text-gray-800'>모션 설정</h2>
                  <button
                    onClick={() => togglePanel(false)}
                    className='text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center'
                  >
                    ✕
                  </button>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetToDefaults}
                  className='w-full mb-3 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm'
                >
                  기본값으로 리셋
                </button>

                {/* Copy Code Button */}
                <button
                  onClick={handleCopyCode}
                  className='w-full mb-4 px-3 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors text-sm flex items-center justify-center gap-2 relative'
                >
                  <span>📋</span>
                  <span>코드 복사</span>
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className='absolute right-2 text-green-400'
                    >
                      ✓
                    </motion.span>
                  )}
                </button>

                {/* Controls */}
                <div className='space-y-4'>
                  {/* 기본 설정 */}
                  <div>
                    <h3 className='text-sm font-semibold text-gray-800 mb-3'>기본 설정</h3>
                    <SliderControl
                      label='감지 최소값'
                      settingKey='deadZone'
                      min={0}
                      max={2}
                      step={0.1}
                    />
                    <SliderControl
                      label='부드러움'
                      settingKey='smoothing'
                      min={0}
                      max={1}
                      step={0.05}
                    />
                    <SliderControl
                      label='위치 부드러움'
                      settingKey='positionSmoothing'
                      min={0}
                      max={1}
                      step={0.05}
                    />
                  </div>

                  {/* 움직임 */}
                  <div>
                    <h3 className='text-sm font-semibold text-gray-800 mb-3'>움직임</h3>
                    <SliderControl
                      label='가속도 강도'
                      settingKey='accelerationPower'
                      min={1}
                      max={3}
                      step={0.1}
                    />
                    <SliderControl
                      label='움직임 속도'
                      settingKey='accelerationMultiplier'
                      min={0.001}
                      max={0.1}
                      step={0.001}
                    />
                  </div>

                  {/* 시각 효과 */}
                  <div>
                    <h3 className='text-sm font-semibold text-gray-800 mb-3'>시각 효과</h3>
                    <SliderControl
                      label='회전 정도'
                      settingKey='tiltRotationMultiplier'
                      min={0}
                      max={5}
                      step={0.1}
                    />
                    <SliderControl
                      label='레이어 간격'
                      settingKey='springGapMultiplier'
                      min={0}
                      max={0.5}
                      step={0.01}
                    />
                    <SliderControl
                      label='레이어 차이'
                      settingKey='layerMovementMultiplier'
                      min={0}
                      max={0.2}
                      step={0.01}
                    />
                    <SliderControl
                      label='가로 오프셋'
                      settingKey='offsetXMultiplier'
                      min={0}
                      max={3}
                      step={0.1}
                    />
                    <SliderControl
                      label='세로 오프셋'
                      settingKey='offsetYMultiplier'
                      min={0}
                      max={3}
                      step={0.1}
                    />
                  </div>
                </div>

                {/* 현재 설정 미리보기 */}
                <div className='mt-6 p-3 bg-gray-50 rounded-md'>
                  <h4 className='text-sm font-semibold text-gray-800 mb-2'>현재 설정</h4>
                  <pre className='text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap'>
                    {generateSettingsCode()}
                  </pre>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        /* 스타일은 이제 커스텀 슬라이더에서 인라인으로 처리 */
      `}</style>
    </>
  )
}