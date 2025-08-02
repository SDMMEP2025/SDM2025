// hooks/useStepManager.ts
import { useState, useCallback } from 'react'
import { MovementStep, MovementData } from '@/types/movement'

export function useStepManager() {
  const [step, setStep] = useState<MovementStep>('upload')
  const [data, setData] = useState<MovementData>({ step: 'upload' })

  const goToStep = useCallback((nextStep: MovementStep, newData?: Partial<MovementData>) => {
    setStep(nextStep)
    setData(prev => ({ ...prev, step: nextStep, ...newData }))
  }, [])

  const goBack = useCallback(() => {
    switch (step) {
      case 'edit':
        setStep('upload')
        setData(prev => ({ ...prev, step: 'upload' }))
        break
      case 'result':
        setStep('edit')
        setData(prev => ({ ...prev, step: 'edit' }))
        break
      case 'interact' : 
        setStep('result')
        setData(prev => ({ ...prev, step: 'result' }))
        break
    }
  }, [step])

  const reset = useCallback(() => {
    setStep('upload')
    setData({ step: 'upload' })
  }, [])

  return {
    step,
    data,
    goToStep,
    goBack,
    reset
  }
}