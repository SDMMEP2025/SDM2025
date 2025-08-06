'use client'

import { useEffect, useState } from 'react'

export function CountdownBars() {
  const barColors = ['#FFDF80', '#FF60B9', '#FF5E1F', '#FF8E3D']
  
  // 각 바의 상대적 크기 비율
  const heightRatios = [2, 3.5, 5, 7] // 총 17.5 단위
  const totalRatio = heightRatios.reduce((sum, ratio) => sum + ratio, 0)
  
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full pointer-events-none">
      <div className="relative w-full h-full flex flex-col justify-end">
        {Array.from({ length: 4 }, (_, position) => {
          const currentColorIndex = (position + tick) % barColors.length
          const nextColorIndex = (position + tick + 1) % barColors.length
          const currentColor = barColors[currentColorIndex]
          const nextColor = barColors[nextColorIndex]
          
          // 각 바의 높이를 컨테이너 높이의 비율로 계산
          const heightPercentage = (heightRatios[position] / totalRatio) * 100

          return (
            <div
              key={position}
              className="w-full relative"
              style={{
                height: `${heightPercentage}%`,
              }}
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
              `}</style>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CountdownBars