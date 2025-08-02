import { RGBColor, HSLColor, RefinedColor, REFINED_COLORS, EXCEPTION_COLORS, BRAND_COLORS } from '@/types/color'

/**
 * @param r Red (0-255)
 * @param g Green (0-255) 
 * @param b Blue (0-255)
 * @returns HSL { h: 0-360, s: 0-100, l: 0-100 }
 */
export function rgbToHsl(r: number, g: number, b: number): HSLColor {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // 무채색
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 * @returns HEX string (예: "#FF5500")
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }).join("").toUpperCase()
}

export function getAchromaticColor(hsl: HSLColor): RefinedColor | null {
  const { s, l } = hsl
  
  if (s <= 20) {
    if (l >= 66) {
      return EXCEPTION_COLORS.find(c => c.name === 'Quiet Grey') || null
    } else if (l >= 33) {
      return EXCEPTION_COLORS.find(c => c.name === 'Soft Cream') || null
    } else {
      return EXCEPTION_COLORS.find(c => c.name === 'Still Black') || null
    }
  }
  
  return null
}

/**
 * @param hue 색상환 각도 (0-360)
 * @returns 해당하는 RefinedColor
 */
export function getChromaticColorFromHue(hue: number): RefinedColor {
  // 360도를 0도로 정규화
  const normalizedHue = hue === 360 ? 0 : hue
  
  for (const color of REFINED_COLORS) {
    if (!color.hueRange) continue
    
    const [min, max] = color.hueRange
    
    // 범위가 360도를 넘나드는 경우 처리 (예: 320-360, 0-20)
    if (min > max) {
      if (normalizedHue >= min || normalizedHue <= max) {
        return color
      }
    } else {
      if (normalizedHue >= min && normalizedHue <= max) {
        return color
      }
    }
  }
  
  return REFINED_COLORS[0]
}

/**
 * @param rgb 입력 RGB 색상
 * @returns 완전한 색상 분석 결과
 */
export function analyzeColor(rgb: RGBColor) {
  const { r, g, b } = rgb
  
  // 1. RGB → HSL 변환
  const hsl = rgbToHsl(r, g, b)
  const { h, s, l } = hsl
  
  // 2. 무채색 체크 (채도 ≤ 20%)
  const achromaticColor = getAchromaticColor(hsl)
  
  if (achromaticColor) {
    // 무채색인 경우
    return {
      primaryColor: rgb,
      refinedColor: achromaticColor,
      brandColor: achromaticColor.brandColor,
      extractedHex: rgbToHex(r, g, b),
      hue: h,
      saturation: s,
      lightness: l,
      isAchromatic: true
    }
  } else {
    // 유채색인 경우 - Hue 기준으로 분류
    const chromaticColor = getChromaticColorFromHue(h)
    
    return {
      primaryColor: rgb,
      refinedColor: chromaticColor,
      brandColor: chromaticColor.brandColor,
      extractedHex: rgbToHex(r, g, b),
      hue: h,
      saturation: s,
      lightness: l,
      isAchromatic: false
    }
  }
}
