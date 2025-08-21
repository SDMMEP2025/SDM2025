'use client'
import { Header, MediaContainer } from '@/components/projects'
import { Footer } from '@/components/movement/Footer_Movement'
import { Main } from '@/components/movement'
import { EditStep } from '@/components/movement/steps/EditStep'
import { ResultStep } from '@/components/movement/steps/ResultStep'
import { InteractPage } from '@/components/movement/steps/Interact'
import { useStepManager } from '@/hooks/useStepManager'
import { UploadedImage } from '@/types/movement'
import { ColorAnalysisResult } from '@/types/color'
import { useState } from 'react'
import classNames from 'classnames'

// 인터랙션 데이터 타입 정의
interface InteractionData {
  steps: number
  positions: Array<{ x: number; y: number }>
  brandColorName: string
  brandColorHex: string
  refinedColorName: string
  refinedColorHex: string
  text: string
}

export default function Page() {
  const { step, data, goToStep, goBack, reset } = useStepManager()
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null)
  const [currentData, setCurrentData] = useState<{
    initialize: boolean
    text: string | null
    colorAnalysis: ColorAnalysisResult | null
  }>({
    initialize: false,
    text: null,
    colorAnalysis: null,
  })

  const [interactionData, setInteractionData] = useState<InteractionData | null>(null)

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    // 첫 번째 파일만 처리
    const file = files[0]
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      const imageData: UploadedImage = {
        file,
        url,
        id: Date.now().toString(),
      }

      setCurrentImage(imageData)
      goToStep('edit', { currentImage: imageData })
    } else {
      alert('이미지 파일만 업로드 가능합니다.')
    }
  }

  const handleEditComplete = (text: string, colorAnalysis: ColorAnalysisResult) => {
    setCurrentData({
      initialize: true,
      text,
      colorAnalysis,
    })
    goToStep('result', { text, colorAnalysis })
  }

  const handleResultComplete = (data: InteractionData) => {
    setInteractionData(data)
    goToStep('interact')
  }

  const handleBack = () => {
    if (step === 'edit' && currentImage) {
      URL.revokeObjectURL(currentImage.url)
      setCurrentImage(null)
      setCurrentData({
        initialize: false,
        text: null,
        colorAnalysis: null,
      })
    } else if (step === 'result') {
      // 결과 단계에서 뒤로 가기 시 인터랙션 데이터 초기화
      setInteractionData(null)
    }
    goBack()
  }

  const handleStartOver = () => {
    if (currentImage) {
      URL.revokeObjectURL(currentImage.url)
      setCurrentImage(null)
    }
    setInteractionData(null)
    reset()
  }

  return (
    <>
      <Header />

      {/* 단계별 화면 렌더링 */}
      {step === 'upload' && <Main onUpload={handleFileUpload} />}

      {step === 'edit' && currentImage && (
        <>
          <div className='absolute h-full lg:w-full overflow-hidden'>
            <MediaContainer
              type='video'
              src='https://player.vimeo.com/video/1110238461?h=402fd700bc'
              preloadDelayMs={0}
              loop
              className='h-full lg:w-full lg:h-auto object-cover'
            />
          </div>
          <EditStep
            currentData={currentData}
            imageUrl={currentImage.url}
            imageFile={currentImage.file}
            onBack={handleBack}
            onComplete={handleEditComplete}
          />
        </>
      )}

      {step === 'result' && currentImage && data.text && data.colorAnalysis && (
        <>
          <div className='absolute h-full lg:w-full overflow-hidden'>
            <MediaContainer
              type='video'
              src='https://player.vimeo.com/video/1110238461?h=402fd700bc'
              preloadDelayMs={0}
              loop
              className='h-full lg:w-full lg:h-auto object-cover'
            />
          </div>
          <ResultStep
            imageUrl={currentImage.url}
            text={data.text}
            colorAnalysis={data.colorAnalysis}
            onBack={handleBack}
            onStartOver={handleStartOver}
            onComplete={handleResultComplete}
          />
        </>
      )}

      {step === 'interact' && interactionData && (
        <InteractPage interactionData={interactionData} onStartOver={handleStartOver} />
      )}

      <Footer />
    </>
  )
}
