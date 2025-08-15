import { useEffect, useState } from 'react'

// 기기 타입 판별 유틸리티 함수들
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    userAgent: '',
  })

  useEffect(() => {
    const userAgent = navigator.userAgent

    // 1. User Agent 기반 판별
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isTabletUA = /iPad|Android(?=.*Tablet)|(?=.*Android)(?=.*Mobile)/i.test(userAgent)

    // 2. 화면 크기 기반 판별 (더 정확함)
    const screenWidth = window.innerWidth
    const isMobileScreen = screenWidth < 768
    const isTabletScreen = screenWidth >= 768 && screenWidth < 1024
    const isDesktopScreen = screenWidth >= 1024

    // 3. 터치 지원 여부
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // 최종 판별 로직 (화면 크기 + 터치 지원 조합)
    let finalIsMobile = false
    let finalIsTablet = false
    let finalIsDesktop = false

    if (isTouchDevice && isMobileScreen) {
      finalIsMobile = true
    } else if (isTouchDevice && isTabletScreen) {
      finalIsTablet = true
    } else if (isDesktopScreen) {
      finalIsDesktop = true
    } else {
      // 폴백: User Agent 기반
      finalIsMobile = isMobileUA && !isTabletUA
      finalIsTablet = isTabletUA
      finalIsDesktop = !isMobileUA
    }

    setDeviceInfo({
      isMobile: finalIsMobile,
      isTablet: finalIsTablet,
      isDesktop: finalIsDesktop,
      userAgent,
    })
  }, [])

  return deviceInfo
}
