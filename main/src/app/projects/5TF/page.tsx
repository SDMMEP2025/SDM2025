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
} from '@/components/projects'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const tutorData = [
  {
    title: 'Advisory Professor',
    tutors: [
      { name: '홍길동', englishName: 'Gildong Hong' },
      { name: '김철수', englishName: 'Cheolsu Kim' },
    ],
  },
  {
    title: 'UX tutor',
    tutors: [{ name: '이영희', englishName: 'Younghee Lee' }],
  },
  {
    title: 'VD tutor',
    tutors: [
      { name: '박민수', englishName: 'Minsu Park' },
      { name: '최지은', englishName: 'Jieun Choi' },
      { name: '최지은', englishName: 'Jieun Choi' },
      { name: '최지은', englishName: 'Jieun Choi' },
    ],
  },
]

const thankstoData = [
  {
    title: 'VD tutor',
    tutors: [
      { name: '박민수', englishName: 'Minsu Park' },
      { name: '최지은', englishName: 'Jieun Choi' },
      { name: '최지은', englishName: 'Jieun Choi' },
      { name: '최지은', englishName: 'Jieun Choi' },
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [currentPoint, setCurrentPoint] = useState(
    points[0], // 초기값으로 첫 번째 포인트 설정
  )

  const isAtBottom = useScrollAtBottom(10)

  // 디바이스 타입 체크
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
      <Summary />
      <MainImage />
      <Divide title='Background' number='01' />
      <TitleBody
        title="'나의 순간'에 몰입하는 방법'"
        text="'Slac은 언제나 소리와 함께하는 Z세대가 소리로 '나의 순간'에 몰입하는 방법을 제안합니다. 모든 순간 나를 가장 가까이서 이해하는 웨어러블 오디오를 통해 나와 닮아가는 소리는 마치 나에게 딱 맞는 옷을 입는 것처럼 변화합니다. Slac과 함께 디렉터가 되어, 소리로 완성되는 나만의 #Scene을 만나보세요!"
      />
      <RightTitleBody />
      <RightBody />
      <MidBody content="Slac은 언제나 소리와 함께하는 Z세대가 소리로 '나의 순간'에 몰입하는 방법을 제안합니다. 모든 순간 나를 가장 가까이서 이해하는 웨어러블 오디오를 통해 나와 닮아가는 소리는 마치 나에게 딱 맞는 옷을 입는 것처럼 변화합니다. Slac과 함께 디렉터가 되어, 소리로 완성되는 나만의 #Scene을 만나보세요!" />
      <MidTitle />
      <LeftTitle />
      <MediaContainer type='video' src='https://player.vimeo.com/video/844128999' alt='이곳에 비디오를' />
      <ImageGallery images={['/images/image1.jpeg', '/images/image2.jpeg', '/images/image3.jpeg']} />
      <Credit
        title='Designed By'
        members={[
          {
            name: '윤여준',
            role: 'PL · ID',
            englishName: 'Yeojun Yun',
            profileImage: '/images/profile/yeojunyun.png',
            socialLinks: {
              linkedin: '',
              behance: 'https://www.behance.net/yjydesign',
              instagram: 'https://instagram.com/jun_e1ght',
            },
          },
          {
            name: '강형구',
            role: 'ID',
            englishName: 'HyungGoo Kang',
            profileImage: '/images/profile/hyunggookang.png',
            socialLinks: {
              linkedin: '',
              behance: 'https://www.behance.net/mikekang',
              instagram: 'https://instagram.com/imsii_id',
            },
          },
          {
            name: '권민지',
            role: 'UX',
            englishName: 'Minji Kwon',
            profileImage: '/images/profile/minjikwon.png',
            socialLinks: {
              linkedin: '',
              behance: 'https://www.behance.net/noeyeono',
              instagram: 'https://instagram.com/or.noey',
            },
          },
          {
            name: '백채영',
            role: 'VD',
            englishName: 'Chaeyoung Baek',
            profileImage: '/images/profile/chaeyoungbaek.png',
            socialLinks: {
              linkedin: '',
              behance: 'https://www.behance.net/baekchaeyoung',
              instagram: 'https://instagram.com/100__chaeyoung',
            },
          },
          {
            name: '정민서',
            role: 'ID',
            englishName: 'Minseo Jung',
            profileImage: '/images/profile/minseojung.png',
            socialLinks: {
              linkedin: '',
              behance: 'https://www.behance.net/msj',
              instagram: 'https://instagram.com/mseo_119',
            },
          },
        ]}
      />
      <CreditTutor title='Tutor' sections={tutorData} />
      <CreditThanksTo title='Thanks to' sections={thankstoData} />
      <MobileNavigation />
      <ProjectNavigation />
      <AnimatePresence>
        {shouldShowSidebar && (
          <ArchiveSidebar
            isVisible={!isAtBottom}
            currentPoint={currentPoint}
            onExpandedChange={handleSidebarExpandedChange}
          />
        )}
      </AnimatePresence>
      <Footer />
    </>
  )
}
