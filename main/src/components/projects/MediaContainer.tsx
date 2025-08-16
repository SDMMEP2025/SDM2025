'use client'
import { useEffect, useRef, useState } from 'react'
import Player from '@vimeo/player'

interface MediaContainerProps {
  type?: 'image' | 'video'
  src?: string
  alt?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  threshold?: number
  aspect?: string
  preloadDelayMs?: number     // 페이지 진입 후 iframe 생성까지 지연
  prewarm?: boolean           // √ 화면 밖에서 미리 버퍼링: autoplay+muted 후 즉시 pause
}

export function MediaContainer({
  type = 'image',
  src,
  alt = 'Media content',
  autoplay = false,
  loop = true,
  muted = true,
  controls = true,
  threshold = 0.45,
  aspect = 'aspect-[16/9]',
  preloadDelayMs = 300,
  prewarm = true,
}: MediaContainerProps) {
  const [hasError, setHasError] = useState(false)
  const [loaded, setLoaded] = useState(false)  // iframe 생성 여부
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const playerRef = useRef<Player | null>(null)
  const timerRef = useRef<number | null>(null)
  const inViewRef = useRef(false)

  const getEmbedSrc = (url?: string) => {
    if (!url) return undefined
    const ps = [
      /vimeo\.com\/video\/(\d+)(?:\?h=([\w-]+))?/,
      /vimeo\.com\/(\d+)(?:\?h=([\w-]+))?/,
      /player\.vimeo\.com\/video\/(\d+)(?:\?h=([\w-]+))?/,
    ]
    for (const p of ps) {
      const m = url.match(p)
      if (m) {
        const id = m[1]
        const h = m[2] ? m[2] : url.match(/(?:\?|&)h=([\w-]+)/)?.[1]
        return h
          ? `https://player.vimeo.com/video/${id}?h=${h}`
          : `https://player.vimeo.com/video/${id}`
      }
    }
    return url
  }
  const finalSrc = type === 'video' ? getEmbedSrc(src) : src

  // prewarm이면 autoplay=1 & muted=1로 버퍼를 미리 끌어옴
  const getIframeSrc = (baseSrc: string) => {
    const q = new URLSearchParams()
    q.append('autoplay', prewarm || autoplay ? '1' : '0')
    q.append('loop', loop ? '1' : '0')
    q.append('muted', muted ? '1' : '0')
    q.append('playsinline', '1')
    q.append('autopause', '1')
    q.append('byline', '0')
    q.append('title', '0')
    q.append('portrait', '0')
    q.append('controls', controls ? '1' : '0')
    q.append('dnt', '1')
    const sep = baseSrc.includes('?') ? '&' : '?'
    return `${baseSrc}${sep}${q.toString()}`
  }

  // 페이지 진입 후 지연 → iframe 생성(로드 시작)
  useEffect(() => {
    if (type !== 'video' || !finalSrc) return
    const start = () => {
      timerRef.current = window.setTimeout(() => setLoaded(true), Math.max(0, preloadDelayMs)) as unknown as number
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') start()
    else window.addEventListener('DOMContentLoaded', start, { once: true })
    return () => {
      window.removeEventListener('DOMContentLoaded', start)
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [type, finalSrc, preloadDelayMs])

  // 가시성 재생/일시정지 + prewarm 즉시 pause
  useEffect(() => {
    if (type !== 'video' || !loaded || !iframeRef.current) return
    const player = new Player(iframeRef.current)
    playerRef.current = player

    // 기본 세팅
    player.setMuted(muted).catch(() => {})
    player.setLoop(loop).catch(() => {})

    // 화면 밖에서도 autoplay로 시작될 수 있으니, 준비되면 바로 pause 해서 버퍼만 확보
    player.ready().then(async () => {
      if (prewarm && !inViewRef.current) {
        try { await player.pause() } catch {}
      }
    })

    const io = new IntersectionObserver(
      async ([entry]) => {
        inViewRef.current = entry.isIntersecting
        try {
          if (entry.isIntersecting) await player.play()
          else await player.pause()
        } catch {}
      },
      { threshold }
    )
    io.observe(iframeRef.current!)

    return () => {
      io.disconnect()
      player.unload().catch(() => {})
    }
  }, [type, loaded, threshold, loop, muted, prewarm])

  return (
    <div className={`w-full relative ${aspect} bg-zinc-600 overflow-hidden`}>
      {type === 'image' && finalSrc && !hasError && (
        <img
          src={finalSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setHasError(true)}
          loading="lazy"
          decoding="async"
        />
      )}

      {type === 'video' && finalSrc && !hasError && loaded && (
        <iframe
          ref={iframeRef}
          src={getIframeSrc(finalSrc)}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          title={alt}
          // prewarm 중엔 eager로 최대한 빨리 가져오게 힌트
          loading={prewarm || preloadDelayMs === 0 ? 'eager' : 'lazy'}
          onError={() => setHasError(true)}
        />
      )}

      {((!finalSrc || hasError) || (type === 'video' && finalSrc && !loaded)) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* (기존 플레이스홀더 유지) */}
          <div className="relative mb-4">
            <div className="w-12 h-12 xs:w-7 xs:h-7 md:w-7 md:h-7 lg:w-12 lg:h-12 rounded-full border-[5.25px] xs:border-[2.80px] md:border-[2.80px] lg:border-[5.25px] border-white" />
            <div className="w-3 h-3 xs:w-1.5 xs:h-1.5 md:w-1.5 md:h-1.5 lg:w-3 lg:h-3 absolute top-[21px] left-[21px] xs:top-[11px] xs:left-[11px] md:top-[11px] md:left-[11px] lg:top-[21px] lg:left-[21px] rounded-full border-[5.25px] xs:border-[2.80px] md:border-[2.80px] lg:border-[5.25px] border-white" />
            <div className="w-10 h-6 xs:w-6 xs:h-3.5 md:w-6 md:h-3.5 lg:w-10 lg:h-6 absolute top-[35px] left-[21px] xs:top-[22px] xs:left-[11px] md:top-[22px] md:left-[11px] lg:top-[35px] lg:left-[21px] border-[5.25px] xs:border-[2.80px] md:border-[2.80px] lg:border-[5.25px] border-white" />
          </div>
          {hasError && <div className="text-white text-sm opacity-75 mb-2">비디오를 로드할 수 없습니다</div>}
        </div>
      )}
    </div>
  )
}
