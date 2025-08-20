import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

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
  const isMdUp = useMediaQuery('(min-width: 768px)')

  const planeLiftMd = isMdUp ? -3000 : -2000
  const y = useTransform(p4, [0, 1], [base, base + planeLiftMd], {
    clamp: true,
  })
  const p4Ease = useTransform(p4, (t) => t * t * (1 - 2 * t)) // smoothstep
  const y2 = useTransform(p4Ease, [0, 1], [base, base + planeLiftMd]) // ★ 적용
  return <motion.img src={src} alt='' className='absolute top-1/2 -translate-y-1/2' style={{ left, width, y }} />
}
