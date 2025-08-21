'use client'
import { useEffect, useRef, useState } from 'react'
import Player from '@vimeo/player'
import { InViewFrame } from '../InViewFrame'
import classNames from 'classnames'

interface MovementMediaProps {
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
  position?: string
  className?: string
  withMotion?: boolean
  posterSrc?: string
}

export function MovementMedia({
  type = 'image',
  src,
  alt = 'Media content',
  autoplay = false,
  loop = true,
  muted = true,
  hasAudio = false,
  threshold = 0.04,
  aspect = 'aspect-[16/9]',
  preloadDelayMs = 300,
  prewarm = true,
  position = 'relative',
  className = '',
  withMotion = true,
  posterSrc = '',
}: MovementMediaProps) {
  const [hasError, setHasError] = useState(false)
  const [loaded, setLoaded] = useState(false)        // iframe 생성 타이밍 제어
  const [needsTap, setNeedsTap] = useState(false)
  const [videoReady, setVideoReady] = useState(false) // 첫 프레임이 그려졌는지

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const playerRef = useRef<Player | null>(null)
  const timerRef = useRef<number | null>(null)
  const inViewRef = useRef(false)

  const saveData =
    typeof navigator !== 'undefined' && (navigator as any)?.connection?.saveData === true
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
  const Wrapper = withMotion ? InViewFrame : 'div'

  const getIframeSrc = (baseSrc: string) => {
    const q = new URLSearchParams()
    const isBackground = !hasAudio
    const shouldAutoplayParam = autoplay && !prewarm

    q.append('autoplay', shouldAutoplayParam ? '1' : '0')
    q.append('loop', loop ? '1' : '0')
    q.append('muted', !hasAudio || muted ? '1' : '0')
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

  // iframe 생성 시점 제어 (초기 로딩 딜레이)
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

  const tryPlay = async () => {
    const player = playerRef.current
    if (!player) return
    try {
      await player.setMuted(!hasAudio ? true : muted)
      await player.play()
      setNeedsTap(false)
    } catch {
      setNeedsTap(true)
    }
  }

  // Vimeo 제어 + 첫 프레임 감지로 flicker 제거
  useEffect(() => {
    if (type !== 'video' || !loaded || !iframeRef.current) return

    const player = new Player(iframeRef.current)
    playerRef.current = player

    let disposed = false
    const onTimeUpdate = () => {
      if (disposed) return
      setVideoReady(true)              // 첫 프레임 표시됨
      player.off('timeupdate', onTimeUpdate)
    }

    player.setLoop(loop).catch(() => {})
    player.setMuted(!hasAudio ? true : muted).catch(() => {})

    if (saveData || reduceMotion) {
      setNeedsTap(true)
    }

    player.ready().then(async () => {
      player.on('timeupdate', onTimeUpdate)
      if (!saveData && !reduceMotion && inViewRef.current && (autoplay || prewarm)) {
        await tryPlay()
      }
    })

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
      { threshold },
    )
    io.observe(iframeRef.current!)

    const resumeOnGesture = () => {
      if (!inViewRef.current) return
      tryPlay()
    }
    window.addEventListener('pointerdown', resumeOnGesture, { passive: true })
    window.addEventListener('keydown', resumeOnGesture)

    const onVis = async () => {
      try {
        if (document.visibilityState === 'hidden') await player.pause()
        else if (inViewRef.current && !needsTap && (autoplay || prewarm) && !saveData && !reduceMotion) await tryPlay()
      } catch {}
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      disposed = true
      player.off('timeupdate', onTimeUpdate)
      io.disconnect()
      window.removeEventListener('pointerdown', resumeOnGesture)
      window.removeEventListener('keydown', resumeOnGesture)
      document.removeEventListener('visibilitychange', onVis)
      player.unload().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, loaded, threshold, loop, prewarm, muted, hasAudio, autoplay, saveData, reduceMotion])

  return (
    <Wrapper className={`w-full ${position} ${aspect} ${className} bg-black overflow-hidden`}>
      {/* POSTER (video용) — 첫 프레임 나오기 전까지 유지 */}
      {type === 'video' && posterSrc && (
        <img
          src={posterSrc}
          alt=""
          className={classNames(
            'absolute inset-0 w-full h-full object-cover transition-opacity will-change-[opacity]',
            videoReady ? 'opacity-0 pointer-events-none' : 'opacity-100',
          )}
          decoding="async"
          loading="eager"
        />
      )}

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
            className={classNames(
              'absolute inset-0 w-full h-full transition-opacity will-change-[opacity]',
              videoReady ? 'opacity-100' : 'opacity-0',
            )}
            style={{
              background: 'transparent',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              contain: 'paint',
            }}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            title={alt}
            loading={autoplay ? 'eager' : 'lazy'}
            onError={() => setHasError(true)}
          />
          {needsTap && (
            <button
              type="button"
              onClick={tryPlay}
              className="absolute inset-0 flex items-center justify-center text-white"
            >
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30">
                탭하여 재생
              </span>
            </button>
          )}
        </>
      )}
    </Wrapper>
  )
}
