'use client'

import React, { useEffect, useRef, useState } from 'react'

type PopUpProps = {
  surveyUrl: string
  storageKey?: string
  triggerVisit?: number
  pageKey?: string
  defaultOpen?: boolean
  forceOpen?: boolean
  snoozeHours?: number
  onClose?: () => void
}

const HIDE_FOREVER = 'hideForever'
const SNOOZE_UNTIL = 'snoozeUntil'

export function PopUp({
  surveyUrl,
  storageKey = 'mep_survey_popup',
  triggerVisit = 4,
  pageKey,
  defaultOpen,
  forceOpen,
  snoozeHours = 24,
  onClose,
}: PopUpProps) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  const dialogRef = useRef<HTMLDivElement>(null)
  const firstBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
    console.log(localStorage)

    if (typeof window === 'undefined') return

    const pk = pageKey ?? location.pathname
    const visitKey = `${storageKey}:visits:${pk}`

    let count = 0
    try {
      count = parseInt(localStorage.getItem(visitKey) || '0', 10)
    } catch {}
    count += 1
    try {
      localStorage.setItem(visitKey, String(count))
    } catch {}

    const qsOpen = new URLSearchParams(location.search).get('showSurvey') === '1'
    if (forceOpen || defaultOpen || qsOpen) {
      setOpen(true)
      return
    }

    try {
      const raw = localStorage.getItem(storageKey)
      const data = raw ? (JSON.parse(raw) as Record<string, any>) : {}

      // 영구 숨김
      if (data[HIDE_FOREVER]) {
        setOpen(false)
        return
      }
      // 스누즈 유효
      const until = data[SNOOZE_UNTIL] ? new Date(data[SNOOZE_UNTIL]).getTime() : 0
      if (until && Date.now() < until) {
        setOpen(false)
        return
      }
    } catch {}

    // 4번째 방문에만 표시
    if (count >= triggerVisit) setOpen(true)
    else setOpen(false)
  }, [defaultOpen, forceOpen, storageKey, pageKey, triggerVisit])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('a,button,[tabindex]:not([tabindex="-1"])')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    setTimeout(() => firstBtnRef.current?.focus(), 0)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const persist = (data: Record<string, any>) => {
    try {
      const raw = localStorage.getItem(storageKey)
      const prev = raw ? JSON.parse(raw) : {}
      localStorage.setItem(storageKey, JSON.stringify({ ...prev, ...data }))
    } catch {
      /* ignore */
    }
  }

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  const handleSnooze = () => {
    const until = new Date(Date.now() + snoozeHours * 60 * 60 * 1000)
    persist({ [SNOOZE_UNTIL]: until.toISOString() })
    handleClose()
  }

  const handleNever = () => {
    persist({ [HIDE_FOREVER]: true })
    handleClose()
  }

  if (!mounted || !open) return null

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center'>
      {/* Backdrop */}
      <button aria-label='닫기' onClick={handleClose} className='absolute inset-0' />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='survey-title'
        aria-describedby='survey-desc'
        className='relative mx-4 w-[332px] md:w-[580px] rounded-[10px] bg-white px-14 py-7 md:px-[98px] md:py-10 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.15)]'
      >

        <div className='flex flex-col items-center gap-[46px] md:gap-[40px]'>
          <div className='w-full flex flex-col items-center gap-4'>
            <h2
              id='survey-title'
              className='text-center text-zinc-600 text-[14px] md:text-lg font-medium leading-relaxed'
            >
              2025 MEP <br className='block md:hidden' />
              〈New Formative〉는 어떠셨나요?
              <br />
              짧은 설문으로
              여러분들의 <br className='block md:hidden' />소중한 의견을 들려주세요.
            </h2>
            <p
              id='survey-desc'
              className='text-center text-neutral-400 text-[13px] md:text-xs font-medium leading-tight'
            >
              소요 시간은 약 5분 내외이며,
              <br className='block md:hidden' />
              해당 설문은 전시 개선을 위한 자료로 활용됩니다.
            </p>
          </div>

          <div className='flex flex-col gap-[10px] md:gap-[12px]'>
            <div className='w-full flex flex-col md:flex-row items-center justify-between gap-4'>
              <button
                ref={firstBtnRef}
                onClick={handleSnooze}
                className='w-[194px] h-14 px-6 bg-gray-200 hover:bg-gray-300 active:bg-gray-300 rounded-[100px] flex justify-center items-center'
              >
                <span className='text-neutral-700 text-center text-[17px] md:text-lg font-medium'>다음에 하기</span>
              </button>

              <a
                href={surveyUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='w-[194px] h-14 px-6 bg-neutral-800 hover:bg-neutral-900 active:bg-neutral-900 rounded-[100px] flex justify-center items-center'
                onClick={() => {
                  persist({ [HIDE_FOREVER]: true })
                  handleClose()
                }}
              >
                <span className='text-white text-center text-[17px] md:text-lg font-medium'>설문 참여하러 가기</span>
              </a>
            </div>

            <button
              onClick={handleNever}
              className='text-neutral-400 text-xs font-medium underline leading-tight hover:text-neutral-500 rounded'
            >
              다시 보지 않기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
