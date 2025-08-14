// components/movement/steps/EditStep.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { useImageAnalysis } from '@/hooks/useImageAnalysis'
import { useColorAnalysis } from '@/hooks/useColorAnalysis'
import { ColorAnalysisResult } from '@/types/color'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import animationData from '@/animation/edit_loading.json'
import { AnimatePresence, motion } from 'framer-motion'

interface EditStepProps {
  currentData: {
    initialize: boolean
    text: string | null
    colorAnalysis: ColorAnalysisResult | null
  }
  imageUrl: string
  imageFile: File
  onBack: () => void
  onComplete: (text: string, colorAnalysis: ColorAnalysisResult) => void
}

export function EditStep({ currentData, imageUrl, imageFile, onBack, onComplete }: EditStepProps) {
  const [text, setText] = useState('')
  const [colorAnalysis, setColorAnalysis] = useState<ColorAnalysisResult | null>(null)

  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const { analyzeImage, isAnalyzing: isAnalyzingText, error: textError } = useImageAnalysis()
  const { analyzeImageColors, isAnalyzing: isAnalyzingColor, error: colorError } = useColorAnalysis()

  const [isActive, setIsActive] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<boolean>(false)

  // 컴포넌트 마운트 시 AI 텍스트 분석 + 색상 분석 동시 실행
  useEffect(() => {
    if (currentData.initialize) {
      setText(currentData.text || '')
      setColorAnalysis(currentData.colorAnalysis || null)
    } else {
      const runAnalysis = async () => {
        try {
          // 환경변수로 AI 분석 제어
          const isAiDisabled = process.env.NEXT_PUBLIC_DISABLE_AI === 'false'

          if (isAiDisabled) {
            console.log('🛑 AI Analysis disabled for development')
            setText('이 순간에 대해 말해주세요...')
          } else {
            // AI 텍스트 분석 실행
            const aiText = await analyzeImage(imageFile, 'en')

            // aiText가 ERROR라는 단어가 있다면
            if (aiText.includes('ERROR')) {
              setAnalyzeError(true)
              setText('이 순간에 대해 말해주세요...')
            } else {
              setText(aiText)
            }
          }

          // 색상 분석은 항상 실행 (로컬이라 무료)
          const colors = await analyzeImageColors(imageUrl)
          setColorAnalysis(colors)
        } catch (err) {
          console.error('Analysis failed:', err)
        }
      }
      runAnalysis()
    }
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
      <div className='absolute top-20 left-1/2 -translate-x-1/2'>
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
        {/* {hasError && <div className='text-red-400 text-sm'>{textError || colorError}</div>} */}
      </div>

      {/* 에러 및 글자수 초과 모달 */}
      <AnimatePresence>
        {analyzeError ||
          (hasError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-20'
            >
              <div className='bg-white gap-6 md:gap-12 w-[320px] md:w-[480px] md:max-w-none text-center flex flex-col justify-center items-center p-8 md:p-12'>
                <p className={classNames('font-semibold mb-4', 'text-xl md:text-xl lg:text-2xl')}>
                  이미지를 분석에 실패했습니다. <br />
                  다시 시도해 주세요.
                </p>

                <button
                  onClick={() => {
                    onBack()
                    setAnalyzeError(false)
                  }}
                  className={classNames(
                    'bg-black text-white rounded-full flex justify-center items-center transition-all duration-200 md:hover:bg-neutral-700',
                    // mobile
                    'h-[46px]',
                    'w-[150px]',
                    // tablet
                    'md:h-[56px]',
                    'md:w-[160px]',
                    // desktop
                    'lg:h-[56px]',
                    'lg:w-[200px]',
                    // large desktop
                    '2xl:w-[200px]',
                    '2xl:h-[56px]',
                    'cursor-pointer',
                  )}
                >
                  <div
                    className={classNames(
                      'text-white font-medium',
                      // 모바일
                      'text-[18px]',
                      // tablet
                      'md:text-[20px]',
                      // desktop
                      'lg:text-[22px]',
                      // large desktop
                      '2xl:text-[24px]',
                    )}
                  >
                    다시 시작하기
                  </div>
                </button>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* 타이틀 */}
      <div
        className={classNames(
          'absolute flex flex-col justify-center items-center inset-x-0 w-full',
          //mobile
          'top-[16.66%]',
          'gap-[102px]', // 모바일
          //tablet
          'md-landscape:top-[34.9%]',
          'md:top-[27.01%]',
          'md:gap-[42px]', // md
          'md-landscape:gap-[66px]', // md-landscape 조건
          //desktop
          'lg:top-[28.64%]',
          'lg:gap-[clamp(54px,calc(-11.428px+4.55357vw),105px)]', // lg~2xl fluid
          // large desktop
          '2xl:top-[28.58%]',
          '2xl:gap-[105px]', // 2xl 이상
        )}
      >
        <div
          className={classNames(
            'flex flex-col justify-center items-center w-full',
            //mobile
            'gap-[10px]', // 모바일
            //tablet
            'md:gap-[10px]',
            //desktop
            'lg:gap-[10px]',
            // large desktop
            '2xl:gap-[17px]', // 2xl 이상 고정
          )}
        >
          <motion.div
            initial={{ opacity: 0.2 }}
            animate={{ opacity: isAnalyzing ? 0.2 : 1 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
            className={classNames(
              'text-center text-[#FF60B9] font-medium font-english',
              // 모바일
              'text-[17px] leading-[100%] letterSpacing-[-0.34px]',
              // tablet
              'md:text-[clamp(17px,calc(16.118px+0.2451vw),18px)] md:leading-[130%] md:letterSpacing-[-0.36px]',
              // desktop
              'lg:text-[clamp(20px,calc(-0.571px+1.42857vw),36px)] lg:leading-[130%] lg:letterSpacing-[-0.4px]',
              // large desktop
              '2xl:text-[36px] 2xl:leading-[130%] 2xl:letterSpacing-[-0.72px]',
            )}
          >
            Tell Us Your Movement
          </motion.div>
          <motion.div
            initial={{ opacity: 0.2 }}
            animate={{ opacity: isAnalyzing ? 0.2 : 1 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
            className={classNames(
              'text-center text-[#FFF] font-bold mix-blend-difference',
              // 모바일
              'text-[30px] leading-[140%] letterSpacing-[-0.6px]',
              // tablet
              'md:text-[clamp(30px,calc(28.235px+0.4902vw),32px)] md:leading-[140%] md:letterSpacing-[-0.64px]',
              // desktop
              'lg:text-[clamp(36px,calc(0px+2.5vw),64px)] lg:leading-[140%] lg:letterSpacing-[-0.72px]',
              // large desktop
              '2xl:text-[64px] 2xl:leading-[140%] 2xl:letterSpacing-[-1.28px]',
            )}
          >
            이미지에는 어떤 순간이 <br className='inline md:hidden' />
            담겨 있나요?
          </motion.div>
        </div>

        {/* textarea */}
        <div
          className={classNames(
            'relative flex justify-center items-center',
            'bg-white rounded-[8px]',
            // 모바일
            'w-[358px] max-w-[320px] md:max-w-none h-[70px]',
            // tablet
            'md:w-[clamp(736px,calc(452.571px+36.9048vw),984px)]',
            'md:h-[clamp(112px,calc(96px+2.08333vw),126px)]',
            // desktop
            'lg:w-[clamp(984px,calc(37.714px+65.7143vw),1720px)]',
            'lg:h-[clamp(126px,calc(25.7143px+6.96429vw),204px)]',
            // large desktop
            '2xl:w-[1720px]',
            '2xl:h-[204px]',
          )}
        >
          {/* GPT 로딩  */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnalyzing ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={classNames('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', '')}
              >
                <div className={classNames('w-[100px] h-[10px]', 'md:w-[200px] md:h-[20px]', 'bg-black')}>
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    className='w-full h-full'
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.textarea
            initial={{ opacity: 0 }}
            animate={{ opacity: isAnalyzing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            value={
              //text에 온점 제거
              text.replace(/(\.|,|!|\?)/g, '').trim()
            }
            onFocus={() => {
              !isActive && setIsActive(true)
            }}
            onChange={(e) => setText(e.target.value)}
            placeholder={'나를 움직이게 하는 이 순간에 대해 적어보세요...'}
            className={classNames(
              isActive ? (text.length >= 22 ? 'text-[#FF60B9]' : 'text-[#222222]') : 'text-[#AEB1B6]',
              'w-full h-auto text-center bg-transparent  font-medium',
              'placeholder-gray-400 focus:outline-none resize-none',
              // 모바일
              'text-[18px] leading-[150%] letterSpacing-[-0.36px]',
              // tablet
              'md:text-[clamp(18px,calc(5.647px+3.43137vw),32px)] md:leading-[150%] md:letterSpacing-[-0.64px]',
              // desktop
              'lg:text-[clamp(32px,calc(1.1429px+2.14286vw),56px)] lg:leading-[150%] lg:letterSpacing-[-0.64px]',
              // large desktop
              '2xl:text-[56px] 2xl:leading-[150%] 2xl:letterSpacing-[-1.12px]',
            )}
            maxLength={22}
            disabled={isAnalyzing}
            rows={1}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isAnalyzing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={classNames(
              'absolute right-0 md:right-[14px] bottom-[-30px] md:bottom-[14px] flex justify-between text-[#AEB1B6] font-medium',
              // 모바일
              'text-[15px]',
              // tablet
              'text-[15px]',
              // desktop
              'lg:text-[clamp(15px,calc(0.85714px+0.982143vw),26px)]',
              // large desktop
              '2xl:text-[26px]',
            )}
          >
            <span>{text.length}/22</span>
          </motion.div>
        </div>
      </div>

      {/* button */}
      <div
        className={classNames(
          'absolute flex justify-center items-center',
          'right-auto bottom-[14.30%] inset-y-auto',
          'md:right-auto md:bottom-[20.7%] md:inset-y-auto',
          'md-landscape:right-[40px] md-landscape:inset-y-0', // md-landscape 전용
          'lg:right-[clamp(54px,calc(-5.14286px+4.10714vw),100px)] lg:inset-y-0', // lg~2xl fluid
          '2xl:right-[100px] 2xl:inset-y-0', // 2xl 이상 고정
        )}
      >
        <motion.button
          type='button'
          initial={{ opacity: 0 }}
          animate={{ opacity: text.length < 22 && text.trim() && colorAnalysis && !isAnalyzing ? 1 : 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            handleSubmit()
          }}
          disabled={!text.trim() || !colorAnalysis || isAnalyzing || text.length >= 22}
          className={classNames(
            'bg-black text-white rounded-full flex justify-center items-center transition-all duration-200 md:hover:bg-neutral-700',
            'h-auto aspect-square',
            'disabled:cursor-not-allowed',
            //mobile
            'w-[46px]',
            //tablet & desktop & large desktop
            'md:w-[46px]',
            'lg:w-[clamp(46px,calc(0.85714px+2.14286vw),74px)]',
            '2xl:w-[74px]',
            text.trim() && colorAnalysis && !isAnalyzing ? 'cursor-pointer' : 'cursor-not-allowed',
          )}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={classNames(
              'h-auto aspect-square',
              'w-[clamp(15px,calc(20.647px-0.735294vw),18px)]', // 모바일→md
              'lg:w-[clamp(15px,calc(3.42857px+0.803571vw),24px)]', // lg→2xl
              '2xl:w-[24px]', // 2xl 이상
            )}
            viewBox='0 0 16 14'
            fill='currentColor'
          >
            <path d='M9.57556 12.9384C9.20564 13.3071 8.60779 13.3091 8.23548 12.9428C7.8577 12.5712 7.85598 11.9626 8.23165 11.5888L9.72493 10.1031C10.1152 9.71293 10.5054 9.34111 10.8956 8.98771C11.2932 8.62694 11.595 8.36556 11.8012 8.20358C11.8926 8.12568 11.8291 7.97487 11.7094 7.98451C10.9009 8.04957 9.95969 8.0821 8.88559 8.0821H1.56345C0.971809 8.0821 0.492188 7.60248 0.492188 7.01084C0.492188 6.41919 0.971809 5.93957 1.56345 5.93957H8.88559C9.43779 5.93957 9.97895 5.9543 10.5091 5.98375C11.0392 6.00584 11.4331 6.03161 11.6908 6.06106C11.8084 6.07114 11.8696 5.92213 11.7796 5.84562C11.1627 5.32109 10.4778 4.68241 9.72493 3.92957L8.24424 2.43369C7.87207 2.0577 7.87361 1.45167 8.2477 1.07758C8.62403 0.701251 9.23449 0.702272 9.60956 1.07986L14.934 6.44008C15.2534 6.76156 15.2521 7.28091 14.9311 7.60078L9.57556 12.9384Z' />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}
