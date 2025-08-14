'use client'
import { Header } from '@/components/projects'
import { Footer } from '@/components/movement/Footer_Movement'
import { Main } from '@/components/movement'
import { EditStep } from '@/components/movement/steps/EditEngStep'
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

      {/* Step Indicator */}
      {step === 'edit' ||
        (step === 'result' && (
          <div
            className={classNames(
              'absolute left-1/2 -translate-x-1/2 w-fit h-fit flex justify-center items-center z-0 pointer-events-none',
              'hidden md-landscape:block lg:block',
              'bottom-[17.41%]',
              'md:bottom-[15.32%]',
              'lg:bottom-[13.58%]',
              '2xl:bottom-[13.60%]',
            )}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={classNames(
                'aspect-[62/14] h-auto',
                'w-[clamp(32px,calc(39.529px-0.980392vw),36px)]', // 모바일→md 감소
                'lg:w-[clamp(40px,calc(11.714px+1.9642857vw),62px)]', // lg→2xl 증가
                '2xl:w-[62px]', // 2xl 이상 고정
              )}
              viewBox='0 0 62 14'
              fill='none'
            >
              <circle cx='7' cy='7' r='7' fill={'#222222'} />
              <circle cx='31' cy='7' r='7' fill={step === 'result' ? '#222222' : '#F2F2F2'} />
              <circle cx='55' cy='7' r='7' fill={'#F2F2F2'} />
            </svg>
          </div>
        ))}

      {step === 'edit' && currentImage && (
        <EditStep
          currentData={currentData}
          imageUrl={currentImage.url}
          imageFile={currentImage.file}
          onBack={handleBack}
          onComplete={handleEditComplete}
        />
      )}

      {step === 'result' && currentImage && data.text && data.colorAnalysis && (
        <ResultStep
          imageUrl={currentImage.url}
          text={data.text}
          colorAnalysis={data.colorAnalysis}
          onBack={handleBack}
          onStartOver={handleStartOver}
          onComplete={handleResultComplete}
        />
      )}

      {step === 'interact' && interactionData && (
        <InteractPage interactionData={interactionData} onStartOver={handleStartOver} />
      )}

      <Footer />
    </>
  )
}
