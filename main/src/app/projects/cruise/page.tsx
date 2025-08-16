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
import Head from 'next/head'

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
      { name: '주호영', englishName: 'Hoyoung Joo' },
      { name: '양진우', englishName: 'Jeenwoo Yang' },
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
    tutors: [{ name: '정영훈', englishName: 'Younghoon Jeong' }],
  },
  {
    title: 'Adviser',
    tutors: [
      { name: '구형준', englishName: 'Hyungjun Koo' },
      { name: '박상희', englishName: 'Sanghee Park' },
      { name: '이재희', englishName: 'Jaehee Lee' },
      { name: '장순규', englishName: 'Soonkyu Jang' },
    ],
  },
]

const points = [
  {
    id: '1',
    top: '50%',
    left: '50%',
    images: [
      '/images/projects/cruise/archive/1.jpg',
      '/images/projects/cruise/archive/2.jpg',
      '/images/projects/cruise/archive/3.jpg',
      '/images/projects/cruise/archive/4.jpg',
      '/images/projects/cruise/archive/5.jpg',
      '/images/projects/cruise/archive/6.jpg',
      '/images/projects/cruise/archive/7.jpg',
      '/images/projects/cruise/archive/8.jpg',
      '/images/projects/cruise/archive/9.jpg',
      '/images/projects/cruise/archive/10.jpg',
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
  const delayFor = (i: number, base = 400) => i * base

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

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile || isTablet) return

      const windowWidth = window.innerWidth
      const mouseX = event.clientX
      const rightThirdThreshold = windowWidth * (2 / 3)

      setIsMouseInRightThird(mouseX >= rightThirdThreshold)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMobile, isTablet])

  const handleSidebarExpandedChange = (expanded: boolean) => {
    setIsSidebarExpanded(expanded)
  }

  const shouldShowSidebar = isMobile || isTablet || isMouseInRightThird || isSidebarExpanded

  return (
    <>
      <Head>
        <link rel='dns-prefetch' href='https://player.vimeo.com' />
        <link rel='dns-prefetch' href='https://i.vimeocdn.com' />
        <link rel='dns-prefetch' href='https://f.vimeocdn.com' />
        <link rel='preconnect' href='https://player.vimeo.com' crossOrigin='' />
        <link rel='preconnect' href='https://i.vimeocdn.com' crossOrigin='' />
        <link rel='preconnect' href='https://f.vimeocdn.com' crossOrigin='' />
      </Head>
      <Header />
      <Summary
        svgSrc='/images/logo/CRUISE_logo.svg'
        title={['크루즈', 'Style Our Mile, Drive Our Life']}
        description='자율주행 5단계 시대, 운전의 개념이 사라지고 모든 탑승자가 네비게이터가 되는 변화 속에서, CRUISE는 이동을 능동적이고 역동적인 공유 경험으로 재정의하는 인터랙션 디바이스입니다. 소셜 미디어 속 디깅에 익숙한 이동 혁신 세대의 탐색 방식을 차 안으로 가져와, 모든 탑승자가 끊임없이 ‘움직이는 탐색’을 통해 경험을 공유하고 확장하게 하며, 일상에 새로운 가치와 영감을 더합니다. CRUISE와 함께 새로운 이동 경험을 만나보세요!'
        credits='윤여준, 강형구, 권민지, 백채영, 정민서'
        className='w-[177px] md:w-[177px] lg:w-[clamp(177px,21.3vw,308px)]'
      />
      <MainImage Image='/images/projects/cruise/image1.png' />
      <Divide title='Background' number='01' />
      <TitleBody
        title='삶의 모든 순간을 채우는 이동'
        text='매일 아침의 출근길, 바쁜 일상 속 짧은 이동, 설레는 주말여행, 그리고 예상치 못한 만남까지, 우리는 삶의 대부분을 이동 속에서 살아갑니다. 이처럼 이동은 우리의 시간과 경험의 큰 비중을 차지하는, 일상에서 결코 분리될 수 없는 중요한 일부입니다.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1106711843?h=ba42ab53da'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='Target' number='02' />
      <TitleBody
        title={'이동의 경험을 새롭게\n정의하는 이동 혁신 세대'}
        text='자율주행 안정화 시대의 도래로, 오랫동안 우리와 함께해왔던 조향 장치인 핸들조차 사라진 미래에서 이동은 더 이상 단순한 공간의 변화만을 의미하지 않습니다. 운전자와 동승자라는 전형적인 구분은 사라지고, 모든 탑승자는 운전의 책임에서 해방됩니다. 이는 곧, 개개인이 자신의 이동 경험을 스스로 만들고, 탐험을 즐기는 네비게이터가 될 새로운 가능성이 열리는 것이죠.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title='수동적인 승객이 아닌 경험을 개척하는 CRUISER'
        text={
          <>
            우리가 정의하는 이동 혁신 세대는 과거와 본질적으로 다릅니다. 이들은 콘텐츠를 일방적으로 소비하기보다, 소셜
            미디어 속에서 끊임없이 디깅하고 탐색하며 자신만의 취향을 능동적으로 스타일링합니다. 나아가, 발견한 것을
            공유하며 새로운 가치를 창조하는 데 익숙하죠.
            <br />
            <br />
            <a
              href=' https://www.notion.so/CRUISE-UX-BOOK-23d6cd1a9e8280a68d64f1b14879e6a1?source=copy_link'
              className='underline font-semibold'
              target='_blank'
            >
              ▶ A detailed story of their background
            </a>
          </>
        }
      ></RightTitleBody>
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1106712041?h=af8b7a7a8a'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <MidBody
        align='left'
        content='CRUISE는 이러한 삶의 방식을 이동 경험으로 확장합니다. 이들에게 이동은 이제, 세상의 모든 순간을 자신만의 취향으로 엮어내고, 친구들과 역동적으로 교감하는 하나의 플랫폼이 됩니다. 도로는 생생한 피드로, 차량은 손안에서 자유롭게 상호작용하는 디바이스로 변화합니다. 이를 통해 탑승자 모두가 이동 경험의 주체이자 경험 에디터가 되는 새로운 미래가 펼쳐집니다. 마치 ‘한 배를 탄 듯이’ 말이죠.'
      />
      <Divide title='Concept' number='03' />
      <Image Image='/images/projects/cruise/cruise_4.jpg' />
      <MidTitle align='center' text='도로, 경험을 공유하는 FEED가 되다.' />
      <Image Image='/images/projects/cruise/cruise_5.jpg' />
      <MidBody
        content={'Style Our Mile, Drive Our Life!\n이제 CRUISE가 우리의 이동을 어떻게 바꿔나갈지 함께 살펴볼까요?'}
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Divide title='CRUISE Product' number='04' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1106712232?h=e815385a12'
        preloadDelayMs={delayFor(1)}
        prewarm
        muted
        loop
      />

      <RightTitleBody
        title='CRUISE - Handle'
        text='CRUISE의 Handle은 새롭게 도래할 자율주행 시대에 기존 핸들을 대체할 새로운 인터랙션 디바이스입니다. 소셜 미디어에 익숙한 세대에게 직관적인 조작 방식으로 구성되어 빠르고 자연스럽게 주변과 상호작용을 가능하게 합니다.'
      />

      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1106712396?h=954343a016'
        preloadDelayMs={delayFor(2)}
        prewarm
        muted
        loop
      />

      <RightTitleBody
        title='CRUISE - Dash'
        text='CRUISE의 Dash는 내장된 AI 카메라로 사용자를 인식하여 CRUISE 경험을 보조합니다. Handle 미사용 시에는 지정된 슬롯에 간편하게 수납할 수 있죠. 무엇보다 Dash는 기능을 유지하면서도 센서 등의 구성요소를 최소화해 다양한 형태와 목적의 차량에 확장 적용이 가능하도록 설계되어, CRUISE가 선사할 새로운 이동 경험이 정해진 규격에 얽매이지 않도록 합니다.'
      />
      <Image Image='/images/projects/cruise/cruise_9.jpg' />

      <RightBody text='부담 없이 아늑한 2인승부터, 친구들 모두가 같이 여행을 떠날 수 있는 다인승까지, CRUISE는 그 어떤 차량 공간 안이라도 자연스럽게 녹아듭니다. 가장 편안한 자세에서 지나가는 외부 공간과 Dash의 정보를 동시에 확인할 수 있고, Handle을 언제든지 꺼내 들고 조작할 수 있죠.' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1106712557?h=5d7c488384'
        preloadDelayMs={delayFor(3)}
        prewarm
        muted
        loop
      />

      <Divide title='Scenario' number='05' />
      <MidTitle align='center' padding={false} text='(1) Styling Our Journey, Together' />

      <TitleBody
        title={'오늘의 여정, 어떤 분위기로\n 시작해 볼까요?'}
        text='항해를 떠나기 전, 지도를 펼쳐 경로를 탐색하는 항해사처럼 친구들과 지도를 펼쳐 탐색을 시작합니다. AI가 탑승자들을 인식하여 알고리즘 반경을 생성하고, 우리만을 위한 특별한 경로를 만들 수 있도록 제안하죠. 이처럼 여정 자체가 우리의 개성을 담은 Signature Map이 됩니다.'
      />
      <Image Image='/images/projects/cruise/cruise_11.jpg' />

      <MidTitle align='center' padding={false} text='(2) Boundless Playground for Everyone' />
      <TitleBody
        title={'서로의 시선으로\n함께 완성되는 지도'}
        text='운항 중인 크루즈 안에서 탑승자들이 각자의 보물 지도를 펼쳐 보이듯, CRUISE는 달리는 차 안을 우리 모두의 플레이그라운드로 만듭니다. Handle이 넘겨지는 순간 AI는 현재 사용자를 즉시 인식하여, 그들의 고유한 알고리즘을 불러올 수 있습니다. 이로써 각자의 시선이 담긴 정보들이 하나의 공유 지도 위에 통합되어 새로운 탐험의 재미를 선사하죠!'
      />

      <Image Image='/images/projects/cruise/cruise_12.jpg' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1106712720?h=5da78fb84e'
        preloadDelayMs={delayFor(4)}
        prewarm
        muted
        loop
      />

      <MidTitle align='center' padding={false} text='(3) Single Gesture, Dramatic Transition' />
      <TitleBody
        title={'분위기 전환,\n한손으로 간단하게'}
        text='승객이 잠에 들면 불을 꺼주고, 지루해하면 파티를 열어주는 선장처럼 환경의 변화에 따라 순식간에 분위기를 전환할 수 있습니다. 이동 중 흐름이 끊기는 불편함은 CRUISE에서 사라지고, 당겼다 놓는 제스처 하나로 지금의 분위기, 경로, 콘텐츠를 물 흐르듯 즉시 새로고침 할 수 있죠.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1106712921?h=694cbd3bf9'
        preloadDelayMs={delayFor(5)}
        prewarm
        muted
        loop
      />

      <TitleBody
        title={'이동 페르소나가 되는\n우리의 여정'}
        text='CRUISE에서 우리가 함께 만든 여정은 단순한 경로가 아닌, 사용자의 취향과 발견이 담긴 ‘이동 페르소나’가 됩니다. 누가 언제 어디서 어떤 발견을 했는지 기록된 이 여정은 다른 이들에게 영감을 주고, 우리의 경험은 타인의 시선을 통해 더욱 확장되죠. 우리 모두의 발자취가 끊임없이 진화하는 역동적인 지도가 되어, 새로운 여행을 위한 영감이 됩니다.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1106713092?h=1946f5e58b'
        preloadDelayMs={delayFor(6)}
        hasAudio={true}
        prewarm
        loop
        muted={false}
      />

      <Divide title='Vision & Expectation' number='06' />

      <MidTitle align='center' padding={false} text='Future Value of CRUISE' />
      <MidBody
        content='CRUISE는 매일 우리들이 향유하는 이동의 경험을 역동적인 공유 경험으로 새롭게 정의합니다. 
개인의 탐색과 취향이 끊임없이 연결되고 확장되며, 모든 여정이 함께 만들어가는 생동감 넘치는 
‘움직이는 탐색’이 되는 미래를 제시합니다.'
      />
      <Image Image='/images/projects/cruise/cruise_16.jpg' />

      <MidBody content='매번 지루했던 이동이 언제나 개성 넘치는 탐험이 될, 새로운 이동을 경험해 볼 준비가 되셨나요?' />
      <Image Image='/images/projects/cruise/cruise_17.jpg' />
      <Image Image='/images/projects/cruise/cruise_18.jpg' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1106713465?h=79087f8614'
        preloadDelayMs={delayFor(7)}
        prewarm
        loop
      />
      <Image Image='/images/projects/cruise/cruise_20.jpg' />
      <Image Image='/images/projects/cruise/cruise_21.jpg' />
      <Image Image='/images/projects/cruise/cruise_21.jpg' />

      <div ref={designedByRef}>
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
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/projects/mizi' }}
          nextItem={{ label: 'Next', url: '/projects/silmul' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'Mizi',
            koreanName: '미지',
            linkUrl: '/projects/mizi',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'Silmul',
            koreanName: '실물',
            linkUrl: '/projects/silmul',
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
