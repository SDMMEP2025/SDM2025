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
    // 경로가 변경되면 전환 애니메이션 시작
    setIsTransitioning(true)

    // PageTransitionWrapper 애니메이션 타이밍에 맞춰 조정
    // 0.8초 후에 새로운 콘텐츠로 업데이트 (모든 텍스트가 등장 완료되는 시점)
    const updateTimer = setTimeout(() => {
      setDisplayChildren(children)
    }, 800)

    // 전체 애니메이션 완료 후 전환 상태 해제 (1.6초)
    const finishTimer = setTimeout(() => {
      setIsTransitioning(false)
    }, 1600)

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
      <PageTransitionWrapper isTransitioning={isTransitioning}>{displayChildren}</PageTransitionWrapper>
    </>
  )
}
