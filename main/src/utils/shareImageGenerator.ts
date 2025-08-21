// utils/shareImageGenerator.ts

interface InteractionData {
  steps: number
  positions: Array<{ x: number; y: number }>
  brandColorName: string
  brandColorHex: string
  refinedColorName: string
  refinedColorHex: string
  text: string
}

// 폰트 로드 함수
const loadFonts = async (): Promise<void> => {
  try {
    // Saans TRIAL 폰트를 로드
    await document.fonts.load('36px "Saans TRIAL"')
    await document.fonts.load('bold 140px "Saans TRIAL"')
    await document.fonts.load('28px "Saans TRIAL"')
    await document.fonts.ready
  } catch (error) {
    console.warn('Font loading failed, falling back to system fonts')
  }
}

const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : null
  }
  
  const rgbToHex = (r: number, g: number, b: number) =>
    '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  if (!rgb1 || !rgb2) return color1

  const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r))
  const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g))
  const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b))
  return rgbToHex(r, g, b)
}

const drawConcentricSquares = async (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  steps: number,
  positions: Array<{ x: number; y: number }>,
  brandColorHex: string,
  refinedColorHex: string
): Promise<void> => {
  // ResultStep의 ConcentricSquares와 동일한 설정값
  const maxWidth = 420
  const maxHeight = 316
  const stepReduction = 25
  const scale = 2.2 // 템플릿에 맞는 크기로 조정

  // ResultStep에서와 동일한 순서로 사각형 그리기 (큰 것부터 작은 것까지)
  for (let i = 0; i < steps; i++) {
    // ResultStep과 동일한 factor 계산
    const factor = steps > 1 ? Math.pow(i / (steps - 1), 0.9) : 0
    const width = (maxWidth - stepReduction * i) * scale
    const height = (maxHeight - stepReduction * i) * scale
    
    // ResultStep과 동일한 색상 보간
    const color = interpolateColor(brandColorHex, refinedColorHex, factor)
    
    // ResultStep에서 저장된 실제 위치 사용
    const position = positions[i] || { x: 0, y: 0 }
    const x = centerX + position.x * scale - width / 2
    const y = centerY + position.y * scale - height / 2
    
    ctx.fillStyle = color
    
    // ResultStep과 동일한 border-radius 로직
    if (i === 0) {
      // 가장 큰 사각형만 둥근 모서리 (border-radius: 8px)
      ctx.beginPath()
      const radius = 8 * scale
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.fill()
    } else {
      // 나머지는 직각 사각형
      ctx.fillRect(x, y, width, height)
    }
  }
}

export const generateShareImage = async (
  interactionData: InteractionData
): Promise<string> => {
  // 폰트 먼저 로드
  await loadFonts()
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  // 인스타그램 스토리 사이즈 (9:16 비율)
  canvas.width = 1080
  canvas.height = 1920
  
  // 배경색 (흰색)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 상단 "2025 MEP New Formative" 텍스트
  ctx.fillStyle = '#6B7280' // text-gray-500
  ctx.font = '36px "Saans TRIAL", system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('2025 MEP New Formative', canvas.width / 2, 80)
  
  // "Your Movement" 대형 텍스트
  ctx.fillStyle = '#000000' // text-black
  ctx.font = 'bold 182px "Saans TRIAL", system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  
  // "Your" 텍스트
  ctx.fillText('Your', canvas.width / 2, 280)
  
  // "Movement" 텍스트  
  ctx.fillText('Movement', canvas.width / 2, 420)
  
  // 중앙 사각형 영역 (그래픽이 들어갈 부분)
  const rectX = 60
  const rectY = 480
  const rectWidth = 960
  const rectHeight = 724
  
  // ConcentricSquares 그리기
  await drawConcentricSquares(
    ctx,
    canvas.width / 2, // 중앙 X
    rectY + rectHeight / 2, // 사각형 중앙 Y
    interactionData.steps,
    interactionData.positions,
    interactionData.brandColorHex,
    interactionData.refinedColorHex
  )
  
  // 하단 "Is New Formative" 텍스트
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 182px "Saans TRIAL", system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  
  // "Is New" 텍스트
  ctx.fillText('Is New', canvas.width / 2, 1480)
  
  // "Formative" 텍스트
  ctx.fillText('Formative', canvas.width / 2, 1620)
  
  // 최하단 저작권 텍스트
  ctx.fillStyle = '#6B7280'
  ctx.font = 'medium 37px "Saans TRIAL", system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('©2025 Samsung Design Membership Emergence Project', canvas.width / 2, 1840)
  
  return canvas.toDataURL('image/png')
}

// 공유 기능
const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

const downloadImage = (dataUrl: string) => {
  const link = document.createElement('a')
  link.download = 'your-movement-creation.png'
  link.href = dataUrl
  link.click()
}

export const shareToInstagram = async (interactionData: InteractionData): Promise<void> => {
  try {
    const imageDataUrl = await generateShareImage(interactionData)
    
    if (navigator.share && isMobile()) {
      // 모바일에서 Web Share API 사용
      const response = await fetch(imageDataUrl)
      const blob = await response.blob()
      const file = new File([blob], 'your-movement-creation.png', { type: 'image/png' })
      
      await navigator.share({
        files: [file],
        title: 'Your Movement Creation',
        text: 'Check out my movement creation!'
      })
    } else {
      // 데스크톱이거나 Web Share API 미지원시 다운로드
      downloadImage(imageDataUrl)
    }
  } catch (error) {
    console.error('Share failed:', error)
    // 폴백: 이미지 다운로드
    const imageDataUrl = await generateShareImage(interactionData)
    downloadImage(imageDataUrl)
  }
}