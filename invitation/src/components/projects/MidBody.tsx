'use client'

interface MidBodyProps {
  content: string
  className?: string
}

export function MidBody({ content, className = '' }: MidBodyProps) {
  return (
    <div className={`px-4 py-14 xs:px-4 xs:py-14 md:px-32 md:py-14 lg:px-[160px] lg:py-[84px] xl:px-[240px] xl:py-[84px] bg-white flex justify-center items-center gap-2.5 overflow-hidden xs:overflow-visible md:overflow-hidden lg:overflow-hidden ${className}`}>
      <div className="xs:w-full lg:w-[760px] text-center text-neutral-800 text-base xs:text-base md:text-base lg:text-lg font-normal xs:font-normal md:font-medium lg:font-medium leading-7 xs:leading-7 md:leading-relaxed lg:leading-relaxed">
        {content}
      </div>
    </div>
  )
}