'use client'

import ConcentricSquares from "../movement/steps/ConcentricSquares"

export function GraphicPlay() {
  const colors = [
    '#FF7EC1','#FF8FBA','#FFA1B3','#FFB2AC','#FFC3A5',
    '#FFD49E','#FFE697','#FFF790','#FFE17F','#FFCB6F',
    '#FFB55E','#FF9E4E','#FF883D','#FF722D','#FF5C1C',
  ]

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#FAFAFA]">
      <div className="absolute inset-0 grid place-items-center">
        <ConcentricSquares
          steps={15}
          colors={colors}
          motionParams={{
            speedBase: 0.2,
            followSpeedMultiplier: 0.9,
            followSpeedOffset: 1.0,
            colorInterpolationPower: 0.9,
            stepReductionRatio: 0.03,
            borderRadiusOuter: 12,
            dragSmoothing: 0.8,
            rotatePerStepDeg: -1,
            rotateOffsetDeg: 0,
          }}
          size={{ capW: 1200, capH: 630, parentW: 0.98, parentH: 0.75 }}
          
        />
      </div>
    </section>
  )
}
