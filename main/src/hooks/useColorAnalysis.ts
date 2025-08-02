// hooks/useColorAnalysis.ts
import { useState, useCallback } from 'react'
import { ColorAnalysisResult, RGBColor } from '@/types/color'
import { analyzeColor } from '@/utils/colorUtils'

export function useColorAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeImageColors = useCallback(async (imageUrl: string): Promise<ColorAnalysisResult | null> => {
    setIsAnalyzing(true)
    setError(null)

    try {
      // Canvas를 사용해서 이미지 색상 추출
      const primaryColor = await extractDominantColor(imageUrl)
      
      if (!primaryColor) {
        throw new Error('No colors found in image')
      }
      
      // 색상 분석 (RGB → HSL → Refined Color → Brand Color)
      const result = analyzeColor(primaryColor)
      
      return result
    } catch (err) {
      console.error('Color analysis error:', err)
      setError('색상 분석에 실패했습니다.')
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  return {
    analyzeImageColors,
    isAnalyzing,
    error
  }
}

// Canvas를 사용해서 이미지의 주요 색상 추출
async function extractDominantColor(imageUrl: string): Promise<RGBColor | null> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }
        
        // 이미지 크기 조정 (성능을 위해 작게)
        const maxSize = 100
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // 이미지 데이터 가져오기
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // 색상 빈도 계산
        const colorMap: { [key: string]: number } = {}
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const alpha = data[i + 3]
          
          // 투명한 픽셀은 제외
          if (alpha < 128) continue
          
          // 너무 어둡거나 밝은 색상은 제외 (배경 제거)
          const brightness = (r + g + b) / 3
          if (brightness < 30 || brightness > 225) continue
          
          // 색상을 그룹화 (비슷한 색상들을 합치기 위해 10단위로 반올림)
          const groupedR = Math.round(r / 10) * 10
          const groupedG = Math.round(g / 10) * 10
          const groupedB = Math.round(b / 10) * 10
          
          const colorKey = `${groupedR},${groupedG},${groupedB}`
          colorMap[colorKey] = (colorMap[colorKey] || 0) + 1
        }
        
        // 가장 많이 사용된 색상 찾기
        let dominantColor = ''
        let maxCount = 0
        
        for (const [color, count] of Object.entries(colorMap)) {
          if (count > maxCount) {
            maxCount = count
            dominantColor = color
          }
        }
        
        if (dominantColor) {
          const [r, g, b] = dominantColor.split(',').map(Number)
          resolve({ r, g, b })
        } else {
          // 기본값으로 중앙 픽셀 사용
          const centerX = Math.floor(canvas.width / 2)
          const centerY = Math.floor(canvas.height / 2)
          const centerIndex = (centerY * canvas.width + centerX) * 4
          
          resolve({
            r: data[centerIndex],
            g: data[centerIndex + 1],
            b: data[centerIndex + 2]
          })
        }
        
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = imageUrl
  })
}