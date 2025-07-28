'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface AnimatedNavItemProps {
  label: string
  href: string
}

export function AnimatedNavItem({ label, href }: AnimatedNavItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [lineKey, setLineKey] = useState(0)

  return (
    <div className='h-9 overflow-hidden relative'>
      <Link href={href} passHref>
        <motion.button
          className='relative text-white mx-[1px] font-english text-2xl font-semibold tracking-[-0.02em]'
          onMouseEnter={() => {
            setIsHovered(true)
            setLineKey((prev) => prev + 1)
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {label}
        </motion.button>
        <AnimatePresence mode='wait'>
          {isHovered && (
            <motion.div
              key={lineKey}
              className='absolute bottom-[3px] w-full h-0.5 bg-white'
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '0%', opacity: 1 }}
              exit={{ x: '100%', opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 50 }}
            />
          )}
        </AnimatePresence>
      </Link>
    </div>
  )
}
