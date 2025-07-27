'use client'

interface DivideProps {
  title: string
  number: string
  className?: string
}

export function Divide({ title, number, className = '' }: DivideProps) {
  return (
    <div className={`w-full px-4 py-9 xs:px-4 xs:py-9 md:px-10 md:py-14 lg:px-40 lg:py-9 xl:px-[240px] xl:py-[84px] bg-white flex justify-between items-center overflow-hidden ${className}`}>
      <div className="text-neutral-800 text-sm xs:text-sm md:text-sm lg:text-lg font-semibold leading-snug xs:leading-snug md:leading-tight lg:leading-relaxed">
        {title}
      </div>
      <div className="text-right text-neutral-800 text-sm xs:text-sm md:text-sm lg:text-lg font-semibold leading-snug xs:leading-snug md:leading-tight lg:leading-relaxed">
        {number}
      </div>
    </div>
  )
}