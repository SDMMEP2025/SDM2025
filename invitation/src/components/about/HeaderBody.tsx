'use client'

interface HeaderBodyProps {
  title: string | string[]
  description: string
  className?: string
}

export function HeaderBody({ title, description, className = '' }: HeaderBodyProps) {
  const titleLines = Array.isArray(title) ? title : [title]

  return (
    <div className={`w-full px-4 py-14 md:px-10 md:py-12 lg:px-40 lg:py-[84px] xl:px-[240px] bg-white flex flex-col justify-center items-center gap-[10px] md:gap-[20px] lg:gap-6 ${className}`}>
      <div className="w-full md:w-[688px] lg:w-[790px] font-semibold text-center text-4xl md:text-[40px] lg:text-[76px] tracking-[-0.02em] leading-none">
        {titleLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className="w-full md:w-[512px] lg:w-[780px] font-regular text-center text-[17px] md:font-medium lg:text-[18px] tracking-[-0.02em] leading-normal break-keep">
        {description}
      </div>
    </div>
  )
}