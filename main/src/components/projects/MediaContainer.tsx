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
  hasAudio?: boolean
  threshold?: number
  aspect?: string
  preloadDelayMs?: number
  prewarm?: boolean
}

export function MediaContainer({
  type = 'image',
  src,
  alt = 'Media content',
  autoplay = false,
  loop = true,
  muted = true,
  hasAudio = false,
  threshold = 0.45,
  aspect = 'aspect-[16/9]',
  preloadDelayMs = 300,
  prewarm = true,
}: MediaContainerProps) {
  const [hasError, setHasError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [needsTap, setNeedsTap] = useState(false) // ← 사용자 탭 필요 여부
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const playerRef = useRef<Player | null>(null)
  const timerRef = useRef<number | null>(null)
  const inViewRef = useRef(false)

  // 환경 탐지
  const saveData = typeof navigator !== 'undefined' && (navigator as any)?.connection?.saveData === true
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Vimeo URL 정규화
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
        return h ? `https://player.vimeo.com/video/${id}?h=${h}` : `https://player.vimeo.com/video/${id}`
      }
    }
    return url
  }
  const finalSrc = type === 'video' ? getEmbedSrc(src) : src

  // Vimeo 파라미터
  const getIframeSrc = (baseSrc: string) => {
    const q = new URLSearchParams()
    const isBackground = !hasAudio

    // ⬇ prewarm일 땐 autoplay=0 (모바일에서 첫 시도 차단 방지)
    const shouldAutoplayParam = autoplay && !prewarm

    q.append('autoplay', shouldAutoplayParam ? '1' : '0')
    q.append('loop', loop ? '1' : '0')
    q.append('muted', (!hasAudio || muted) ? '1' : '0')
    q.append('playsinline', '1')
    q.append('autopause', '1')
    q.append('byline', '0')
    q.append('title', '0')
    q.append('portrait', '0')
    q.append('controls', isBackground ? '0' : '1')
    q.append('dnt', '1')
    if (isBackground) q.append('background', '1')

    const sep = baseSrc.includes('?') ? '&' : '?'
    return `${baseSrc}${sep}${q.toString()}`
  }

  // 지연 로드 → iframe 생성
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

  // 안전 재생 시도 함수
  const tryPlay = async () => {
    const player = playerRef.current
    if (!player) return
    try {
      await player.setMuted(!hasAudio ? true : muted)
      await player.play()
      setNeedsTap(false)
    } catch {
      // 자동재생 거절됨 → 탭 유도
      setNeedsTap(true)
    }
  }

  // 가시성 + 제스처 복구 + 정책 대응
  useEffect(() => {
    if (type !== 'video' || !loaded || !iframeRef.current) return
    const player = new Player(iframeRef.current)
    playerRef.current = player

    // 초기 상태
    player.setLoop(loop).catch(() => {})
    player.setMuted(!hasAudio ? true : muted).catch(() => {})

    // 정책상 자동재생을 포기해야 하는 환경이면 곧장 탭 유도
    if (saveData || reduceMotion) {
      setNeedsTap(true)
    }

    // ready 후: prewarm이면 즉시 재생 시도하지 않음
    player.ready().then(async () => {
      if (!saveData && !reduceMotion && inViewRef.current && (autoplay || prewarm)) {
        await tryPlay()
      }
    })

    // 인터섹션: 보이면 재생 시도, 벗어나면 정지
    const io = new IntersectionObserver(
      async ([entry]) => {
        inViewRef.current = entry.isIntersecting
        try {
          if (entry.isIntersecting) {
            if (!saveData && !reduceMotion && (autoplay || prewarm)) {
              await tryPlay()
            }
          } else {
            await player.pause()
          }
        } catch {}
      },
      { threshold }
    )
    io.observe(iframeRef.current!)

    // 탭/키보드 제스처로 복구
    const resumeOnGesture = () => {
      if (!inViewRef.current) return
      tryPlay()
    }
    window.addEventListener('pointerdown', resumeOnGesture, { passive: true })
    window.addEventListener('keydown', resumeOnGesture)

    // 탭 나갔다 오면 상태 동기화
    const onVis = async () => {
      try {
        if (document.visibilityState === 'hidden') await player.pause()
        else if (inViewRef.current && !needsTap && (autoplay || prewarm) && !saveData && !reduceMotion) await tryPlay()
      } catch {}
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      io.disconnect()
      window.removeEventListener('pointerdown', resumeOnGesture)
      window.removeEventListener('keydown', resumeOnGesture)
      document.removeEventListener('visibilitychange', onVis)
      player.unload().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, loaded, threshold, loop, prewarm, muted, hasAudio, autoplay, saveData, reduceMotion])

  return (
    <div className={`w-full relative ${aspect} bg-zinc-600 overflow-hidden`}>
      {/* IMAGE */}
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

      {/* VIDEO */}
      {type === 'video' && finalSrc && !hasError && loaded && (
        <>
          <iframe
            ref={iframeRef}
            src={getIframeSrc(finalSrc)}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            title={alt}
            // prewarm일 땐 eager로 굳이 안 당겨와도 됨. lazy가 안전.
            loading={autoplay ? 'eager' : 'lazy'}
            onError={() => setHasError(true)}
          />
          {/* 탭 유도 오버레이 */}
          {needsTap && (
            <button
              type="button"
              onClick={tryPlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 text-white"
            >
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30">
                탭하여 재생
              </span>
            </button>
          )}
        </>
      )}
    </div>
  )
}
