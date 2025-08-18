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
    title: 'VD tutor',
    tutors: [{ name: '장기성', englishName: 'Kisung Jang' }],
  },
  {
    title: 'UX tutor',
    tutors: [{ name: '오승빈', englishName: 'Seungbin Oh' }],
  },
]

const points = [
  {
    id: '1',
    top: '50%',
    left: '50%',
    images: [
      '/images/projects/mizi/archive/1.jpg',
      '/images/projects/mizi/archive/2.jpg',
      '/images/projects/mizi/archive/3.jpg',
      '/images/projects/mizi/archive/4.jpg',
      '/images/projects/mizi/archive/5.jpg',
      '/images/projects/mizi/archive/6.jpg',
      '/images/projects/mizi/archive/7.jpg',
      '/images/projects/mizi/archive/8.jpg',
      '/images/projects/mizi/archive/9.jpg',
      '/images/projects/mizi/archive/10.jpg',
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
        svgSrc='/images/logo/Mizi_logo.svg'
        className='w-[74px] md:w-[130px] lg:w-[clamp(130px,9vw,229px)]'
        title={['미지', 'Into the Moment, MIZI']}
        description={
          'MIZI는 시간과 거리의 제약 없이 지금, 이 순간 원하는 세계에 몰입할 수 있는 온 디맨드(On-Demand) 몰입 경험 플랫폼입니다. MIZI의 텔레프레전스 아바타 NOMA는 실재하는 장소에서 감각을 수집하고 햅틱 디바이스를 통해 그 감각을 실시간으로 사용자에게 전달합니다. 마치 그 장소에 있는 것과 같은 몰입감 있는 경험을 선사합니다.\n\n지금 바로, 우리가 원하는 세계로 떠나보세요!'
        }
        credits='박지민, 나승환, 김도영, 이준영'
      />
      <MainImage Image='/images/projects/mizi/mizi_main.jpg' />
      <Divide title='Background' number='01' className='text-[#FF2A00]' />
      <TitleBody
        title={'모든 것이 ‘즉시’ 가능한\nOn-Demand 사회'}
        text='우리는 클릭 한 번이면 음식이 1시간 안에 도착하고, 오늘 주문한 택배가 다음 날 새벽에 도착하며, 터치 한 번이면 영화 한 편을 볼 수 있는 온 디맨드(On-Demand) 사회에 살고 있습니다. 
퀵커머스, 실시간 스트리밍과 같은 서비스가 우리의 일상이 되며 Z세대에게 기다림이라는 시간은 참기 힘들어졌죠.'
      />
      <MainImage Image='/images/projects/mizi/mizi_1.webp' />
      <TitleBody
        title={'기다림을 요구하는 영역\nTravel'}
        text='그런데 유독, 여행만큼은 아직 기다림을 요구하는 영역으로 남아있습니다. 떠나기로 다짐하고, 계획을 세우고, 여행을 가는 당일까지 기다리는 과정이 여전히 필수적으로 남아있죠. 사람들은 이 과정의 기다림조차 여행의 일부이자 의미 있는 시간이라고 이야기하고는 합니다. 
하지만 혹시, 우리는 이 기다림으로 인해 떠나야 했던 타이밍을 놓치고 있는 것은 아닐까요?'
      />

      <Image Image='/images/projects/mizi/mizi_2.jpg' />
      <Divide title='Insight' number='02' className='text-[#FF2A00]' />
      <TitleBody
        title={'다짐과 실행 사이,\n감정의 시차'}
        text='우리는 우울할 때 바다를 보고 싶어 하고, 지치면 숲을 걷고 싶어 합니다. 하지만, 이 바람은 쉽게 이루어지지는 못합니다. ‘떠나자’라고 다짐하고 계획을 시작하면 우리는 곧 직장이나 학교 등의 현실과 마주하게 됩니다. 그렇게 몇 주, 몇 개월 뒤 원하는 곳에 도착했을 때 과연 처음 ‘떠나자’라고 다짐했을 시 가졌던 그 마음이 그대로 남아있나요? 다짐과 실행 사이에는 현실적인 장벽이 존재하고 바로 충족되지 못하는 그 시간은 감정의 시차를 만들어냅니다.'
      />
      <Image Image='/images/projects/mizi/mizi_3.jpg' />
      <Divide title='Hypothesis' number='03' className='text-[#FF2A00]' />
      <MidTitle align='left' padding={false} text='N년 후, 기술 발전이 만들어 갈 경험의 패러다임 변화' />
      <RightBody text='경험의 사전적 정의는 보거나 듣거나 느끼면서 겪는 것. 또는, 그로 인해 얻은 지식이나 기능을 말합니다. 감각을 통해 정보를 입력받고, 뇌에서 이를 해석하여 기억으로 남기는 과정을 통해 세상을 인식하고 이해하고 있습니다.  그리고 이런 우리의 감각을 데이터화하여 구현하는 지각 확장 기술은 XR과 햅틱을 기반으로 끝없이 발전하고 있습니다. 머지않은 미래에는 모든 감각을 실시간으로 완전히 구현할 수 있어 현실과 가상의 경계가 부서지는 지점에 도달할 것이고, 그 시대가 오면 “다녀왔다”라는 말의 기준, 즉 우리가 경험을 정의하는 방식이 변화할 것입니다.' />
      <Image Image='/images/projects/mizi/mizi_4.jpg' />
      <Image Image='/images/projects/mizi/mizi_5.jpg' />
      <Divide title='Project Overview' number='04' className='text-[#FF2A00]' />
      <MidTitle align='center' className='text-[#FF2A00]' text='Into the Moment, MIZI' />

      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110676481?h=7c5679d04aa'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <TitleBody
        title={'On-Demand Travel,\nMIZI'}
        text='시간과 거리의 제약 없이 지금, 이 순간 원하는 세계에 몰입할 수 있는 플랫폼, MIZI를 제안합니다. MIZI는 사용자가 원하는 감각이나 분위기를 떠올리는 순간, 아바타 NOMA를 통해 가장 어울리는 물리적인 공간으로 사용자를 연결해 줍니다.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110676506?h=110e90e528'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='MIZI Avatar, NOMA' number='05' className='text-[#FF2A00]' />
      <TitleBody
        title={'Avatar, NOMA'}
        text='사용자를 대신해 실제 공간에서 감각을 전송하는 MIZI의 텔레프레전스 아바타 NOMA는 전 세계 다양한 위치에 분포되어 있으며, 각각의 공간에서 다양한 감각들을 실시간으로 수집하고 사용자에게 전달합니다. 시각부터 촉각, 공감각과 같은 다양한 감각을 사용자의 햅틱 디바이스로 전달해 아름다운 풍경과 주변의 촉감, 공기의 흐름까지 온전한 경험을 실시간으로 느낄 수 있게 도와줍니다.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110676514?h=59d33fab43'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <TitleBody
        title={'NOMA, System'}
        text='아바타 NOMA에 내장된 공간 인식 센서와 촉각 센서를 통해 들어오는 감각은, 사용자의 햅틱 디바이스를 통해 날것의 감각 그대로 전달됩니다. 56개의 가동부로 이루어진 NOMA의 ROM(Range of motion)은, 사람이 일상적으로 하는 행위 전반에 유동적으로 대응하며 사용자의 행동을 이질감 없이 재현합니다.'
      />
      <Image Image='/images/projects/mizi/mizi_9.jpg' />
      <MidTitle align='center' text='Dive Into Your Desired Moment—Now, MIZI' className='text-[#FF2A00]' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110676530?h=4d91f85e18'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='Feature 01' number='06' className='text-[#FF2A00]' />
      <TitleBody
        title={'감정과 무드 기반의\n실시간 장소 큐레이션'}
        text='지금 내 감정이 원하는 장소의 분위기를 말해보세요. NOMA의 위치를 스캔한 후, AI가 사용자가 원하는 경험과 가장 잘 어울리는 장소를 추천해 줍니다. 사용자는 큐레이션 된 장소의 정확한 위치를 알 수 없지만, 그 장소의 분위기와 느낄 수 있는 감각들을 알 수 있습니다. 큐레이션 된 장소 중 하나 이상을 선택해 미지의 장소로 떠나보세요! 장소는 현장의 시간, 날씨 등의 변화에 따라 실시간으로 업데이트됩니다.'
      />
      <Image Image='/images/projects/mizi/mizi_11.jpg' />
      <Divide title='Feature 02' number='07' className='text-[#FF2A00]' />
      <TitleBody
        title={'이동이 자유로운\n연속적인 몰입 경험'}
        text='도착한 장소가 어딘가 아쉽게 느껴지나요? 그렇다면 MIZI:AI에게 더 원하는 느낌을 말해보세요. MIZI:AI가 지금 내 감정에 맞는 장소를 큐레이션 하여 Next 장소로 바로 이동할 수 있습니다. 하나의 공간뿐만 아니라 여러 장소, 다양한 분위기와 감각을 연속적으로 경험하고 나만의 여정을 직접 설계해 보세요!'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110676544?h=79b5819091'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='Feature 03' number='08' className='text-[#FF2A00]' />
      <TitleBody
        title={'On-Off\n하이브리드 경험'}
        text='MIZI의 아바타를 통해 전 세계 다양한 공간에서 실시간으로 물건을 탐색할 수 있습니다. 현장에서 구매할 수 있는 물품을 탐색할 수 있고, 구매를 원할 때 현장 시스템과 App을 통해 원격으로 구매를 진행할 수 있습니다. 구매한 물품은 포장되어 추후 내 공간으로 배송받을 수 있죠. 오프라인의 현장감과 온라인의 편리함을 모두 누릴 수 있는 온-오프 하이브리드 경험을 제안합니다.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110676556?h=6d3b92b7cd'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='Feature 04' number='09' className='text-[#FF2A00]' />
      <TitleBody
        title={'순간을 자동으로\n기록하는 아카이브'}
        text='MIZI를 이용하는 동안 사용자가 사용하고 있는 디바이스들이 사용자의 심장박동, 혈압 등의 신체활동을 감지합니다. 내가 유독 힐링했던 순간, 내가 가장 신났던 순간 등을 인식하고, 그때의 감각들이 자동으로 기록됩니다. 추후 다시 한번 경험하고 싶다면 그때의 감각을 불러와 동일한 순간을 다시 체험할 수 있습니다. 언제든 그때의 몰입감과 감정을 느껴보세요!'
      />
      <Image Image='/images/projects/mizi/mizi_14.jpg' />
      <MidTitle align='center' text='Welcome to MIZI, an Unknown World' className='text-[#FF2A00]' />
       <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110676564?h=54a7c68cba'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='Scenario 01' number='10' className='text-[#FF2A00]' />
      <TitleBody
        title={'경직된 일상에서의 해방\n∞ Dune'}
        text='매일 반복되는 업무와 공간에 갇힌 도시의 직장인, 일상의 답답함에서 벗어나 자유를 갈망합니다. MIZI의 아바타 NOMA: Dune은 사막과 같은 험한 지형에서 사용자가 해방과 속도감을 느낄 수 있는 자유로운 감각을 전달합니다.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110676577?h=9a28258494'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='Scenario 02' number='11' className='text-[#FF2A00]' />
      <TitleBody
        title={'바다에 대한 갈망\n∞ Nautilus'}
        text='신체적으로 이동이 불편한 사회적 약자에게 바다란 접근이 어려운 장소 중 하나입니다. 모래사장과 인도를 포함한 접근로를 지나 그들을 위한 특정 유영 공간에 안전하게 들어가는 일조차 쉽지 않습니다. MIZI의 아바타 NOMA: Nautilus는 수중 모듈로 사용자가 재활센터, 수영장 등 어디서든 바닷속을 경험할 수 있도록 감각을 전달합니다.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110676591?h=f11e43fe4d'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='Scenario 03' number='12' className='text-[#FF2A00]' />
      <TitleBody
        title={'궁극의 미지에 대한 로망\n∞ Stardust'}
        text='누구나 한 번쯤은 ‘우주에 간 나’를 상상하는 순간이 있습니다. 지금은 소수를 제외하면 갈 수 없는 미지의 공간이지만 MIZI의 아바타 NOMA: Stardust, 우주 모듈을 통해 우리는 모두 지구 너머 우리 은하를 실시간으로 경험할 수 있습니다. MIZI와 함께라면 상상은 현실이 됩니다.'
      />
      <Image Image='/images/projects/mizi/mizi_18.jpg' />
      <Divide title='Project Value' number='13' className='text-[#FF2A00]' />
      <MidBody
        align='center'
        content={
          <>
            MIZI는 기술의 발전이 이끌 ‘미래의 경험’을 새롭게 정의합니다. 모든 감각을 원격 실시간으로 완전히 재현할 수
            있는 시대, 이제 우리는 일상에서 물리적 한계를 벗어나 원하는 곳 어디든 갈 수 있습니다. 불가능할 것만 같았던
            장소까지 닿을 수 있죠. 이렇게 MIZI는 로망을 현실로 바꾸는 온 디맨드(On-Demand) 몰입 경험을 제안합니다.
            <br />
            <br />
            <a
              href='https://heyzine.com/flip-book/041d1f584b.html'
              className='underline text-[#FF2A00] font-semibold'
              target='_blank'
            >
              ▶Click here for more MIZI stories.
            </a>
          </>
        }
      />
      <MidTitle align='center' text='A New Way of Seeing the World' />
      <Divide title='MIZI Branding Story' number='14' className='text-[#FF2A00]' />
      <TitleBody
        title={'새로운 세계로,\n시야의 확장'}
        text='MIZI는 사용자가 아바타 NOMA를 통해 자신만의 새로운 세계를 확장해 나갈 수 있도록 돕습니다. 아직은 불확실하고 모호한 세계를, MIZI와 함께라면 조금 더 또렷하게 바라볼 수 있습니다. MIZI는 ‘새로운 시야의 확장’이라는 가치를 핵심으로 삼고, 이를 바탕으로 MIZI만의 브랜드 아이덴티티를 구축했습니다.'
      />
      <Image Image='/images/projects/mizi/mizi_19.jpg' />
      <Image Image='/images/projects/mizi/mizi_20.jpg' />
      <Image Image='/images/projects/mizi/mizi_21.jpg' />

      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '박지민',
              role: 'PL · UX',
              englishName: 'Jimin Park',
              profileImage: '/images/profile/jiminpark.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/jm_park',
                instagram: 'https://instagram.com/jminxve',
              },
            },
            {
              name: '나승환',
              role: 'PL',
              englishName: 'Seunghwan Ra',
              profileImage: '/images/profile/seunghwanra.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/seungwhan-ra-119818217/',
                behance: 'https://www.behance.net/seunghwanRA',
                instagram: 'https://instagram.com/__gigawatt',
              },
            },
            {
              name: '김도영',
              role: 'VD',
              englishName: 'Doyoung Kim',
              profileImage: '/images/profile/doyoungkim.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/Do_0ski',
                instagram: 'https://instagram.com/do_0ski',
              },
            },
            {
              name: '이준영',
              role: 'ID',
              englishName: 'Junyoung Lee',
              profileImage: '/images/profile/junyounglee.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/Junyoung424',
                instagram: 'https://instagram.com/j_zerodesign',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/projects/autonomy-practice' }}
          nextItem={{ label: 'Next', url: '/projects/mizi' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'AUTONOMY PRACTICE',
            koreanName: '오토노미 프랙티스',
            linkUrl: '/projects/autonomy-practice',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'mizi',
            koreanName: '크루즈',
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
