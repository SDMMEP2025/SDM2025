'use client'
import { motion, useTransform } from 'framer-motion'
import { chromeProgress } from '@/lib/chromeProgress'
import { aboutPhase } from '@/lib/phase'
import { FooterContent } from '../FooterContent'

export function FooterOverlay() {
  const baseOpacity = useTransform(chromeProgress, [0, 0.2, 0.6], [0, 0, 1])
  const pe = useTransform(baseOpacity, (v) => (v < 0.15 ? 'none' : ('auto' as const)))
  const hide = useTransform(aboutPhase, [0.98, 1], [0, 1])
  const opacity = useTransform([baseOpacity, hide], ([o, h]: [number, number]) => o * (1 - Number(h)))

  return (
    <motion.div
      style={{ opacity, pointerEvents: pe }}
      className='w-full fixed bottom-0 z-[190] mix-blend-difference
                 flex flex-col-reverse md:flex-row justify-between items-center gap-[12px]
                 px-[61px] py-[14px] md:px-[40px] md:py-[12px] lg:px-[40px] lg:py-[28px]'
    >
      <FooterContent />
    </motion.div>
  )
}
