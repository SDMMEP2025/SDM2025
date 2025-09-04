'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface AnimatedNavItemProps {
  label: string
  href: string
  isActive?: boolean
}

export function AnimatedNavItem({ label, href, isActive = false }: AnimatedNavItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [lineKey, setLineKey] = useState(0)

  return (
    <div className='h-9 overflow-hidden relative'>
      <Link href={href} passHref>
        <motion.button
          className='relative text-white mx-[1px] font-english text-2xl font-semibold tracking-[-0.02em]'
          onMouseEnter={() => {
            if (!isActive) {
              setIsHovered(true)
              setLineKey((prev) => prev + 1)
            }
          }}
          onMouseLeave={() => {
            if (!isActive) {
              setIsHovered(false)
            }
          }}
        >
          {label}
        </motion.button>
        {isActive && (
          <motion.div
            className='absolute bottom-[3px] w-full h-0.5 bg-white'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        <AnimatePresence mode='wait'>
          {isHovered && !isActive && (
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