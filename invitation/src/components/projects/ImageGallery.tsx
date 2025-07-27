'use client'

import { useState, useEffect } from 'react'

interface ImageGalleryProps {
  images: string[]
  autoplaySpeed?: number // 밀리초 단위 (기본값: 3000ms = 3초)
  alt?: string
}

export function ImageGallery({ images, autoplaySpeed = 3000, alt = 'Gallery image' }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 자동 슬라이드
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [images.length, autoplaySpeed])

  // 이미지가 없는 경우
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] relative bg-zinc-600 overflow-hidden flex items-center justify-center">
        <div className="text-gray-400 text-lg font-medium">이미지가 없습니다</div>
      </div>
    )
  }

  return (
    <div className="w-full aspect-[16/9] relative bg-zinc-600 overflow-hidden">
      {/* 이미지들 */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${alt} ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* 인디케이터 (이미지가 2개 이상일 때만 표시) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 inline-flex justify-center items-end gap-3.5 xs:gap-3.5 md:gap-3.5 lg:gap-2">
          <div className="flex justify-start items-center gap-1 xs:gap-1 md:gap-2 lg:gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 xs:w-1.5 xs:h-1.5 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full transition-opacity duration-300 ${
                  index === currentIndex 
                    ? 'bg-white opacity-100' 
                    : 'bg-white opacity-50'
                }`}
                aria-label={`이미지 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}