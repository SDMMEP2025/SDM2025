'use client'

import { useState, useEffect, useRef, MutableRefObject } from 'react'

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i

    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  return isMobile
}

//디바이스 너비값 실시간으로 가져오기
export const useDeviceWidth = (): number => {
  const [width, setWidth] = useState<number>(0)
  
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      
      const handleResize = () => {
        setWidth(window.innerWidth)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])
  
  return width
}

interface ComponentSize {
  width: number
  height: number
}

// 더 명시적인 타입 정의 사용
export const useComponentSize = (): [MutableRefObject<HTMLDivElement | null>, ComponentSize] => {
  const [size, setSize] = useState<ComponentSize>({ width: 0, height: 0 })
  const componentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (componentRef.current) {
        const { width, height } = componentRef.current.getBoundingClientRect()
        setSize({ width, height })
      } else {
        setSize({ width: 0, height: 0 })
      }
    }

    // 초기 크기 설정
    handleResize()

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return [componentRef, size]
}

export const useScrollAtBottom = (threshold = 10): boolean => {
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight

        // 스크롤이 바닥에 닿았는지 확인 (threshold 값만큼 여유 포함)
        if (scrollTop + clientHeight >= scrollHeight - threshold) {
          setIsAtBottom(true)
        } else {
          setIsAtBottom(false)
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      
      // 초기 상태 확인
      handleScroll()

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [threshold])

  return isAtBottom
}