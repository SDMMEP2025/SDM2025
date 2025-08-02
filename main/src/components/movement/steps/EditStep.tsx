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
        // 환경변수로 AI 분석 제어
        const isAiDisabled = process.env.NEXT_PUBLIC_DISABLE_AI === 'true'

        if (isAiDisabled) {
          console.log('🛑 AI Analysis disabled for development')
          setText('이 순간에 대해 말해주세요...')
        } else {
          // AI 텍스트 분석 실행
          const aiText = await analyzeImage(imageFile)
          setText(aiText)
        }

        // 색상 분석은 항상 실행 (로컬이라 무료)
        const colors = await analyzeImageColors(imageUrl)
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
    <div className='w-full h-full flex flex-col justify-center items-center z-10 bg-white'>
      <div className='w-full px-4'>
        {/* 뒤로가기 버튼 */}
        {/* <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          다시 선택하기
        </button> */}

        {/* 이미지 */}
        {/* <div className="mb-6">
          <img
            src={imageUrl}
            alt="업로드된 이미지"
            className="w-full rounded-lg max-h-96 object-cover"
          />
        </div> */}

        {/* 분석 상태 및 색상 미리보기 */}
        <div className='mb-0'>
          {/* 로딩 상태 */}
          {/* {isAnalyzing && (
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
              {isAnalyzingText && isAnalyzingColor ? 'AI 분석 및 색상 추출 중...' :
               isAnalyzingText ? 'AI가 텍스트를 생성하고 있습니다...' :
               '이미지에서 색상을 추출하고 있습니다...'}
            </div>
          )} */}

          {/* 에러 상태 */}
          {hasError && <div className='text-red-400 text-sm'>{textError || colorError}</div>}
        </div>

        <div className='flex flex-col justify-between items-center gap-[11.8dvh]'>
          <div className='flex flex-col justify-center items-center gap-[3.68dvh]'>
            <div className='left-1/2 transform '>
              <svg xmlns='http://www.w3.org/2000/svg' width='32' height='9' viewBox='0 0 32 9' fill='none'>
                <circle cx='4' cy='4.5' r='4' fill='#222222' />
                <circle cx='15.7344' cy='4.5' r='4' fill='#E8E8E8' />
                <circle cx='27.4688' cy='4.5' r='4' fill='#E8E8E8' />
              </svg>
            </div>

            {/* 타이틀 */}
            <div className='flex flex-col justify-center items-center gap-[2.13dvh]'>
              <h2
                className={classNames(
                  'text-center text-[#222222] font-semibold font-english',
                  'text-[24px] md:text-[28px] lg:text-[32px]',
                )}
              >
                Tell Us Your Movement
              </h2>
              <p className={classNames('text-center text-[#4B4F57] mt-2', 'text-[16px] md:text-[17px] lg:text-[18px]')}>
                업로드한 이미지에는 어떤 순간이 담겨 있나요?
              </p>
            </div>
          </div>

          <div className='flex flex-col justify-center items-center gap-[14.54dvh]'>
            <div className='relative'>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={isAnalyzing ? 'AI 분석 중...' : '나를 움직이게 하는 이 순간에 대해 적어보세요...'}
                className='w-[983px] py-[77px] bg-[#F6F6F6] text-center rounded-lg text-[#AEB1B6] text-[42px] placeholder-gray-400 focus:text-[#222222] focus:outline-none resize-none'
                maxLength={200}
                disabled={isAnalyzing}
                rows={1}
              />
              <div className='absolute right-[14px] bottom-[14px] flex justify-between text-xs text-[#AEB1B6]'>
                <span>{text.length}/22</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || !colorAnalysis || isAnalyzing}
              className={classNames(
                'w-[150px] rounded-[100px] inline-flex justify-center items-center transition-all duration-200',
                'h-[44px] px-[36px]',
                text.trim() && colorAnalysis && !isAnalyzing
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  : 'bg-neutral-600 text-gray-400 cursor-not-allowed',
              )}
            >
              <div className='text-[18px] font-medium'>Next</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
