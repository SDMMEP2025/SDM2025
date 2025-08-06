'use client'
import { useState, useEffect } from 'react'
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

export default function MotionControlPanel({ settings, onSettingsChange }: MotionControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

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
  }) => (
    <div className='flex items-center gap-3 mb-3'>
      <div className='w-20 text-xs text-gray-700 flex-shrink-0'>{label}</div>
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={settings[settingKey]}
        onChange={(e) => handleSliderChange(settingKey, parseFloat(e.target.value))}
        className='flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider'
      />
      <div className='w-12 text-xs text-gray-500 text-right flex-shrink-0'>
        {settings[settingKey].toFixed(step < 1 ? 2 : 0)}
      </div>
    </div>
  )

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-20 right-4 bg-black text-white w-12 h-12 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center text-lg'
        style={{ zIndex: 10000 }}
      >
        ⚙️
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
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed right-0 top-0 h-full w-72 bg-white shadow-2xl overflow-y-auto'
              style={{ zIndex: 10002 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='p-4'>
                {/* Header */}
                <div className='flex justify-between items-center mb-4 pb-3 border-b'>
                  <h2 className='text-lg font-bold text-gray-800'>모션 설정</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className='text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center'
                  >
                    ✕
                  </button>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetToDefaults}
                  className='w-full mb-4 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm'
                >
                  기본값으로 리셋
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #222222;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #222222;
          cursor: pointer;
          border: none;
        }

        .slider::-webkit-slider-track {
          height: 4px;
          border-radius: 2px;
          background: #e5e7eb;
        }

        .slider::-moz-range-track {
          height: 4px;
          border-radius: 2px;
          background: #e5e7eb;
          border: none;
        }
      `}</style>
    </>
  )
}