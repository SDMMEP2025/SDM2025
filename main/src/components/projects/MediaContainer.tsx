'use client'
import { useState } from 'react'

interface MediaContainerProps {
  type?: 'image' | 'video'
  src?: string
  alt?: string
}

export function MediaContainer({ type = 'image', src, alt = 'Media content' }: MediaContainerProps) {
  const [hasError, setHasError] = useState(false)

  const getEmbedSrc = (url?: string) => {
    if (!url) return undefined

    const vimeoPatterns = [
      /vimeo\.com\/video\/(\d+)(?:\?h=([a-zA-Z0-9]+))?/,
      /vimeo\.com\/(\d+)(?:\?h=([a-zA-Z0-9]+))?/,
      /player\.vimeo\.com\/video\/(\d+)(?:\?h=([a-zA-Z0-9]+))?/
    ]

    for (const pattern of vimeoPatterns) {
      const match = url.match(pattern)
      if (match) {
        const videoId = match[1]
        const hash = match[2] ? match[2] : url.match(/h=([a-zA-Z0-9]+)/)?.[1]
        
        if (hash) {
          return `https://player.vimeo.com/video/${videoId}?h=${hash}`
        } else {
          return `https://player.vimeo.com/video/${videoId}`
        }
      }
    }

    return url
  }

  const finalSrc = type === 'video' ? getEmbedSrc(src) : src

  const getIframeSrc = (baseSrc: string) => {
    const params = new URLSearchParams()
    params.append('autoplay', '1')
    params.append('loop', '1')
    params.append('muted', '1')
    params.append('background', '1')
    params.append('byline', '0')
    params.append('title', '0')
    params.append('portrait', '0')
    params.append('controls', '1')
    
    const separator = baseSrc.includes('?') ? '&' : '?'
    return `${baseSrc}${separator}${params.toString()}`
  }

  return (
    <div className="w-full aspect-[16/9] relative bg-zinc-600 overflow-hidden">
      {finalSrc && !hasError && (
        <>
          {type === 'image' ? (
            <img 
              src={finalSrc} 
              alt={alt}
              className="w-full h-full object-cover"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="w-full h-full">
              <iframe
                src={getIframeSrc(finalSrc)}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                title={alt}
                onError={() => setHasError(true)}
              />
            </div>
          )}
        </>
      )}
      
      {(!finalSrc || hasError) && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 xs:w-7 xs:h-7 md:w-7 md:h-7 lg:w-12 lg:h-12 rounded-full border-[5.25px] xs:border-[2.80px] md:border-[2.80px] lg:border-[5.25px] border-white" />
            <div className="w-3 h-3 xs:w-1.5 xs:h-1.5 md:w-1.5 md:h-1.5 lg:w-3 lg:h-3 absolute top-[21px] left-[21px] xs:top-[11px] xs:left-[11px] md:top-[11px] md:left-[11px] lg:top-[21px] lg:left-[21px] rounded-full border-[5.25px] xs:border-[2.80px] md:border-[2.80px] lg:border-[5.25px] border-white" />
            <div className="w-10 h-6 xs:w-6 xs:h-3.5 md:w-6 md:h-3.5 lg:w-10 lg:h-6 absolute top-[35px] left-[21px] xs:top-[22px] xs:left-[11px] md:top-[22] md:left-[11px] lg:top-[35px] lg:left-[21px] border-[5.25px] xs:border-[2.80px] md:border-[2.80px] lg:border-[5.25px] border-white" />
          </div>

          {hasError && (
            <div className="text-white text-sm opacity-75 mb-2">
              비디오를 로드할 수 없습니다
            </div>
          )}

          <div className="hidden lg:block text-gray-400 text-4xl font-bold font-['Pretendard'] leading-10">
            1920*1080
          </div>
          <div className="hidden md:block lg:hidden text-gray-400 text-xl font-bold font-['Pretendard'] leading-normal">
            768*432
          </div>
        </div>
      )}
    </div>
  )
}