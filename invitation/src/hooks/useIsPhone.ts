'use client'
import { useEffect, useState } from 'react'

type Options = {
  cutoff?: number
}

export function useIsPhone({ cutoff = 768 }: Options = {}) {
  const [isPhone, setIsPhone] = useState(false)

  useEffect(() => {
    const compute = () => {
      const ua = navigator.userAgent || ''

      const isiPhone = /iPhone/i.test(ua)
      const isiPod = /iPod/i.test(ua)
      const isAndroid = /Android/i.test(ua)
      const isAndroidPhone = isAndroid && /Mobile/i.test(ua)
      const isiPadClassic = /iPad/i.test(ua)
      const isiPadOS13Plus = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1
      const isAndroidTablet = isAndroid && !/Mobile/i.test(ua)
      const isGenericTablet = /Tablet|PlayBook|Silk/i.test(ua)

      const isTabletByUA = isiPadClassic || isiPadOS13Plus || isAndroidTablet || isGenericTablet
      const uaPhone = (isiPhone || isiPod || isAndroidPhone) && !isTabletByUA

      const uaDataMobile = (navigator as any).userAgentData?.mobile === true

      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isCoarse = matchMedia?.('(pointer: coarse)').matches ?? false
      const shortSide = Math.min(window.innerWidth, window.innerHeight)
      const looksPhoneBySize = shortSide < cutoff

      const phone = uaPhone || uaDataMobile || ((hasTouch || isCoarse) && looksPhoneBySize && !isTabletByUA)

      setIsPhone(!!phone)
    }

    compute()
    window.addEventListener('resize', compute)
    window.addEventListener('orientationchange', compute)
    return () => {
      window.removeEventListener('resize', compute)
      window.removeEventListener('orientationchange', compute)
    }
  }, [cutoff])

  return isPhone
}
