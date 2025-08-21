//components/projects/ImageGallery.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { InViewFrame } from '../InViewFrame'

interface ImageGalleryProps {
  images: string[]
  autoplaySpeed?: number
  alt?: string
  swipeThreshold?: number
}

export function ImageGallery({
  images,
  autoplaySpeed = 3000,
  alt = 'Gallery image',
  swipeThreshold = 50,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (images.length <= 1 || isDragging) return

    intervalRef.current = setInterval(() => setCurrentIndex((i) => (i + 1) % images.length), autoplaySpeed)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [images.length, autoplaySpeed, isDragging])

  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX
    setIsDragging(true) // 타이머 일시정지
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    const diff = e.clientX - startX.current
    setIsDragging(false) // effect가 알아서 타이머 재개
    if (Math.abs(diff) < swipeThreshold) return
    setCurrentIndex((i) => (diff > 0 ? (i === 0 ? images.length - 1 : i - 1) : (i + 1) % images.length))
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    // 필요하면 drag 미리보기 translateX 등을 구현
  }

  if (images.length === 0) {
    return (
      <div className='w-full aspect-[16/9] flex items-center justify-center bg-zinc-600'>
        <span className='text-gray-400'>이미지가 없습니다</span>
      </div>
    )
  }

  return (
    <InViewFrame
      className='w-full aspect-[16/9] relative overflow-hidden bg-zinc-600'
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${alt} ${i + 1}`}
          draggable={false}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {images.length > 1 && (
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`${i + 1}번 이미지`}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 w-2 rounded-full transition-opacity ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </InViewFrame>
  )
}
