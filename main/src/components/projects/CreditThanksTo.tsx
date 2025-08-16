'use client'

import classNames from 'classnames'
import React from 'react'

interface Tutor {
  name: string
  englishName: string
}

type SingleSection = {
  title: string
  tutors: Tutor[]
}

type GroupSection = {
  subSections: SingleSection[]
}

type Section = SingleSection | GroupSection

interface CreditTutorProps {
  title?: string
  sections: Section[]
}

export function CreditThanksTo({ title = 'Thanks to', sections }: CreditTutorProps) {
  const renderTitle = (t: string) =>
    t.split('\n').map((line, idx) => (
      <span key={idx} className="block">
        {line}
      </span>
    ))

  const splitVDTutorForDesktop = (input: Section[]): Section[] => {
    const out: Section[] = []
    input.forEach((section) => {
      if ('subSections' in section) {
        // 그룹 섹션은 그대로 밀어넣기
        out.push(section)
      } else if (section.title === 'VD tutor' && section.tutors.length > 3) {
        for (let i = 0; i < section.tutors.length; i += 3) {
          out.push({
            title: section.title,
            tutors: section.tutors.slice(i, i + 3),
          })
        }
      } else {
        out.push(section)
      }
    })
    return out
  }
  const MobileSection = ({ section }: { section: Section }) => {
    if ('subSections' in section) {
      return (
        <div className="flex flex-col gap-[36px]">
          {section.subSections.map((sub, i) => (
            <MobileSection key={i} section={sub} />
          ))}
        </div>
      )
    }
    return (
      <>
        {section.tutors.map((tutor, idx) => (
          <div key={`${section.title}-${idx}`} className="flex justify-between gap-4">
            <div
              style={{ opacity: idx !== 0 ? 0 : 1 }}
              className="w-full text-neutral-800 text-sm font-medium leading-[1.6] tracking-[-0.02em]"
            >
              {renderTitle(section.title)}
            </div>
            <div className="w-full">
              <div className="text-neutral-800 text-base font-bold leading-[1.6] tracking-[-0.02em]">
                {tutor.name}
              </div>
              <div className="text-zinc-600 text-sm font-regular leading-[1.6] tracking-[-0.02em]">
                {tutor.englishName}
              </div>
            </div>
          </div>
        ))}
      </>
    )
  }

  const TabletSectionBlock = ({ section }: { section: Section }) => {
    if ('subSections' in section) {
      return (
        <div className="flex flex-col gap-5">
          {section.subSections.map((sub, i) => (
            <TabletSectionBlock key={i} section={sub} />
          ))}
        </div>
      )
    }
    return (
      <div className="flex flex-col gap-5 min-h-[48px]">
        {section.tutors.map((tutor, idx) => (
          <div key={idx}>
            <div className="flex gap-5 min-h-[48px]">
              <div
                style={{ opacity: idx !== 0 ? 0 : 1 }}
                className="w-full text-neutral-800 text-sm font-medium leading-[1.5] tracking-[-0.02em]"
              >
                {renderTitle(section.title)}
              </div>
              <div className="w-full">
                <div className="text-neutral-800 text-base font-bold leading-[1.5] tracking-[-0.02em]">
                  {tutor.name}
                </div>
                <div className="text-zinc-600 text-sm font-medium leading-[1.5] tracking-[-0.02em]">
                  {tutor.englishName}
                </div>
              </div>
            </div>
          </div>
        ))}
        {section.tutors.length % 2 !== 0 && <div className="w-full h-[48px]" />}
      </div>
    )
  }

  const DesktopColumnCard = ({ section }: { section: Section }) => {
    if ('subSections' in section) {
      return (
        <div className="flex-1 w-fit flex flex-col gap-8">
          {section.subSections.map((sub, i) => (
            <div key={i} className="flex gap-20">
              <div className="w-full text-neutral-800 text-lg font-normal leading-[1.5] tracking-[-0.02em]">
                {renderTitle(sub.title)}
              </div>
              <div className="w-full space-y-3.5">
                {sub.tutors.map((tutor, idx) => (
                  <div key={idx}>
                    <div className="text-neutral-800 text-lg font-bold leading-[1.5] tracking-[-0.02em]">
                      {tutor.name}
                    </div>
                    <div className="text-zinc-600 text-lg font-normal leading-[1.5] tracking-[-0.02em]">
                      {tutor.englishName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div className="flex-1 w-fit flex gap-20">
        <div className="w-full text-neutral-800 text-lg font-normal leading-[1.5] tracking-[-0.02em]">
          {renderTitle(section.title)}
        </div>
        <div className="w-full space-y-3.5">
          {section.tutors.map((tutor, idx) => (
            <div key={idx}>
              <div className="text-neutral-800 text-lg font-bold leading-[1.5] tracking-[-0.02em]">
                {tutor.name}
              </div>
              <div className="text-zinc-600 text-lg font-normal leading-[1.5] tracking-[-0.02em]">
                {tutor.englishName}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const DesktopRows = ({ data }: { data: Section[] }) => {
    const desktopSections = splitVDTutorForDesktop(data)
    const rows = Math.ceil(desktopSections.length / 2)
    return (
      <div className="space-y-9">
        {Array.from({ length: rows }, (_, rowIdx) => {
          const cols = desktopSections.slice(rowIdx * 2, rowIdx * 2 + 2)
          return (
            <div key={rowIdx} className="flex flex-row gap-20">
              {cols.map((section, idx) => (
                <DesktopColumnCard key={rowIdx + '-' + idx} section={section} />
              ))}
              {cols.length === 1 && <div className="flex-1 w-fit flex gap-20" />}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={classNames(
        'w-full bg-white',
        // mobile
        'px-[4.10vw] pt-0 pb-[112px]',
        // tablet
        'md:px-[5.2vw] md:pb-[112px]',
        // desktop
        'lg:px-[16.32vw] lg:pb-[168px]',
        // xl
        'xl:px-[16.67vw]',
      )}
    >
      <div className="flex flex-col md:flex-row lg:justify-between">
        <div className="mb-9 lg:mb-0 w-[100%] md:w-[25%] lg:w-[20%]">
          <h2 className="text-neutral-800 text-base lg:text-lg font-bold leading-[1.6] lg:leading-[1.5] tracking-[-0.02em]">
            {title}
          </h2>
        </div>

        <div className="w-[100%] md:w-[75%] lg:w-[80%]">
          <div className="flex flex-col gap-[36px] md:hidden">
            {sections.map((section, idx) => (
              <MobileSection key={idx} section={section} />
            ))}
          </div>

          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-2 gap-y-5 gap-x-10">
              {sections.map((section, idx) => (
                <TabletSectionBlock key={idx} section={section} />
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <DesktopRows data={sections} />
          </div>
        </div>
      </div>
    </div>
  )
}
