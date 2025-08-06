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
  const [isDragging, setIsDragging] = useState(false)

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
    description,
  }: {
    label: string
    settingKey: keyof MotionSettings
    min: number
    max: number
    step: number
    description?: string
  }) => (
    <div className='mb-4'>
      <div className='flex justify-between items-center mb-2'>
        <label className='text-sm font-medium text-gray-700'>{label}</label>
        <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded'>
          {settings[settingKey].toFixed(step < 1 ? 2 : 0)}
        </span>
      </div>
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={settings[settingKey]}
        onChange={(e) => handleSliderChange(settingKey, parseFloat(e.target.value))}
        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider'
      />
      {description && <p className='text-xs text-gray-500 mt-1'>{description}</p>}
    </div>
  )

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed top-0 right-4 z-[9999] bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors'
        style={{ fontSize: '18px' }}
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
              className='fixed inset-0 bg-black bg-opacity-20 z-[9998]'
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[9999] overflow-y-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='p-6'>
                {/* Header */}
                <div className='flex justify-between items-center mb-6 pb-4 border-b'>
                  <h2 className='text-xl font-bold text-gray-800'>Motion Controls</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className='text-gray-500 hover:text-gray-700 text-2xl'
                  >
                    ×
                  </button>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetToDefaults}
                  className='w-full mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors'
                >
                  Reset to Defaults
                </button>

                {/* Controls Categories */}
                <div className='space-y-6'>
                  {/* Basic Physics */}
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Basic Physics</h3>
                    <SliderControl
                      label='Dead Zone'
                      settingKey='deadZone'
                      min={0}
                      max={2}
                      step={0.1}
                      description='Minimum tilt before movement starts'
                    />
                    <SliderControl
                      label='Smoothing'
                      settingKey='smoothing'
                      min={0}
                      max={1}
                      step={0.05}
                      description='How smooth the tilt response is'
                    />
                    <SliderControl
                      label='Position Smoothing'
                      settingKey='positionSmoothing'
                      min={0}
                      max={1}
                      step={0.05}
                      description='How smooth the position changes are'
                    />
                  </div>

                  {/* Acceleration */}
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Acceleration</h3>
                    <SliderControl
                      label='Acceleration Power'
                      settingKey='accelerationPower'
                      min={1}
                      max={3}
                      step={0.1}
                      description='How aggressive the acceleration curve is'
                    />
                    <SliderControl
                      label='Acceleration Multiplier'
                      settingKey='accelerationMultiplier'
                      min={0.001}
                      max={0.1}
                      step={0.001}
                      description='Overall movement speed multiplier'
                    />
                  </div>

                  {/* Visual Effects */}
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Visual Effects</h3>
                    <SliderControl
                      label='Tilt Rotation'
                      settingKey='tiltRotationMultiplier'
                      min={0}
                      max={5}
                      step={0.1}
                      description='How much the squares rotate with tilt'
                    />
                    <SliderControl
                      label='Base Gap'
                      settingKey='baseGap'
                      min={0}
                      max={1}
                      step={0.05}
                      description='Initial gap between layers'
                    />
                    <SliderControl
                      label='Spring Gap'
                      settingKey='springGapMultiplier'
                      min={0}
                      max={0.5}
                      step={0.01}
                      description='How much layers separate when tilting'
                    />
                  </div>

                  {/* Layer Movement */}
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Layer Movement</h3>
                    <SliderControl
                      label='Layer Movement'
                      settingKey='layerMovementMultiplier'
                      min={0}
                      max={0.2}
                      step={0.01}
                      description='How much each layer moves differently'
                    />
                    <SliderControl
                      label='Offset X'
                      settingKey='offsetXMultiplier'
                      min={0}
                      max={3}
                      step={0.1}
                      description='Horizontal offset strength'
                    />
                    <SliderControl
                      label='Offset Y'
                      settingKey='offsetYMultiplier'
                      min={0}
                      max={3}
                      step={0.1}
                      description='Vertical offset strength'
                    />
                  </div>
                </div>

                {/* Current Values Display */}
                <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
                  <h4 className='font-semibold text-gray-800 mb-2'>Current Settings</h4>
                  <div className='text-xs text-gray-600 space-y-1'>
                    <div className='grid grid-cols-2 gap-2'>
                      {Object.entries(settings).map(([key, value]) => (
                        <div key={key} className='flex justify-between'>
                          <span>{key}:</span>
                          <span>{typeof value === 'number' ? value.toFixed(3) : value}</span>
                        </div>
                      ))}
                    </div>
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
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #222222;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #222222;
          cursor: pointer;
          border: none;
        }

        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: #e5e7eb;
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: #e5e7eb;
          border: none;
        }
      `}</style>
    </>
  )
}