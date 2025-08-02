// components/movement/steps/EditStep.tsx
'use client'

import { useState, useEffect } from 'react'
import classNames from 'classnames'
import { useImageAnalysis } from '@/hooks/useImageAnalysis'
import { useColorAnalysis } from '@/hooks/useColorAnalysis'
import { ColorAnalysisResult } from '@/types/color'

interface EditStepProps {
  imageUrl: string
  imageFile: File
  onBack: () => void
  onComplete: (text: string, colorAnalysis: ColorAnalysisResult) => void
}

export function EditStep({ imageUrl, imageFile, onBack, onComplete }: EditStepProps) {
  const [text, setText] = useState('')
  const [colorAnalysis, setColorAnalysis] = useState<ColorAnalysisResult | null>(null)
  
  const { analyzeImage, isAnalyzing: isAnalyzingText, error: textError } = useImageAnalysis()
  const { analyzeImageColors, isAnalyzing: isAnalyzingColor, error: colorError } = useColorAnalysis()

  // 컴포넌트 마운트 시 AI 텍스트 분석 + 색상 분석 동시 실행
  useEffect(() => {
    const runAnalysis = async () => {
      try {
        // AI 텍스트 분석과 색상 분석을 병렬로 실행
        const [aiText, colors] = await Promise.all([
          analyzeImage(imageFile),
          analyzeImageColors(imageUrl)
        ])
        
        setText(aiText)
        setColorAnalysis(colors)
      } catch (err) {
        console.error('Analysis failed:', err)
      }
    }

    runAnalysis()
  }, [imageFile, imageUrl, analyzeImage, analyzeImageColors])

  const handleSubmit = () => {
    if (text.trim() && colorAnalysis) {
      onComplete(text, colorAnalysis)
    }
  }

  const isAnalyzing = isAnalyzingText || isAnalyzingColor
  const hasError = textError || colorError

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center z-10 bg-black">
      <div className="w-full max-w-2xl mx-auto px-4">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          다시 선택하기
        </button>

        {/* 이미지 */}
        <div className="mb-6">
          <img
            src={imageUrl}
            alt="업로드된 이미지"
            className="w-full rounded-lg max-h-96 object-cover"
          />
        </div>

        {/* 분석 상태 및 색상 미리보기 */}
        <div className="mb-6 space-y-4">
          {/* 로딩 상태 */}
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
              {isAnalyzingText && isAnalyzingColor ? 'AI 분석 및 색상 추출 중...' :
               isAnalyzingText ? 'AI가 텍스트를 생성하고 있습니다...' :
               '이미지에서 색상을 추출하고 있습니다...'}
            </div>
          )}
          
          {/* 에러 상태 */}
          {hasError && (
            <div className="text-red-400 text-sm">
              {textError || colorError}
            </div>
          )}
          
          {/* 색상 분석 결과 미리보기 */}
          {colorAnalysis && (
            <div className="bg-neutral-800 rounded-lg p-4">
              <div className="text-white text-sm font-medium mb-3">추출된 색상</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: colorAnalysis.extractedHex }}
                  ></div>
                  <span className="text-xs text-gray-400">원본</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: colorAnalysis.refinedColor.hex }}
                  ></div>
                  <span className="text-xs text-white">{colorAnalysis.refinedColor.name}</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: colorAnalysis.brandColor.hex }}
                  ></div>
                  <span className="text-xs text-white font-medium">{colorAnalysis.brandColor.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 타이틀 */}
        <div className="mb-4">
          <h2 className={classNames(
            'text-center text-white font-semibold font-english',
            'text-[24px] md:text-[28px] lg:text-[32px]'
          )}>
            What's Your Movement?
          </h2>
          <p className={classNames(
            'text-center text-gray-300 mt-2',
            'text-[16px] md:text-[17px] lg:text-[18px]'
          )}>
            이 순간에 대해 말해주세요
          </p>
        </div>

        {/* 텍스트 입력 */}
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isAnalyzing ? "AI 분석 중..." : "나를 움직이게 하는 이 순간에 대해 적어보세요..."}
            className="w-full h-32 p-4 bg-neutral-800 rounded-lg text-white placeholder-gray-400 border border-neutral-700 focus:border-white focus:outline-none resize-none"
            maxLength={200}
            disabled={isAnalyzing}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {isAnalyzing && "💡 AI가 제안한 텍스트는 자유롭게 수정할 수 있습니다"}
            </span>
            <span>{text.length}/200</span>
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={!text.trim() || !colorAnalysis || isAnalyzing}
            className={classNames(
              'w-full rounded-[100px] inline-flex justify-center items-center transition-all duration-200',
              'h-[44px] px-[36px]',
              (text.trim() && colorAnalysis && !isAnalyzing)
                ? 'bg-neutral-800 hover:bg-neutral-700 text-white' 
                : 'bg-neutral-600 text-gray-400 cursor-not-allowed'
            )}
          >
            <div className="text-[18px] font-medium">
              완료
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}