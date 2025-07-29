import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'

interface MovileNavProps {
  isOpen: boolean
  language: string
  toggleDropdown: () => void
  selectLanguage: (lang: string) => void
  isDropdownOpen: boolean
}

export function MobileNav({ isOpen, language, toggleDropdown, selectLanguage, isDropdownOpen }: MovileNavProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleMenuClick = (label: string, path: string) => {
    setActiveMenu(label)
    setTimeout(() => {
      router.push(path)
    }, 100)
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.4 }}
      className='fixed inset-0 z-[60] bg-white overflow-y-auto pl-[20px] pr-[16px] py-3 md:py-4 md:px-[40px]'
    >
      <div className='flex flex-col gap-[64px]'>
        <div className='flex justify-end'>
          <button onClick={toggleDropdown}>
            {/* 닫기 아이콘 */}
            <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36' fill='none'>
              <path
                d='M28.5 9.61L26.385 7.495 18 15.88 9.615 7.495 7.5 9.61 15.885 17.995 7.5 26.38 9.615 28.495 18 20.11 26.385 28.495 28.5 26.38 20.115 17.995 28.5 9.61Z'
                fill='#222'
              />
            </svg>
          </button>
        </div>

        {/* 메뉴 목록 및 언어 선택 부분은 기존과 동일 */}
        <div className='flex flex-col gap-[48px]'>
          <div className='flex flex-col justify-start gap-0'>
            {[
              { label: 'About', path: '/about' },
              { label: 'Projects', path: '/projects' },
              { label: 'Movement', path: '/movement' },
            ].map(({ label, path }) => {
              const isCurrentPage = pathname === path
              const isClicked = activeMenu === label

              let textColorClass = 'text-zinc-600'

              if (isClicked && isCurrentPage) {
                textColorClass = 'text-[#222222]'
              } else if (isClicked && !isCurrentPage) {
                textColorClass = 'text-pink-400'
              }

              return (
                <motion.div
                  key={label}
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`block w-full py-[22px] text-4xl font-medium font-english border-b border-stone-300 cursor-pointer ${textColorClass}`}
                  onClick={() => handleMenuClick(label, path)}
                >
                  {label}
                </motion.div>
              )
            })}
          </div>

          <div className='relative'>
            <div className='flex flex-row gap-[8px] bg-white leading-10'>
              {['KR', 'EN'].map((lang) => (
                <button
                  key={lang}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectLanguage(lang)
                  }}
                  className={`text-left text-3xl font-semibold font-english rounded-md transition-colors ${
                    language === lang ? 'text-zinc-600' : 'text-stone-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
