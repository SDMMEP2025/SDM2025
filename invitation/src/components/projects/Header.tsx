'use client'

import { useState } from 'react'

export function Header() {
  const [language, setLanguage] = useState('KR')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen)
  }

  function selectLanguage(selectedLang) {
    setLanguage(selectedLang)
    setIsDropdownOpen(false)
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className='w-full bg-white h-fit sticky top-0 z-30'>
      <div className='w-full h-[58px] xs: px-[16px] xs:py-[30px] lg:px-[48px] lg:py-[30px] lg:h-[80px] md:px-[40px] md:py-[30px] md:h-[68px] inline-flex justify-between items-center'>
        <div className='h-7 relative bg-pink-200 flex justify-center items-center'>
          <div className="justify-start text-black text-sm font-semibold font-['Pretendard'] leading-tight">
            NEW FORMATIVE
          </div>
        </div>
        
        {/* 데스크탑 네비게이션 */}
        <div className='justify-start items-center gap-40 hidden md:flex'>
          <div className='flex justify-start items-center gap-[26px]'>
            <div data-속성-1='hover' className='w-16 h-9 relative'>
              <div className="left-0 top-0 justify-start text-neutral-800 text-2xl font-semibold font-['Pretendard'] underline leading-9">
                About,
              </div>
            </div>
            <div data-속성-1='default' className='w-20 h-9 relative'>
              <div className="left-0 top-0 justify-start text-gray-400 text-2xl font-semibold font-['Pretendard'] leading-9">
                Project,
              </div>
            </div>
            <div data-property-1='Default' className='w-16 h-9 relative'>
              <div className="left-0 top-0 justify-start text-gray-400 text-2xl font-semibold font-['Pretendard'] leading-9">
                Track
              </div>
            </div>
          </div>
          
          {/* 언어 드롭다운 */}
          <div className='relative'>
            <div 
              data-property-1='kr' 
              className='relative flex flex-row justify-start items-center cursor-pointer'
              onClick={toggleDropdown}
            >
              <div className="left-0 top-0 px-[8.68px] justify-center text-center text-black text-2xl font-semibold font-['Pretendard'] leading-9">
                {language}
              </div>
              <svg 
                xmlns='http://www.w3.org/2000/svg' 
                className={`w-[12px] h-[6px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                viewBox='0 0 14 9' 
                fill='none'
              >
                <path d='M1 1L7 7L13 1' stroke='black' strokeWidth='2' />
              </svg>
            </div>
            
            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div className='absolute px-[8.68px] top-8 left-0 bg-white z-30'>
                {['KR', 'EN'].filter(lang => lang !== language).map((lang) => (
                  <div
                    key={lang}
                    className={`left-0 top-0 text-center cursor-pointer text-2xl font-semibold font-['Pretendard'] transition-colors `}
                    onClick={(e) => {
                      e.stopPropagation()
                      selectLanguage(lang)
                    }}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 모바일 햄버거 버튼 */}
        <div className='md:hidden'>
          <button
            onClick={toggleMobileMenu}
            className='p-2'
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="20" 
              viewBox="0 0 18 20" 
              fill="none"
            >
              <path d="M0 2H18" stroke="black" strokeWidth="2.5"/>
              <path d="M0 10H18" stroke="black" strokeWidth="2.5"/>
              <path d="M0 18H18" stroke="black" strokeWidth="2.5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white border-t border-gray-200 px-6 py-4 xs:px-12 xs:py-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
              <div className="text-neutral-800 text-xl font-semibold font-['Pretendard'] underline">
                About,
              </div>
              <div className="text-gray-400 text-xl font-semibold font-['Pretendard']">
                Project,
              </div>
              <div className="text-gray-400 text-xl font-semibold font-['Pretendard']">
                Track
              </div>
            </div>
            
            {/* 모바일 언어 선택 */}
            <div className='relative'>
              <div 
                className='flex flex-row justify-start items-center cursor-pointer'
                onClick={toggleDropdown}
              >
                <div className="px-[8.68px] text-black text-xl font-semibold font-['Pretendard']">
                  {language}
                </div>
                <svg 
                  xmlns='http://www.w3.org/2000/svg' 
                  className={`w-[12px] h-[6px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  viewBox='0 0 14 9' 
                  fill='none'
                >
                  <path d='M1 1L7 7L13 1' stroke='black' strokeWidth='2' />
                </svg>
              </div>
              
              {isDropdownOpen && (
                <div className='px-[8.68px] mt-2 bg-white'>
                  {['KR', 'EN'].filter(lang => lang !== language).map((lang) => (
                    <div
                      key={lang}
                      className={`cursor-pointer text-xl font-semibold font-['Pretendard'] transition-colors py-1`}
                      onClick={(e) => {
                        e.stopPropagation()
                        selectLanguage(lang)
                      }}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}