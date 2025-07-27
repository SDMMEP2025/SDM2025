'use client'

interface DivideProps {
  title: string
  number: string
  className?: string
}

export function Divide({ title, number, className = '' }: DivideProps) {
  return (
    <div className={`w-full px-[3.37vw] py-9 md:px-[5.21vw] md:py-14 lg:px-[11.11vw]  lg:py-9 xl:px-[18.75vw] xl:py-[84px]  bg-white flex justify-between items-center overflow-hidden ${className}`}>
      <div className="text-neutral-800 text-sm xs:text-sm md:text-sm lg:text-lg font-semibold leading-snug xs:leading-snug md:leading-tight lg:leading-relaxed">
        {title}
      </div>
      <div className="text-right text-neutral-800 text-sm xs:text-sm md:text-sm lg:text-lg font-semibold leading-snug xs:leading-snug md:leading-tight lg:leading-relaxed">
        {number}
      </div>
    </div>
  )
}