import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function FloatingPhoto({
  p3,
  src,
  left,
  width,
  base,
  fade,
}: {
  p3: MotionValue<number>
  src: string
  left: string
  width: string
  base: number
  fade: number[]
}) {
  const isMdUp = useMediaQuery('(min-width: 768px)')

  const planeLiftMd = isMdUp ? -3000 : -1570
  const y = useTransform(p3, (v) => base + v * planeLiftMd)
  const scale = useTransform(p3, fade, [0.96, 1])
  return <motion.img src={src} alt='' className='absolute top-1/2 -translate-y-1/2' style={{ left, width, y, scale }} />
}
