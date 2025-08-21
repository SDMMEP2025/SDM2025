// types/color.ts
export interface RGBColor {
  r: number
  g: number
  b: number
}

export interface HSLColor {
  h: number
  s: number
  l: number
}

export interface RefinedColor {
  name: string
  hex: string
  hueRange?: [number, number]
  brandColor: BrandColor
}

export interface BrandColor {
  name: 'Pink' | 'Yellow' | 'Orange'
  hex: string
}

export interface ColorAnalysisResult {
  primaryColor: RGBColor
  refinedColor: RefinedColor
  brandColor: BrandColor
  extractedHex: string
  hue: number
}

// 브랜드 컬러 정의
export const BRAND_COLORS: Record<string, BrandColor> = {
  Pink: { name: 'Pink', hex: '#FF60B9' },
  Yellow: { name: 'Yellow', hex: '#FFF790' },
  Orange: { name: 'Orange', hex: '#FF5E1F' },
}

// Refined 컬러 정의
export const REFINED_COLORS: RefinedColor[] = [
  { name: 'Energetic Red', hex: '#E2206A', hueRange: [0, 20], brandColor: BRAND_COLORS.Pink },
  { name: 'Sunny Orange', hex: '#FF8827', hueRange: [20, 40], brandColor: BRAND_COLORS.Pink },
  { name: 'Mild Yellow', hex: '#FFEB97', hueRange: [40, 60], brandColor: BRAND_COLORS.Pink },
  { name: 'Tender Apricot', hex: '#FFEFC2', hueRange: [60, 90], brandColor: BRAND_COLORS.Pink },
  { name: 'Cozy Melon', hex: '#E4FFD8', hueRange: [90, 120], brandColor: BRAND_COLORS.Pink },
  { name: 'Calm Matcha', hex: '#00DBA4', hueRange: [120, 160], brandColor: BRAND_COLORS.Yellow },
  { name: 'Clear Mint', hex: '#4DE4E8', hueRange: [160, 200], brandColor: BRAND_COLORS.Yellow },
  { name: 'Silent Blue', hex: '#3B94FF', hueRange: [200, 230], brandColor: BRAND_COLORS.Yellow },
  { name: 'Warm Coral', hex: '#FF8AA5', hueRange: [230, 260], brandColor: BRAND_COLORS.Yellow },
  { name: 'Candy Violet', hex: '#EB5DFF', hueRange: [260, 290], brandColor: BRAND_COLORS.Orange },
  { name: 'Open Sky', hex: '#BBF1FF', hueRange: [290, 320], brandColor: BRAND_COLORS.Orange },
  { name: 'Soda Pink', hex: '#FDC1FD', hueRange: [320, 360], brandColor: BRAND_COLORS.Orange },
]

// 예외 케이스 컬러 정의
export const EXCEPTION_COLORS: RefinedColor[] = [
  { name: 'Quiet Grey', hex: '#C1CCD3', brandColor: BRAND_COLORS.Yellow },
  { name: 'Still Black', hex: '#4B5154', brandColor: BRAND_COLORS.Yellow },
  { name: 'Soft Cream', hex: '#EDF7F7', brandColor: BRAND_COLORS.Orange },
]
