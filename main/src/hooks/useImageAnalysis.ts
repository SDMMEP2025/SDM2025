// hooks/useImageAnalysis.ts
import { useState, useCallback } from 'react'

interface AnalysisResult {
  description: string
  success: boolean
}

export function useImageAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeImage = useCallback(async (file: File, lang: 'en' | 'ko'): Promise<string> => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`/api/analyze-image/${lang}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const result: AnalysisResult = await response.json()

      if (result.success) {
        return result.description
      } else {
        throw new Error('Analysis failed')
      }
    } catch (err) {
      const errorMessage = '이미지 분석에 실패했습니다. 직접 입력해주세요.'
      setError(errorMessage)
      console.error('Image analysis error:', err)
      return '' // 빈 문자열 반환하여 사용자가 직접 입력하도록
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  return {
    analyzeImage,
    isAnalyzing,
    error,
  }
}
