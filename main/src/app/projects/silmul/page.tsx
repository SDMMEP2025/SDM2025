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
        title={['실물', 'Turning real senses into real objects']}
        description={
          <>
            Silmul은 자신의 실제 감각과 경험을 실물로 구현할 수 있는 새로운 창작 과정을 제안합니다. 나의 감각과 경험이
            만질 수 있는 실체가 될 때, 창작은 더 이상 어렵지 않고 계속 이어질 수 있을 거예요. <br />
            Realize Real Sense into Real Object, Silmul!
          </>
        }
        credits='김선일, 현수련, 박세연, 서현빈, 윤현경'
      />
      <MainImage />
      <Divide title='Background' number='01' />
      <RightTitleBody
        title='창작을 망설이게 하는 심리적 부담감'
        text={
          <>
            무언가를 만들고 표현하고자 하는 근원적인 창작 욕구는 누구에게나 존재합니다.
            <br />
            <br />
            그런데도 사람들은 창작을 막연히 ‘재능 있는 사람들의 일’로 인식하고, 쉽게 시작하기 어려운 일로 느끼곤 하죠.
            <br />
            <br />
            이는 창작을 ‘무(無)에서 유(有)를 창조하는 특별한 행위’로 생각하는 데서 비롯됩니다.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide title='Discover' number='02' />
      <MidBody
        align='left'
        content={
          <>
            그렇다면 창작은 정말 무(無)에서 유(有)를 만드는 과정일까요? 그렇지 않습니다.
            <br />
            <br />
            창작은 잠재된 경험의 총체가 표현되는 ‘유(有)에서 유(有)의 과정’입니다. 대부분의 창작은 완전한 백지상태에서
            출발하지 않고, 우리가 평소에 느끼는 감각과 축적된 경험 그리고 맥락을 토대로 이루어지기 때문이죠.
            <br />
            <br />
            특히 디지털 시대의 AI 창작 메커니즘을 살펴보면, 유(有)에서 유(有)의 창작 방식이 명확하게 드러납니다. 이러한
            도구와 기술의 발전으로 창작에 대한 진입 장벽 역시 함께 완화되고 있음을 알 수 있죠.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide title='Limitation' number='03' />
      <MidBody align='center' content={<>그러나, 디지털 시대의 창작에 대한 아쉬움의 목소리는 여전히 존재합니다.</>} />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <LeftTitle
        text={
          <a href='https://bio.link/silmul' className='hover:underline' target='_blank'>
            ▶︎ A more detailed story of Silmul
          </a>
        }
      />
      <Divide title='Concept' number='04' />
      <LeftTitle
        text={
          <>
            Turning real senses into real objects , Silmul <br />
            실감을 실물로 구현하다
          </>
        }
      />
      <MidBody
        align='left'
        content={
          <>
            실감 ¹ : 개인이 이미 가지고 있는 감각, 기억, 취향 등 잠재된 경험의 총체
            <br />
            실물 ² : 흩어져 있던 경험을 보고 느끼고 만질 수 있는 구체적 형태로 만드는 것
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />

      <TitleBody
        title="'나의 순간'에 몰입하는 방법'"
        text="'Slac은 언제나 소리와 함께하는 Z세대가 소리로 '나의 순간'에 몰입하는 방법을 제안합니다. 모든 순간 나를 가장 가까이서 이해하는 웨어러블 오디오를 통해 나와 닮아가는 소리는 마치 나에게 딱 맞는 옷을 입는 것처럼 변화합니다. Slac과 함께 디렉터가 되어, 소리로 완성되는 나만의 #Scene을 만나보세요!"
      />
      <RightBody />
      <MidBody
        align='left'
        content="Slac은 언제나 소리와 함께하는 Z세대가 소리로 '나의 순간'에 몰입하는 방법을 제안합니다. 모든 순간 나를 가장 가까이서 이해하는 웨어러블 오디오를 통해 나와 닮아가는 소리는 마치 나에게 딱 맞는 옷을 입는 것처럼 변화합니다. Slac과 함께 디렉터가 되어, 소리로 완성되는 나만의 #Scene을 만나보세요!"
      />
      <MidTitle align='center' />
      <MidTitle align='left' />
      <MediaContainer type='video' src='https://player.vimeo.com/video/844128999' alt='이곳에 비디오를' />
      <ImageGallery images={['/images/image1.jpeg', '/images/image2.jpeg', '/images/image3.jpeg']} />
      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '김선일',
              role: 'PL · ID',
              englishName: 'Sunil Kim',
              profileImage: '/images/profile/sunilkim.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/sun_1',
                instagram: 'https://instagram.com/sun__1d_ay',
              },
            },
            {
              name: '현수련',
              role: 'VD',
              englishName: 'Suryun Hyeon',
              profileImage: '/images/profile/suryunhyeon.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/hyeonsuryun/',
                behance: 'https://www.behance.net/SuryunHyeon',
                instagram: 'https://instagram.com/hyeonsuryun',
              },
            },
            {
              name: '박세연',
              role: 'ID',
              englishName: 'Seyeon Park',
              profileImage: '/images/profile/seyeonpark.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/pseyeonn',
                instagram: 'https://instagram.com/1.30ps',
              },
            },
            {
              name: '서현빈',
              role: 'ID',
              englishName: 'HyunBin Seo',
              profileImage: '/images/profile/hyunbinseo.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/%EC%84%9C%ED%98%84%EB%B9%88-seo-a493b8331/',
                behance: 'https://www.behance.net/kyoma',
                instagram: 'https://instagram.com/_kyoma___',
              },
            },
            {
              name: '윤현경',
              role: 'UX',
              englishName: 'Hyeongyeong Yun',
              profileImage: '/images/profile/hyeongyeongyun.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/yink38',
                instagram: 'https://instagram.com/stigma___',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/projects/layon' }}
          nextItem={{ label: 'Next', url: '/projects/autonomy-practice' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'MEET',
            koreanName: '미트',
            linkUrl: '/projects/layon',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'CONNECT',
            koreanName: '연결',
            linkUrl: '/projects/autonomy-practice',
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
