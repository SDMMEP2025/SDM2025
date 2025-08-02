//components/projects/CreditTutor.tsx

'use client'

import classNames from 'classnames'

interface Tutor {
  name: string
  englishName: string
}

interface TutorSection {
  title: string
  tutors: Tutor[]
}

interface CreditTutorProps {
  title?: string
  sections: TutorSection[]
}

export function CreditTutor({ title = 'Tutor', sections }: CreditTutorProps) {
  // PC 모드에서만 VD tutor 섹션을 3명씩 나누는 함수
  const splitVDTutorForDesktop = (sections: TutorSection[]): TutorSection[] => {
    const result: TutorSection[] = []

    sections.forEach((section) => {
      if (section.title === 'VD tutor' && section.tutors.length > 3) {
        // 3명씩 나누어서 새로운 섹션 생성
        for (let i = 0; i < section.tutors.length; i += 3) {
          result.push({
            title: 'VD tutor',
            tutors: section.tutors.slice(i, i + 3),
          })
        }
      } else {
        result.push(section)
      }
    })

    return result
  }

  return (
    <div
      className={classNames(
        'w-full bg-white',
        //mobile
        'px-[2.2vw] py-[56px]',
        //tablet
        'md:px-[5.2vw] md:py-[56px]',
        //desktop
        'lg:px-[16.32vw] lg:py-[84px]',
        //extra large
        'xl:px-[16.67vw]',
      )}
    >
      <div className='flex flex-col md:flex-row lg:justify-between'>
        {/* 제목 */}
        <div className='mb-9 lg:mb-0 w-[100%] md:w-[25%] lg:w-[20%]'>
          <h2 className='text-neutral-800 text-base lg:text-lg font-bold leading-[1.6] lg:leading-[1.5] tracking-[-0.02em]'>
            {title}
          </h2>
        </div>

        {/* 튜터 섹션들 */}
        <div className='w-[100%] md:w-[75%] lg:w-[80%]'>
          {/* 모바일: 세로 배치 */}
          <div className='flex flex-col gap-[36px] md:hidden'>
            {sections.flatMap((section) =>
              section.tutors.map((tutor, tutorIndex) => (
                <div key={`${section.title}-${tutorIndex}`} className='flex justify-between gap-4'>
                  <div
                    style={{
                      opacity: tutorIndex !== 0 ? 0 : 1, // 첫 번째 튜터만 제목 표시
                    }}
                    className='w-full text-neutral-800 text-sm font-medium leading-[1.6] tracking-[-0.02em]'
                  >
                    {section.title}
                  </div>
                  <div className='w-full'>
                    <div className='text-neutral-800 text-base font-bold leading-[1.6] tracking-[-0.02em]'>
                      {tutor.name}
                    </div>
                    <div className='text-zinc-600 text-sm font-regular leading-[1.6] tracking-[-0.02em]'>
                      {tutor.englishName}
                    </div>
                  </div>
                </div>
              )),
            )}
          </div>

          {/* 태블릿: 세로 배치 */}
          <div className='hidden md:block lg:hidden'>
            <div className='grid grid-cols-2 gap-y-5'>
              {sections.flatMap((section, index) => (
                <div key={index + section.title} className='flex flex-col gap-5 min-h-[48px]'>
                  {section.tutors.map((tutor, tutorIndex) => (
                    <div key={tutorIndex}>
                      <div key={`${section.title}-${tutorIndex}`} className='flex gap-5 min-h-[48px]'>
                        <div
                          style={{
                            opacity: tutorIndex !== 0 ? 0 : 1, // 첫 번째 튜터만 제목 표시
                          }}
                          className='w-full text-neutral-800 text-sm font-medium leading-[1.5] tracking-[-0.02em]'
                        >
                          {section.title}
                        </div>
                        <div className='w-full'>
                          <div className='text-neutral-800 text-base font-bold leading-[1.5] tracking-[-0.02em]'>
                            {tutor.name}
                          </div>
                          <div className='text-zinc-600 text-sm font-medium leading-[1.5] tracking-[-0.02em]'>
                            {tutor.englishName}
                          </div>
                        </div>
                      </div>
                      {/* section의 자식이 홀수인 경우 하나 더 넣어주기 */}
                      {section.tutors.length % 2 !== 0 && tutorIndex === section.tutors.length - 1 && (
                        <div key={`${section.title}-empty-${tutorIndex}`} className='w-full h-[48px]' />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 데스크톱: 2열 배치 (더 넓은 간격) - VD tutor 3명씩 분할 적용 */}
          <div className='hidden lg:block'>
            <div className='space-y-9'>
              {(() => {
                const desktopSections = splitVDTutorForDesktop(sections)
                return Array.from({ length: Math.ceil(desktopSections.length / 2) }, (_, rowIndex) => (
                  <div key={rowIndex} className='flex flex-row gap-20'>
                    {desktopSections.slice(rowIndex * 2, rowIndex * 2 + 2).map((section, sectionIndex) => (
                      <div key={sectionIndex} className='flex-1 flex gap-20'>
                        <div className='w-full text-neutral-800 text-lg font-normal leading-[1.5] tracking-[-0.02em]'>
                          {section.title}
                        </div>
                        <div className='w-full space-y-3.5'>
                          {section.tutors.map((tutor, tutorIndex) => (
                            <div key={tutorIndex}>
                              <div className='text-neutral-800 text-lg font-bold leading-[1.5] tracking-[-0.02em]'>
                                {tutor.name}
                              </div>
                              <div className='text-zinc-600 text-lg font-normal leading-[1.5] tracking-[-0.02em]'>
                                {tutor.englishName}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
