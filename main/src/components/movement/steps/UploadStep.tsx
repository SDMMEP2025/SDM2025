// components/movement/steps/UploadStep.tsx
'use client'

import { Main } from '@/components/movement'

interface UploadStepProps {
  onUpload: (files: FileList | null) => void
  className?: string
}

export function UploadStep({ onUpload, className }: UploadStepProps) {
  return <Main onUpload={onUpload} className={className} />
}