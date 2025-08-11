// components/projects/Footer.tsx
'use client'
import { motion, useTransform } from 'framer-motion'
import { chromeProgress } from '@/lib/chromeProgress'

export function Footer() {
  // 헤더와 동일한 곡선
  const footerOpacity = useTransform(chromeProgress, [0, 0.2, 0.6], [0, 0, 1])
  const footerY       = useTransform(chromeProgress, [0, 0.6], [0, 0]) // 헤더처럼 이동 없음(0 고정)
  const pe            = useTransform(footerOpacity, (v) => (v < 0.15 ? 'none' : ('auto' as const)))

  return (
    <motion.div
      style={{
        opacity: footerOpacity,
        y: footerY,
        pointerEvents: pe,
      }}
      className='w-full fixed bottom-0 z-[200] mix-blend-difference
                 flex flex-col-reverse md:flex-row justify-between items-center gap-[12px]
                 px-[61px] py-[14px] md:px-[40px] md:py-[12px] lg:px-[40px] lg:py-[28px]'
    >
      <div className='left-[40px] top-[28px] justify-start text-sm text-white mb-6 md:mb-0 text-center font-normal capitalize leading-normal md:text-left'>
        © 2025 Samsung Design Membership<span className='md:hidden'>.</span>
        <br className='md:hidden' />
        <span className='hidden md:inline'> </span>All rights reserved
      </div>

      <div className='w-fit h-6 inline-flex justify-center items-center gap-10'>
        <a
          href='https://www.design.samsung.com/kr/contents/sdm/'
          target='_blank'
          rel='noopener noreferrer'
          className='justify-start text-white text-sm font-medium underline uppercase text-nowrap leading-tight hover:opacity-80 transition-opacity'
        >
          Official Page
        </a>
        <a
          href='https://www.instagram.com/samsungdesignmembership/'
          target='_blank'
          rel='noopener noreferrer'
          className='justify-start text-white text-sm font-medium underline uppercase leading-tight hover:opacity-80 transition-opacity'
        >
          Instagram
        </a>
        <a
          href='https://www.behance.net/Samsung_Design_Mem'
          target='_blank'
          rel='noopener noreferrer'
          className='justify-start text-white text-sm font-medium underline uppercase leading-tight hover:opacity-80 transition-opacity'
        >
          Behance
        </a>
      </div>
    </motion.div>
  )
}
