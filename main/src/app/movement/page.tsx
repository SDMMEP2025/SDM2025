'use client'
import { Header } from '@/components/projects'
import { Footer } from '@/components/movement/Footer_Movement'
import { Main } from '@/components/movement'
import { EditStep } from '@/components/movement/steps/EditStep'
import { ResultStep } from '@/components/movement/steps/ResultStep'
import { InteractPage } from '@/components/movement/steps/Interact'
import { useStepManager } from '@/hooks/useStepManager'
import { UploadedImage } from '@/types/movement'
import { ColorAnalysisResult } from '@/types/color'
import { useState } from 'react'

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
        <EditStep
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
