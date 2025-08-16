'use client'
import {
  Header,
  Footer,
  Summary,
  MainImage,
  Divide,
  TitleBody,
  RightTitleBody,
  RightBody,
  MidBody,
  MidTitle,
  LeftTitle,
  MediaContainer,
  ImageGallery,
  Credit,
  CreditTutor,
  CreditThanksTo,
  ProjectNavigation,
  MobileNavigation,
  ArchiveSidebar,
  ArchivePoint,
  ArchiveImage,
  Image,
  Blank
} from '@/components/projects'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const tutorData = [
  {
    title: 'Advisory Professor',
    tutors: [
      { name: '김치헌', englishName: 'Chiheon Kim' },
      { name: '이문환', englishName: 'Moonhwan Lee' },
    ],
  },
  {
    title: 'VD tutor',
    tutors: [
      { name: '나하나', englishName: 'Hana Na' },
      { name: '권진형', englishName: 'Jinhyeong Kwon' },
      { name: '정재연', englishName: 'Jaeyun Jung' },
      { name: '김승우', englishName: 'Seungwoo Kim' },
      { name: '김지윤', englishName: 'Jiyoun Kim' },
    ],
  },
]

const thankstoData = [
  {
    title: 'Photographer',
    tutors: [{ name: '권진형', englishName: 'Jinhyeong Kwon' }],
  },
  {
    title: 'Model',
    tutors: [{ name: '이효재', englishName: 'Hyojae Lee' }],
  },
  {
    title: 'Textile',
    tutors: [
      { name: '김규림', englishName: 'Gyurim Kim' },
      { name: '박나은', englishName: 'Naeun Pak' },
    ],
  },
]

const points = [
  {
    id: '1',
    top: '50%',
    left: '50%',
    images: [
      '/images/archive-process-1.png',
      '/images/archive-process-2.png',
      '/images/archive-process-3.png',
      '/images/archive-process-4.png',
      '/images/archive-process-5.png',
    ],
  },
]

export default function Page() {
  const [isMouseInRightThird, setIsMouseInRightThird] = useState(false)
  const [isSidebarShown, setIsSidebarShown] = useState(true)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [currentPoint, setCurrentPoint] = useState(
    points[0], // 초기값으로 첫 번째 포인트 설정
  )

  const designedByRef = useRef<HTMLDivElement>(null)

  const inView = useInView(designedByRef, {
    amount: 0.1, // 10%가 보일 때 inView 상태 변경
    once: false, // 한번만 감지하지 않도록 설정
  })

  useEffect(() => {
    if (inView) {
      setIsSidebarShown(false) // 'Designed By' 섹션이 보일 때 사이드바 숨김
    } else {
      setIsSidebarShown(true) // 'Designed By' 섹션이 보이지 않을 때 사이드바 표시
    }
  }, [inView, setIsSidebarShown])

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      setIsMobile(width < 768) // 768px 미만은 모바일
      setIsTablet(width >= 768 && width < 1440) // 768px 이상 1440px 미만은 테블릿
    }

    checkDeviceType()
    window.addEventListener('resize', checkDeviceType)

    return () => {
      window.removeEventListener('resize', checkDeviceType)
    }
  }, [])

  // 마우스 위치 추적 (PC에서만)
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // 모바일이나 테블릿이면 마우스 추적하지 않음
      if (isMobile || isTablet) return

      const windowWidth = window.innerWidth
      const mouseX = event.clientX

      // 오른쪽 1/3 지점 계산 (화면 너비의 2/3 지점부터)
      const rightThirdThreshold = windowWidth * (2 / 3)

      setIsMouseInRightThird(mouseX >= rightThirdThreshold)
    }

    // 마우스 이동 이벤트 리스너 추가
    window.addEventListener('mousemove', handleMouseMove)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMobile, isTablet])

  // 사이드바 확장 상태 변경 핸들러
  const handleSidebarExpandedChange = (expanded: boolean) => {
    setIsSidebarExpanded(expanded)
  }

  // 사이드바 표시 여부 결정:
  // - 모바일에서는 항상 true
  // - 테블릿에서는 항상 true (새로 추가된 조건)
  // - PC에서는 마우스가 오른쪽 1/3에 있거나 확장된 상태일 때
  const shouldShowSidebar = isMobile || isTablet || isMouseInRightThird || isSidebarExpanded

  return (
    <>
      <Blank />
      <Header />
      <Summary
        svgSrc='/images/logo/AutonomyPractice_logo.svg'
        className='w-[132px] md:w-[180px] lg:w-[clamp(180px,16vw,229px)]'
        title={['오토노미 프랙티스', 'Act Then Build']}
        description='Autonomy Practice는 소재를 다루는 방식에 질문을 던지는 실험적 신발 브랜드입니다. 우리는 CMF를 기존의 영역에 그치지 않고, 환경에 반응해 형상을 조율하는 매개로 바라봅니다. 이러한 관점 아래, 형상기억 폴리머(SMP)를 적용한 자가 해체 구조의 신발을 설계했습니다. 신발이 스스로 구성되고 해체되는 이 구조는, 생산과 소비의 경계를 다시 그리는 하나의 실천입니다.'
        credits='풍제석, 이민희, 하승민, 정민영, 정유진'
      />
      <MainImage Image='/images/projects/cruise/image1.png' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Divide title='Context' number='01' className='text-[#949598]' />
      <MidBody
        align='left'
        content='CMF는 제품의 시각적, 촉각적 완성도를 높이는 요소로 자리해 왔습니다. Autonomy Practice는 이 역할을 재탐색하며, CMF를 주변 환경에 반응하고 제품의 상태를 변화시키는 능동적 재료로 탐구합니다. 이러한 관점은 온도에 반응하여 형태가 바뀌는 SMP(형상기억 폴리머)에 대한 소재 연구로 이어졌고, 나아가 가변적 물성과 제품의 만남에서 비롯되는 새로운 가능성을 모색합니다.'
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Divide title='Structure' number='02' className='text-[#949598]' />
      <MidBody
        align='left'
        content={
          'SMP(형상기억 폴리머)는 25°C에서 90°C 사이에 형상기억 온도를 설정할 수 있습니다. 형상기억 온도에 도달한 SMP는 부드러워지며 변형되고, 온도가 내려가면 그 상태로 경화됩니다. 이후 다시 형상기억 온도에 도달하면 원형으로 되돌아갑니다. 우리는 다양한 샘플들을 만져보고, 프로토타입을 직접 신어 보며 테스트하는 과정을 거쳐 80°C라는 형상기억 온도를 설정하게 되었습니다.\n\n이를 바탕으로 고온에서 조립하고, 상온에서 안정적으로 기능하며, 고온에서 다시 간단하게 해체가 가능한 구조를 구현하였습니다. 기존의 접착 구조를 조립 구조로 전환하는 우리의 실천은 신발과 같은 복합 소재 공산품의 생산과 소비 과정에 새로운 방향이 될 수 있습니다.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Divide title='Practice Log' number='03' className='text-[#949598]' />
      <MidBody
        align='left'
        content={
          'Autonomy Practice는 소재를 자율적인 시각으로 해석하고, 그 해석이 어떻게 구조와 형상으로 구체화하는지를 탐색해 왔습니다. 능동적인 물성과 제품의 만남에서 발생한 일련의 설계 과정을 기록하며, 그 흐름을 하나의 실천으로 공유합니다.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '풍제석',
              role: 'PL · ID',
              englishName: 'Jeseok Poong',
              profileImage: '/images/profile/jeseokpoong.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/jspoong',
                instagram: 'https://instagram.com/jeseok_id',
              },
            },
            {
              name: '이민희',
              role: 'BX',
              englishName: 'Minhee Lee',
              profileImage: '/images/profile/minheelee.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/minhe01295a2b',
                instagram: 'https://instagram.com/minheecar',
              },
            },
            {
              name: '하승민',
              role: 'ID',
              englishName: 'Seungmin Ha',
              profileImage: '/images/profile/seungminha.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/haseungmin',
                instagram: 'https://instagram.com/Pro.__.dukt',
              },
            },
            {
              name: '정민영',
              role: 'ID',
              englishName: 'Minyoung Jeong',
              profileImage: '/images/profile/minyoungjeong.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/meenzro',
                instagram: 'https://instagram.com/meeenork',
              },
            },
            {
              name: '정유진',
              role: 'VD',
              englishName: 'Yujin Jung',
              profileImage: '/images/profile/yujinjung.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/jungyujin_',
                instagram: 'https://instagram.com/ujin_tonic',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/projects/merlin' }}
          nextItem={{ label: 'Next', url: '/projects/mizi' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'Merlin',
            koreanName: '멀린',
            linkUrl: '/projects/merlin',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'MIZI',
            koreanName: '미지',
            linkUrl: '/projects/mizi',
          }}
        />
        <AnimatePresence>
          {shouldShowSidebar && (
            <ArchiveSidebar
              isVisible={isSidebarShown}
              currentPoint={currentPoint}
              onExpandedChange={handleSidebarExpandedChange}
            />
          )}
        </AnimatePresence>
        <Footer />
      </div>
    </>
  )
}
