//components/about/Image.tsx

'use client'

import { InViewFrame } from '../InViewFrame'

interface ImageProps {
  src: string
  alt?: string
  className?: string
}

export function Image({ src, alt = 'Image', className = '' }: ImageProps) {
  if (!src) {
    return (
      <InViewFrame
        className={`w-full aspect-[16/9] relative bg-zinc-600 overflow-hidden flex items-center justify-center ${className}`}
      >
        <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white'>{alt}</span>
      </InViewFrame>
    )
  }

  return (
    <InViewFrame className={`w-full aspect-[16/9] relative bg-zinc-600 overflow-hidden ${className}`}>
      <img src={src} alt={alt} className='w-full h-full object-cover' />
    </InViewFrame>
  )
}
