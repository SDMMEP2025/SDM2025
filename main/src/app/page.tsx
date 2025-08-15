//page.tsx
'use client'
import ComingSoonSection from '@/components/coming/ComingSoonSection'
import { ScrollOrchestrator, Header, Footer } from '@/components/intro'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FooterOverlay } from '@/components/projects'

export default function Page() {
  return (
    <>
      <ScrollOrchestrator />
      <Header />
      <div className='hidden md:block overflow-hidden'>
        <FooterOverlay />
      </div>
      {/* <ComingSoonSection /> */}
    </>
  )
}
