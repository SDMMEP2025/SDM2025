'use client'

interface MediaContainerProps {
  type?: 'image' | 'video'
  src?: string
  alt?: string
}

export function MediaContainer({ type = 'image', src, alt = 'Media content' }: MediaContainerProps) {
  return (
    <div className="w-full aspect-[16/9] relative bg-zinc-600 overflow-hidden">
      {/* 실제 미디어가 있을 때 */}
      {src && (
        <>
          {type === 'image' ? (
            <img 
              src={src} 
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full">
              <iframe
                src={`${src}?background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&muted=1`}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={alt}
              />
            </div>
          )}
        </>
      )}
      
      {/* 플레이스홀더 (미디어가 없을 때) */}
      {!src && (
        <>
          {/* 플레이 버튼 아이콘 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* 큰 원 */}
            <div className="w-12 h-12 xs:w-7 xs:h-7 md:w-7 md:h-7 lg:w-12 lg:h-12 rounded-full border-[5.25px] xs:border-[2.80px] md:border-[2.80px] lg:border-[5.25px] border-white" />
            
            {/* 작은 원 */}
            <div className="w-3 h-3 xs:w-1.5 xs:h-1.5 md:w-1.5 md:h-1.5 lg:w-3 lg:h-3 absolute top-[21px] left-[21px] xs:top-[11px] xs:left-[11px] md:top-[11px] md:left-[11px] lg:top-[21px] lg:left-[21px] rounded-full border-[5.25px] xs:border-[2.80px] md:border-[2.80px] lg:border-[5.25px] border-white" />
            
            {/* 삼각형 */}
            <div className="w-10 h-6 xs:w-6 xs:h-3.5 md:w-6 md:h-3.5 lg:w-10 lg:h-6 absolute top-[35px] left-[21px] xs:top-[22px] xs:left-[11px] md:top-[22] md:left-[11px] lg:top-[35px] lg:left-[21px] border-[5.25px] xs:border-[2.80px] md:border-[2.80px] lg:border-[5.25px] border-white" />
          </div>
          
          {/* 해상도 텍스트 (PC에서만 표시) */}
          <div className="hidden lg:block absolute bottom-20 left-1/2 transform -translate-x-1/2 text-gray-400 text-4xl font-bold font-['Pretendard'] leading-10">
            1920*1080
          </div>
          
          {/* 해상도 텍스트 (태블릿에서만 표시) */}
          <div className="hidden md:block lg:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-xl font-bold font-['Pretendard'] leading-normal">
            768*432
          </div>
        </>
      )}
    </div>
  )
}