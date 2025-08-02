'use client'
import { Header } from '@/components/projects'
import { Footer } from '@/components/movement/Footer_Movement'
import { Main } from '@/components/movement'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Page() {
  return (
    <>
      <Header />
      <Main />

      <Footer />
    </>
  )
}
