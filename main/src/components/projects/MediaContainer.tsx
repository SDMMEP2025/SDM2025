'use client'
import { useEffect, useRef, useState } from 'react'
import Player from '@vimeo/player'
import { InViewFrame } from '../InViewFrame'
import classNames from 'classnames'

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
  position?: string
  className?: string
  withMotion?: boolean
  posterSrc?: string
}

export function MediaContainer({
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
  posterSrc = ''
}: MediaContainerProps) {
  const [hasError, setHasError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [needsTap, setNeedsTap] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const playerRef = useRef<Player | null>(null)
  const timerRef = useRef<number | null>(null)
  const inViewRef = useRef(false)
  const [posterReady, setPosterReady] = useState(false)


  const saveData = typeof navigator !== 'undefined' && (navigator as any)?.connection?.saveData === true
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

  useEffect(() => {
    if (type !== 'video' || !loaded || !iframeRef.current) return
    const player = new Player(iframeRef.current)
    playerRef.current = player

    player.setLoop(loop).catch(() => {})
    player.setMuted(!hasAudio ? true : muted).catch(() => {})

    if (saveData || reduceMotion) {
      setNeedsTap(true)
    }

    player.ready().then(async () => {
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
      {/* POSTER (video용) */}
      {type === 'video' && posterSrc && (
        <img
          src={posterSrc}
          alt=''
          className={classNames(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-0 pointer-events-none' : 'opacity-100',
          )}
          onLoad={() => setPosterReady(true)}
          decoding='async'
          loading='eager'
        />
      )}

      {/* IMAGE */}
      {type === 'image' && finalSrc && !hasError && (
        <img
          src={finalSrc}
          alt={alt}
          className='absolute inset-0 w-full h-full object-cover'
          onError={() => setHasError(true)}
          loading='lazy'
          decoding='async'
        />
      )}

      {/* VIDEO */}
      {type === 'video' && finalSrc && !hasError && loaded && (
        <>
          <iframe
            ref={iframeRef}
            src={getIframeSrc(finalSrc)}
            className='absolute inset-0 w-full h-full'
            style={{ background: 'transparent' }}
            frameBorder='0'
            allow='autoplay; fullscreen; picture-in-picture; encrypted-media'
            allowFullScreen
            title={alt}
            loading={autoplay ? 'eager' : 'lazy'}
            onError={() => setHasError(true)}
          />
          {needsTap && (
            <button
              type='button'
              onClick={tryPlay}
              className='absolute inset-0 flex items-center justify-center bg-black/30 text-white'
            >
              <span className='px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30'>
                탭하여 재생
              </span>
            </button>
          )}
        </>
      )}
    </Wrapper>
  )
}
