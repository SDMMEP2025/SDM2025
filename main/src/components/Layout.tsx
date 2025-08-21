'use client'

import { PageTransitionWrapper } from '@/components/PageTransitionWrapper'
import { useState, useEffect, Suspense } from 'react'
import { usePathname } from 'next/navigation'

// About 페이지용 로딩 컴포넌트
const AboutPageLoader = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<div style={{ display: 'none' }} />}>{children}</Suspense>
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const [aboutPageLoaded, setAboutPageLoaded] = useState(false)
  const [aboutTransitionStartTime, setAboutTransitionStartTime] = useState<number | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // 홈페이지('/')인 경우 전환 애니메이션 없이 바로 표시
    if (pathname === '/') {
      setIsTransitioning(false)
      setDisplayChildren(children)
      return
    }

    // 경로가 변경되면 전환 애니메이션 시작
    setIsTransitioning(true)
    setAboutPageLoaded(false)

    // /about 페이지가 아닌 경우 기존 로직 유지
    if (pathname !== '/about') {
      setAboutTransitionStartTime(null) // About 페이지가 아니면 시작 시간 초기화

      const updateTimer = setTimeout(() => {
        setDisplayChildren(children)
      }, 800)

      const finishTimer = setTimeout(() => {
        setIsTransitioning(false)
      }, 1600)

      return () => {
        clearTimeout(updateTimer)
        clearTimeout(finishTimer)
      }
    } else {
      // /about 페이지인 경우 시작 시간 기록하고 즉시 children 업데이트
      setAboutTransitionStartTime(Date.now())
      setDisplayChildren(children)
    }
  }, [pathname, children])

  // About 페이지 로드 완료 처리 (최소 1.6초 보장)
  useEffect(() => {
    if (pathname === '/about' && aboutPageLoaded && aboutTransitionStartTime) {
      const elapsedTime = Date.now() - aboutTransitionStartTime
      const minimumShowTime = 1600 // 1.6초
      const remainingTime = Math.max(0, minimumShowTime - elapsedTime)

      // 최소 시간이 지나지 않았다면 남은 시간만큼 더 기다리기
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, remainingTime + 300) // 300ms는 기존 지연시간

      return () => clearTimeout(timer)
    }
  }, [pathname, aboutPageLoaded, aboutTransitionStartTime])

  // 초기 렌더링 시에는 바로 children을 표시
  useEffect(() => {
    setDisplayChildren(children)
  }, [])

  // About 페이지 로딩 완료 감지
  useEffect(() => {
    if (pathname === '/about') {
      // DOM 로드 완료 감지
      const checkDOMReady = () => {
        if (document.readyState === 'complete') {
          setTimeout(() => setAboutPageLoaded(true), 100)
        }
      }

      // 이미지 로딩 완료 감지
      const checkImagesLoaded = () => {
        const images = document.querySelectorAll('img')

        if (images.length === 0) {
          setTimeout(() => setAboutPageLoaded(true), 1000)
          return
        }

        let loadedImages = 0
        images.forEach((img) => {
          if (img.complete) {
            loadedImages++
          } else {
            img.onload = () => {
              loadedImages++
              if (loadedImages === images.length) {
                setAboutPageLoaded(true)
              }
            }
          }
        })

        if (loadedImages === images.length) {
          setTimeout(() => setAboutPageLoaded(true), 500)
        }
      }

      // 강제 타임아웃 (최대 5초)
      const forceComplete = setTimeout(() => {
        setAboutPageLoaded(true)
      }, 5000)

      // 작은 지연 후 체크 시작
      setTimeout(() => {
        checkDOMReady()
        checkImagesLoaded()
      }, 100)

      return () => clearTimeout(forceComplete)
    }
  }, [pathname])

  // About 페이지인 경우 Suspense로 감싸기
  const wrappedChildren =
    pathname === '/about' ? (
      <AboutPageLoader>
        <div onLoad={() => setAboutPageLoaded(true)} style={{ opacity: aboutPageLoaded ? 1 : 0 }}>
          {displayChildren}
        </div>
      </AboutPageLoader>
    ) : (
      displayChildren
    )

  return (
    <>
      <PageTransitionWrapper isTransitioning={isTransitioning} pathname={pathname} aboutPageLoaded={aboutPageLoaded}>
        {wrappedChildren}
      </PageTransitionWrapper>
    </>
  )
}
