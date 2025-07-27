'use client'

interface SolutionSentenceProps {
  text: string
}

export function SolutionSentence({ text }: SolutionSentenceProps) {
  return (
    <div className="w-full px-[3.90vw] py-[56px] md:px-[5.21vw] md:py-[48px] lg:px-[11.11vw] lg:py-[84px] xl:px-[12.50vw] font-semibold text-center text-[36px] md:text-[40px] lg:text-[76px] tracking-[-0.02em] leading-[0.95] md:leading-none">
      {text}
    </div>
  )
}