'use client'
import { motion } from 'framer-motion'

interface RotatedPaperDemoProps {
  onDirectionsClick: () => void;
  displayName: string; // 새로 추가
}

export function RotatedPaper({ className = '' }) {
  return (
    <div
      className={`
      w-[388.0000151880226px] h-[70dvh] bg-white rounded-lg
      md:w-[640.7787222419632px] md:h-[690.6728853097492px]
      landscape:md:w-[880.0000262670924px] landscape:md:h-[537.9999787440715px]
      lg:w-[880.0000262670924px] lg:h-[537.9999787440715px]
      ${className}
    `}
    ></div>
  )
}

export default function RotatedPaperDemo({ onDirectionsClick, displayName }: RotatedPaperDemoProps) {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-10 overflow-hidden'>
      <div className='relative transform -rotate-6'>
        <RotatedPaper />
        <div className='absolute inset-0 flex flex-col items-center justify-center p-8 gap-[76px] md:gap-[82px] lg:gap-[88px] text-black z-[400] transform rotate-6'>
          <div className='text-center w-[79%] font-medium text-[17px] md:text-[18px] lg:text-[22px]'>
            <p className='leading-relaxed break-keep'>안녕하세요.</p>
                <p className='break-keep'>2025 MEP 〈Newformative〉에 {displayName}님을 초대합니다.</p>
            <p>
              전시는 8월 22일부터 27일까지, 삼성전자 서울 R&D 캠퍼스 A타워 2층, 이노베이션 스튜디오에서 진행됩니다.
              <br className='md:block landscape:md:hidden lg:hidden' />
              소중한 발걸음으로 자리를 빛내주세요.
            </p>
          </div>
          <div className='inline-flex flex-col justify-center items-center gap-3 text-[17px] md:text-[18px]'>
            <button
              onClick={onDirectionsClick}
              className="text-zinc-600 text-base lg:text-lg font-medium underline leading-relaxed hover:text-zinc-800 transition-colors"
            >
              오시는 길
            </button>
            <a
              href='https://www.newformative.com/'
              target='_blank'
              rel='noopener noreferrer'
              className="text-zinc-600 text-base lg:text-lg font-medium underline leading-relaxed hover:text-zinc-800 transition-colors"
            >
              웹사이트 보러가기
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
