'use client'

import { PageTransitionWrapper } from '@/components/PageTransitionWrapper'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  // URL이 변경될 때마다 페이지 전환 애니메이션을 적용하기 위해 상태를 관리합니다.
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const pathname = usePathname()

  // 페이지 전환 애니메이션을 적용하는 로직을 추가합니다.
  useEffect(() => {
    // 홈페이지('/')인 경우 전환 애니메이션 없이 바로 표시
    if (pathname === '/') {
      setIsTransitioning(false)
      setDisplayChildren(children)
      return
    }

    // 경로가 변경되면 전환 애니메이션 시작
    setIsTransitioning(true)

    // pathname에 따라 다른 타이밍 적용
    const isAboutPage = pathname === '/about'
    const updateDelay = isAboutPage ? 3000 : 800 // /about: 3초, 기타: 0.8초
    const finishDelay = isAboutPage ? 6000 : 1600 // /about: 6초, 기타: 1.6초

    // 새로운 콘텐츠로 업데이트
    const updateTimer = setTimeout(() => {
      setDisplayChildren(children)
    }, updateDelay)

    // 전체 애니메이션 완료 후 전환 상태 해제
    const finishTimer = setTimeout(() => {
      setIsTransitioning(false)
    }, finishDelay)

    return () => {
      clearTimeout(updateTimer)
      clearTimeout(finishTimer)
    }
  }, [pathname, children])

  // 초기 렌더링 시에는 바로 children을 표시
  useEffect(() => {
    setDisplayChildren(children)
  }, [])

  return (
    <>
      <PageTransitionWrapper isTransitioning={isTransitioning} pathname={pathname}>
        {displayChildren}
      </PageTransitionWrapper>
    </>
  )
}
