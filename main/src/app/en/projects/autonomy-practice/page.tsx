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
      <Header />
      <Summary
        svgSrc='/images/logo/AutonomyPractice_logo.svg'
        className='w-[90px] md:w-[180px] lg:w-[clamp(180px,16vw,229px)]'
        title={['Autonomy Practice', 'Act Then Build']}
        description='Autonomy Practice is an experimental footwear brand that challenges how materials are used. We treat CMF not just as a surface detail, but as a responsive element that adapts to its environment. This belief led us to design self-disassembling shoes using shape memory polymers (SMP). Footwear that assembles and comes apart on its own—redefining the boundary between creation and consumption.'
        credits='Jeseok Poong, Minhee Lee, Seungmin Ha, Minyoung Jeong, Yujin Jung'
      />
      <MainImage Image='/images/projects/cruise/image1.png' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Divide title='Context' number='01' />
      <MidBody
        align='left'
        content='CMF has long been about enhancing how products look and feel. At Autonomy Practice, we redefine our role, seeing CMF as an active material that responds to its environment and transforms the product itself. This perspective inspired us to explore shape memory polymers (SMP), materials that change shape with temperature. By blending adaptive materials with product design, we’re discovering new ways to shape interaction, meaning, and use.'
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Divide title='Structure' number='02' />
      <MidBody
        align='left'
        content={
          'Shape Memory Polymers (SMP) can be set to react between 25°C and 90°C. When heated to a certain temperature, SMP becomes soft and flexible. When it cools down, it hardens in that shape. Heat it again, and it goes back to its original form. After testing, we chose 80°C as the best temperature for our design.\n\nBased on this, we made a shoe that can be put together when hot, stays strong at room temperature, and can be taken apart easily by heating again. We get rid of glued construction and move to an assembly-based design. This change offers a new way to make and use complex products like footwear. It transforms the whole process, from production to how people experience the product.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Divide title='Practice Log' number='03' />
      <MidBody
        align='left'
        content={
          'Autonomy Practice approaches materials with autonomy, exploring how this shapes structure and form. We record the design journey that comes from the interaction between dynamic materials and products, and share it as a unified process.'
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
          previousItem={{ label: 'Previous', url: '/en/projects/merlin' }}
          nextItem={{ label: 'Next', url: '/en/projects/mizi' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'Merlin',
            koreanName: '멀린',
            linkUrl: '/en/projects/merlin',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'MIZI',
            koreanName: '미지',
            linkUrl: '/en/projects/mizi',
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
