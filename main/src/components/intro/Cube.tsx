import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'

type CubeProps = {
  widthPct: number
  heightPct: number
  color: string
  radius?: number
  rotateX: MotionValue<number> | number
  translateZ?: number 
  translateY?: number
  y?: MotionValue<number> | number
  origin?: string 
}

export default function Cube({
  widthPct,
  heightPct,
  color,
  radius = 16,
  rotateX,
  translateZ = 0,
  translateY=0,
  y = 0,
  origin = 'center center',
}: CubeProps) {

  const faceCommon: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: radius,
    willChange: 'transform',
  }

  return (
    <motion.div
      className="absolute inset-0 m-auto"
      style={{
        width: `${widthPct}%`,
        height: `${heightPct}%`,
        transformStyle: 'preserve-3d',
        rotateX,
        translateZ,
        translateY,
        y,
        willChange: 'transform',
        transformOrigin: origin,
      }}
    >
      {/* 앞면 */}
      <motion.div
        style={{
          ...faceCommon,
          background: color,
        }}
      />
    </motion.div>
  )
}
