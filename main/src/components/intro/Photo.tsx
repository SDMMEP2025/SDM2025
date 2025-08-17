import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'

export function FloatingPhoto({
  p4,
  src,
  left,
  width,
  base,
  fade,
}: {
  p4: MotionValue<number>
  src: string
  left: string
  width: string
  base: number
  fade: number[]
}) {
  const y = useTransform(p4, (v) => base + v * -3000)
  const scale = useTransform(p4, fade, [0.96, 1])
  return (
    <motion.img
      src={src}
      alt=''
      className='absolute top-1/2 -translate-y-1/2'
      style={{ left, width, y, scale }}
    />
  )
}
