//page.tsx
'use client'
import ComingSoonSection from '@/components/coming/ComingSoonSection'
import { ScrollOrchestrator, Header, Footer } from '@/components/intro'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FooterOverlay } from '@/components/projects'
import { CursorArea } from '@/components/cursor/CursorArea'

export default function Page() {
  return (
    <>
      <ScrollOrchestrator />
      <CursorArea variant='base'>
        <Header />
      </CursorArea>
      <div className='hidden md:block overflow-hidden'>
        <FooterOverlay />
      </div>
      {/* <ComingSoonSection /> */}
    </>
  )
}
