'use client'
import { motion, useTransform } from 'framer-motion'
import { aboutPhase } from '@/lib/phase'
import { FooterContent } from '../FooterContent'

export function FooterDocked() {
  const opacity = useTransform(aboutPhase, [0.98, 1], [0, 1])
  return (
    <motion.div
      style={{ opacity }}
      className='w-full relative z-[10] bg-black mix-blend-difference
                 flex flex-col-reverse md:flex-row justify-between items-center gap-[12px]
                 px-[61px] py-[14px] md:px-[40px] md:py-[12px] lg:px-[40px] lg:py-[28px]'
    >
      <FooterContent />
    </motion.div>
  )
}
