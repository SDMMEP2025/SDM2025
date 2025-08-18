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
  Blank,
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
    title: 'ID tutor',
    tutors: [
      { name: '구형준', englishName: 'Hyungjun Koo' },
      { name: '송동환', englishName: 'Donghwan Song' },
    ],
  },
  {
    title: 'UX tutor',
    tutors: [{ name: '박지해', englishName: 'Jihae Park' }],
  },
]

const thankstoData = [
  {
    title: 'Photographer',
    tutors: [{ name: '권진형', englishName: 'Jinhyeong Kwon' }],
  },
  {
    title: 'Adviser',
    tutors: [
      { name: '노영하', englishName: 'Youngha Rho' },
      { name: '서아현', englishName: 'A hyun Seo' },
      { name: '김도아', englishName: 'Doa Kim' },
      { name: '문기섭', englishName: 'Kisub Moon' },
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
        svgSrc='/images/logo/Potrik_logo.svg'
        title={['포트릭', 'No pack, No stop. Just POTRIK']}
        description={
          <>
            POTRIK은 손에 들고 다니는 짐이 사라진 새로운 라이프스타일을 제공합니다. 복잡한 예약도, 물건을 들고 이동할
            필요도 없이, 가볍게 호출하여 내 동선 위에서 자유롭게 짐을 보내고 받을 수 있습니다. POTRIK과 함께라면 양 손은
            가벼워지고, 여정은 더 자유로워집니다.
            <br />
            <br />
            순간이 가벼워지는 퍼스널 딜리버리 시스템, POTRIK을 만나보세요.
          </>
        }
        credits='강윤권, 박효경, 양현지, 이주은, 주형준'
        className='w-[144px] md:w-[180px] lg:w-[clamp(180px,21.3vw,308px)]'
      />
      <Image Image="/images/projects/potrik/potrik_main.jpg"/>
      <Divide title='Background' number='01' className='text-[#09C17A]' />
      <TitleBody
        title={
          <>
            자유로운 이동, <br />
            여전히 무거운 짐
          </>
        }
        text={
          <>
            기술의 발전으로 우리는 더 멀리, 더 자주, 더 자유롭게 이동할 수 있게 되었습니다.
            <br />
            하지만 여전히 우리의 이동을 불편하게 만드는 것들이 존재합니다. 무거운 노트북 가방, 챙겨왔지만 더 이상 입지
            않는 외투, 양손 가득 쇼핑백까지 우리 손에는 여전히 짐이 가득하고, 이동은 무거워져만 갑니다.
            <br />
            <br />
            만약, 모든 이동이 짐 없이 시작되고, 짐 없이 끝난다면 어떨까요? <br />
            POTRIK은 바로 이 상상에서 출발하였습니다.
          </>
        }
      />
      <Image Image='/images/projects/potrik/potrik_1.webp' />
      <Divide title='New Lifestyle' number='02' className='text-[#09C17A]' />
      <TitleBody
        title={
          <>
            짐 없이 시작되고,
            <br />짐 없이 끝나는 모든 이동
          </>
        }
        text={
          <>
            더 이상 짐 때문에 동선을 바꾸거나, 보관함을 찾아 발걸음을 멈출 필요도, 물건을 주고받기 위해 시간을 내어
            이동할 필요도 없습니다.
            <br />
            POTRIK은 순간에 맞춰 짐을 보내고 받는 새로운 딜리버리 시스템을 제안합니다.
            <br />
            양손은 가볍게, 이동은 끊김 없이. 우리가 꿈꾸던 자유로운 이동을 말이죠.
            <br />
            <br />
            <a
              href='https://www.notion.so/POTRIK-UX-Process-2315d7e3077e80efab01e92fb7abb053'
              target='_blank'
              className='underline font-semibold'
            >
              ▶ A detail story of their background.
            </a>
          </>
        }
      />
      <Image Image='/images/projects/potrik/potrik_2.webp' />
      <Divide title='Solution' number='03' className='text-[#09C17A]' />
      <MidTitle align='center' padding={false} text='[Here] to [Here]' className='text-[#09C17A]' />
      <MidBody
        align='center'
        content={
          <>
            지금 여기서 보내고, 다음 여정에서 다시 만나는 POTRIK.
            <br />
            앱을 통해 POTRIK을 호출하고, 이동을 불편하게 만들었던 짐을 보관해 보세요. <br />
            POTRIK이, 내가 설정한 목적지로 짐을 안전하게 운반해 줄 거예요.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110838249?h=90094e419f'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='System' number='04' className='text-[#09C17A]' />
      <TitleBody
        title={<>POTRIK</>}
        text={
          <>
            POTRIK은 차도와 인도를 자유롭게 오가며, 사용자의 짐을 더 빠르게 더 가까운 곳까지 옮겨줄 수 있도록 설계된
            분리, 결합형 모듈 구조의 공유 모빌리티입니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110679279?h=743bbc4061'
        preloadDelayMs={0}
        hasAudio={true}
        prewarm
        muted = {false}
        loop
      />
      <ImageGallery
        images={[
          '/images/projects/potrik/potrik_5.jpg',
          '/images/projects/potrik/potrik_6.jpg',
        ]}
      />
      <TitleBody
        title={<>Driving Module</>}
        text={
          <>
            Driving Module은 빠른 속도와 효율적인 이동을 위해, 차도 주행에 최적화된 모듈입니다.
            <br />
            <br />
            사용자의 호출이 감지되면, 충전 스테이션에서 대기 중이던 Driving Module은 Storage Module과 도킹하여, 하나의
            유닛으로 결합됩니다. 결합 후 유닛은 차도를 따라 안전하고 빠르게 움직이며 사용자가 설정한 목적지까지 짐을
            운반합니다.
          </>
        }
      />
      <Image Image='/images/projects/potrik/potrik_7.webp' />
      <TitleBody
        title={<>Storage Module</>}
        text={
          <>
            Storage Module은 사용자의 짐을 안전하게 보관하며, 보행자 환경에 최적화된 인도 주행 모듈입니다.
            <br />
            <br />
            좁은 골목이나 건물 입구까지 이동할 수 있도록 설계되어 사용자 가까이 도달할 수 있습니다. 목적지 근처 차도에서
            Driving Module과 분리되어, 자율주행으로 최종 목적지까지 이동해 사용자의 동선 속에서 쉽게 만날 수 있도록
            돕습니다.
          </>
        }
      />
      <Image Image='/images/projects/potrik/potrik_8.webp' />
      <MidTitle align='center' text='그럼 POTRIK을 사용해 볼까요?' padding={true} className='text-[#09C17A]' />
      <Image Image='/images/projects/potrik/potrik_9.jpg' />
      <Divide title='Scenario' number='05' className='text-[#09C17A]' />
      <TitleBody
        title={<>S1. 여행 중 쇼핑</>}
        text={
          <>
            점점 늘어나는 짐, 여행 동선을 방해하는 물건들
            <br />
            <br />
            성수동, 홍대, 연남처럼 다양한 쇼핑 거리와 팝업스토어를 도는 도심 여행. 무거워진 가방과 손에 들린 쇼핑백은
            우리의 동선을 어지럽히고, 물건을 잠시 맡길 곳을 찾아 헤매는 시간마저 당연하게 여겨졌습니다.
            <br />
            <br />
            POTRIK은 이 당연했던 불편함을 다시 바라봅니다. 물건을 들고 다니는 번거로움 없이, 동선이 끊기지 않는
            자연스러운 여정. POTRIK은 도시 위의 이동을 가볍고 부드럽게 이어줍니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110838275?h=68e0552247'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='How to use' number='06' className='text-[#09C17A]' />
      <TitleBody
        title={<>❶ Call & Send</>}
        text={
          <>
            애플리케이션을 통해 원하는 위치로 POTRIK을 호출하거나 인도에 비치된 Storage Module에 NFC를 태깅하면, 짐을
            보관할 수 있습니다. 다음 목적지와 시간을 설정하면, POTRIK이 그곳에서 기다리고 있어요.
            <br />
            <br />
            하루 동안 짐을 여러 번 보내고 받고 싶다면, ‘24H PASS’ 기능을 활용해 보세요. 지금 목적지를 지정하지 않아도,
            모든 동선에서 필요할 때마다 POTRIK을 자유롭게 이용할 수 있습니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110679295?h=4876bbe421'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <TitleBody
        title={<>❷ Move</>}
        text={
          <>
            POTRIK에 맡긴 짐은 애플리케이션을 통해 실시간으로 위치와 상태를 확인할 수 있어요.
            <br />
            <br />
            ’24H PASS’를 이용한다면, POTRIK이 사용자의 이동 동선에 맞춰 가까운 스테이션으로 함께 이동하며 언제, 어디서든
            빠르게 호출에 응답할 수 있도록 대기합니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110679309?h=eb8a3101fb'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <TitleBody
        title={<>❸ Receive</>}
        text={
          <>
            사용자가 설정한 시간과 원하는 장소에 도착한 POTRIK.
            <br />
            NFC 태깅 한 번으로 Storage Module이 열리고, 간편하게 짐을 꺼낼 수 있어요.
          </>
        }
      />
       <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110679326?h=078a6f5ad4'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <TitleBody
        title={<>S2. 장본 뒤 놀이터</>}
        text={
          <>
            장을 본 뒤, 아이들과 놀이터로 향하는 가벼운 발걸음
            <br />
            <br />
            마트 마감 시간에 맞춰 쇼핑을 마친 뒤, 아이들이 놀이터에 가고 싶다고 떼를 씁니다. 무거운 짐을 맡길 곳이 없어
            집으로 향할 수밖에 없었던 예전과 달리, 이제는 무거운 장바구니를 POTRIK에 맡기고, 아이와 함께 놀이터로 향할
            수 있습니다.
            <br />
            <br />
            예상치 못한 순간도, POTRIK과 함께라면 무겁지 않습니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110679343?h=9669b8cb9c'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <TitleBody
        title={<>S3. 중고 거래</>}
        text={
          <>
            "지금 바로, POTRIK으로 보내주세요."
            <br />
            <br />
            카페에서 작업을 하던 중, 노트북 충전기가 고장 났습니다. 지금 바로 중고 거래를 통해 충전기를 구하려면 직접
            받으러 이동해야 했지만, 이제는 POTRIK을 통해 필요한 물건을 내가 있는 곳으로 바로 받을 수 있습니다.
            <br />
            <br />
            불필요한 동선 없이, 필요한 순간에 필요한 물건을 보내고 받는 새로운 방식, POTRIK은 일상의 흐름을 바꿉니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110679347?h=1697312987'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='Vision' number='07' className='text-[#09C17A]' />
      <MidTitle align='center' padding={false} text='Start [Blank], End [Blank].' className='text-[#09C17A]' />
      <MidBody
        align='center'
        content={
          <>
            이제 물건은 단순히 장소에서 장소로 이동하지 않습니다.
            <br />
            POTRIK은 내가 있는 순간[Here]에서, 필요한 순간[Here]으로,
            <br />더 유연하고 개인화된 새로운 딜리버리 시스템을 제안합니다.
          </>
        }
      />
      <Image Image='/images/projects/potrik/potrik_16.webp' />
      <MidTitle align='center' text='당신의 순간을 가볍게 하는 퍼스널 딜리버리 시스템, POTRIK' />
      <Image Image='/images/projects/potrik/potrik_17.jpg' />
      <Divide title='Branding' number='08' className='text-[#09C17A]' />
      <Image Image='/images/projects/potrik/potrik_18.jpg' />
      <Image Image='/images/projects/potrik/potrik_19.jpg' />

      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '강윤권',
              role: 'PL · ID',
              englishName: 'Yungwon Kang',
              profileImage: '/images/profile/yungwonkang.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/yunkang24/',
                behance: 'https://www.behance.net/yungwonkang',
                instagram: 'https://instagram.com/yoonkangs__',
              },
            },
            {
              name: '박효경',
              role: 'VD',
              englishName: 'Hyogyeong Park',
              profileImage: '/images/profile/hyogyeongpark.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/hyogyeongPark',
                instagram: 'https://instagram.com/Parkhyogyeong',
              },
            },
            {
              name: '양현지',
              role: 'ID',
              englishName: 'Hyeonji Yang',
              profileImage: '/images/profile/hyeonjiyang.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/yanghyeonji',
                instagram: 'https://instagram.com/yangchiving',
              },
            },
            {
              name: '이주은',
              role: 'UX',
              englishName: 'Jueun Lee',
              profileImage: '/images/profile/jueunlee.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/jueun_lee_',
                instagram: 'https://instagram.com/juxxnyjunee',
              },
            },
            {
              name: '주형준',
              role: 'ID',
              englishName: 'Hyeongjoon Joo',
              profileImage: '/images/profile/hyeongjoonjoo.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/hyeongjoon-joo',
                behance: 'https://www.behance.net/hyeongjoonjoo',
                instagram: 'https://instagram.com/archive_129',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/projects/silmul' }}
          nextItem={{ label: 'Next', url: '/projects/newbe' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'Silmul',
            koreanName: '실물',
            linkUrl: '/projects/silmul',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'Newbe',
            koreanName: '뉴비',
            linkUrl: '/projects/newbe',
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
