'use client'

interface SolutionSentenceProps {
  text: string
}

export function SolutionSentence({ text }: SolutionSentenceProps) {
  return (
    <div className="w-full px-[16px] py-[56px] md:px-[40px] md:py-[48px] lg:px-[160px] lg:py-[84px] xl:px-[240px] font-semibold text-center text-[36px] md:text-[40px] lg:text-[76px] tracking-[-0.02em] leading-[0.95] md:leading-none">
      {text}
    </div>
  )
}