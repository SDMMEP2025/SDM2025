import classNames from "classnames"

interface SummaryProps {
  title?: string[]
  description?: string | React.ReactNode
  credits?: string
  SVGLogo?: React.ComponentType<{ className?: string }> // 기존 그대로 유지
  svgSrc?: string // ← 추가: 파일 경로
  logoHeights?: { base: number; md?: number; lg?: number; xl?: number }
  className?: string
}

export function Summary({
  title = ['Default Title'],
  description = 'Default description text goes here.',
  credits = 'Default credits',
  SVGLogo,
  svgSrc,
  logoHeights = { base: 72, md: 90, lg: 120, xl: 140 },
  className=''
}: SummaryProps) {
  return (
    <div className='w-full bg-white flex justify-center items-center px-[4.10vw] py-[56px] md:px-[5.2vw] md:py-[56px] lg:px-[11.1vw] lg:py-[84px] xl:px-[12.5vw] xl:py-[84px]'>
      <div className='flex justify-between items-start w-fit flex-col gap-[20px] md:flex-row md:gap-0'>
        <div
          className={classNames(
            'h-full flex flex-col justify-start items-start w-fit',
          )}
        >
          {svgSrc ? (
            <img
              src={svgSrc}
              alt=''
              className={classNames('block w-auto max-w-full overflow-visible', className)}
              draggable={false}
            />
          ) : SVGLogo ? (
            <SVGLogo className='block w-auto max-w-full overflow-visible' />
          ) : null}
        </div>

        {/* Right: 텍스트 영역 */}
        <div className='flex flex-col w-full gap-[16px] md:w-[clamp(423px,55%,644px)] md:gap-[8px] lg:gap-[16px] lg:w-[clamp(644px,65%,832px)] xl:gap-[16px]'>
          <div className='flex flex-col'>
            {title.map((t, i) => (
              <span key={i} className='font-bold text-[28px] leading-[1.4] tracking-[-0.56px] md:text-[24px] md:leading-[1.5] md:tracking-[-0.48px] lg:text-[28px] lg:leading-[1.4] lg:tracking-[-0.56px] xl:text-[28px] xl:leading-[1.5] xl:tracking-[-0.56px]'>
                {t}
              </span>
            ))}
          </div>

          <p className='text-[17px] leading-[1.6] tracking-[-0.34px] font-normal mt-[20px] md:text-[18px] md:leading-[1.5] md:tracking-[-0.36px] md:font-medium md:mt-0 lg:text-[22px] lg:leading-[1.5] lg:tracking-[-0.44px] lg:font-medium lg:mt-0 xl:text-[22px] xl:leading-[1.5] xl:tracking-[-0.44px] xl:font-medium xl:mt-0'>
            {description}
          </p>

          <p className='text-zinc-600 text-[14px] leading-[1.6] tracking-[-0.28px] mt-0 md:text-[14px] md:leading-[1.5] md:tracking-[-0.28px] md:mt-[8px] lg:text-[18px] lg:leading-[1.5] lg:tracking-[-0.36px] lg:mt-0 xl:text-[18px] xl:leading-[1.5] xl:tracking-[-0.36px] xl:mt-0'>
            {credits}
          </p>
        </div>
      </div>
    </div>
  )
}
