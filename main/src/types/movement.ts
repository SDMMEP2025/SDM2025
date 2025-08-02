// types/movement.ts
import { ColorAnalysisResult } from './color'

export type MovementStep = 'upload' | 'edit' | 'result' | 'interact'

export interface UploadedImage {
  file: File
  url: string
  id: string
}

export interface MovementData {
  currentImage?: UploadedImage
  text?: string
  aiGeneratedText?: string
  colorAnalysis?: ColorAnalysisResult
  step: MovementStep
}

export type FileUploadHandler = (files: FileList | null) => void
export type TextCompleteHandler = (text: string, colorAnalysis: ColorAnalysisResult) => void
export type StepNavigationHandler = () => void