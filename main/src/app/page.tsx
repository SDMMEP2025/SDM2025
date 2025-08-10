//page.tsx
'use client'
import ComingSoonSection from '@/components/coming/ComingSoonSection'
import { ScrollOrchestrator, Header, Footer } from '@/components/intro'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Page() {
  return (
    <>
      {/* <Header />
      <ScrollOrchestrator />
      <Footer/> */}
      <ComingSoonSection />
    </>
  )
}
