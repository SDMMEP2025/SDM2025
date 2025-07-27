'use client'

import { useEffect, useState } from 'react'

export function CountdownBars() {
  const barColors = ['#FFDF80', '#FF60B9', '#FF5E1F', '#FF8E3D']
  
  // 작은 높이 (모바일 세로, 태블릿 가로, 데스크톱)
  const largeHeights = [2, 3.5, 5, 7]
  
  // 큰 높이 (태블릿 세로만)
  const smallHeights = [5, 7, 10, 14]
  
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute rotate-90 landscape:md:rotate-0 lg:rotate-0 bottom-0 left-0 w-[100vh] landscape:md:w-full landscape:md:h-[100vh] h-full pointer-events-none z-0">
      <div className="relative w-full h-full flex flex-col justify-end">
        {Array.from({ length: 4 }, (_, position) => {
          const currentColorIndex = (position + tick) % barColors.length
          const nextColorIndex = (position + tick + 1) % barColors.length
          const currentColor = barColors[currentColorIndex]
          const nextColor = barColors[nextColorIndex]
          
          const smallHeight = smallHeights[position]
          const largeHeight = largeHeights[position]

          return (
            <div
              key={position}
              className={`w-full relative countdown-bar-${position}`}
            >
              <div
                className="absolute inset-0 transition-transform duration-1000 ease-out"
                style={{
                  backgroundColor: currentColor,
                  transform: `translateY(0%)`,
                }}
              />
              <div
                className="absolute inset-0 transition-transform duration-1000 ease-out"
                style={{
                  backgroundColor: nextColor,
                  transform: `translateY(100%)`,
                  animation: `slideUp-${tick} 1000ms ease-out forwards`,
                }}
              />
              <style jsx>{`
                @keyframes slideUp-${tick} {
                  from {
                    transform: translateY(100%);
                  }
                  to {
                    transform: translateY(0%);
                  }
                }
                
                /* 기본값: 모바일과 태블릿 세로는 큰 높이 */
                .countdown-bar-${position} {
                  height: ${largeHeight}vh;
                }
                
                /* 태블릿 가로와 데스크톱만 작은 높이 */
                @media (min-width: 768px) and (orientation: landscape) {
                  .countdown-bar-${position} {
                    height: ${smallHeight}vh;
                  }
                }
              `}</style>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CountdownBars