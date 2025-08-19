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
      { name: '김치헌', englishName: 'Chiheon Kim ' },
      { name: '이문환', englishName: 'Moonhwan Lee' },
    ],
  },
  {
    title: 'ID tutor',
    tutors: [
      { name: '주호영', englishName: 'Hoyoung Joo' },
      { name: '고태헌', englishName: 'Taehun Ko' },
    ],
  },
  {
    title: 'UX tutor',
    tutors: [
      { name: '박지해', englishName: 'Jihae Park' },
      { name: '이진원', englishName: 'Jinwon Lee' },
    ],
  },
]

const thankstoData = [
  {
    title: 'Photographer',
    tutors: [{ name: '함성원', englishName: 'Sungwon Ham' }],
  },
]

const points = [
  {
    id: '1',
    top: '50%',
    left: '50%',
    images: [
      '/images/projects/layon/archive/1.jpg',
      '/images/projects/layon/archive/2.jpg',
      '/images/projects/layon/archive/3.jpg',
      '/images/projects/layon/archive/4.jpg',
      '/images/projects/layon/archive/5.jpg',
      '/images/projects/layon/archive/6.jpg',
      '/images/projects/layon/archive/7.jpg',
      '/images/projects/layon/archive/8.jpg',
      
    ],
    labels: [
      'Ideation',
      'Form Study',
      'Idea Sketch',
      'Form Study',
      'Form Study',
      'Form Study',
      'Behind',
      'Behind',
      'Behind',
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
        svgSrc='/images/logo/Layon_logo.svg'
        title={['레이온', 'Get your layer on, LAY.ON']}
        description={
          <>
            LAY.ON은 AI가 더 똑똑해질 미래에서 우리가 사용하는 디바이스와 앱의 역할을 새롭게 정의합니다.
            <br />
            우리의 시야를 AI와 공유하게 된 미래에는 AI가 사용자에 대해 더 깊이 이해할 수 있게 됩니다. 이제 사용자는 직접
            앱을 켤 필요가 없어지고 똑똑해진 AI가 현재 상황에 적합한 경험을 능동적으로 제안하는 방식이 디지털 경험에서
            큰 비중을 차지하게 될 것입니다. LAY.ON은 이 변화 속에서 우리의 시야 데이터를 수집하기에 적합한 디바이스의
            형태와 AI 중심의 앱 실행 방식을 연구하여 미래에 유효할 ‘좋은 사용자 경험'의 조건을 정의하고자 합니다.
            <br />
            LAY.ON과 함께 눈앞에 새로운 경험의 레이어를 켜보세요!
          </>
        }
        credits='유해리, 김서현, 김민희, 서유빈, 최완혁'
        className='w-[133px] md:w-[133px] lg:w-[clamp(196px,21.3vw,308px)]'
      />
      <Image Image='/images/projects/layon/layon_main.jpg' />
      <Divide title='Background' number='01' className='text-[#417EB4]' />
      <Image Image='/images/projects/layon/layon_01.jpg' />
      <TitleBody
        title={
          <>
            인간과 닮은 방식으로 <br className='hidden md:block'/>
            세상을 이해하는 AI
          </>
        }
        text={
          <>
            우리의 시선에는 많은 정보가 담겨 있습니다. 어디를 바라보고, 무엇에 시선을 오래 두는지에는 우리의 관심과
            의도, 그리고 복잡한 현실의 맥락이 자연스럽게 드러나기 때문이죠. 그렇다면 우리가 보는 것을 AI가 실시간으로
            함께 보고 이해할 수 있게 된다면 어떨까요? 멀티모달 AI를 통해 눈앞에 보이는 것들에 대한 '비전 데이터(Vision
            Data)'를 처리할 수 있게 된다면 AI는 인간과 더 닮은 방식으로 주변 세상과 사용자에 대해 이해할 수 있게 될
            것입니다. 우리 시선의 의도를 이해하는 AI는 우리의 삶과 디지털 환경을 근본적으로 변화시킬 새로운 가능성을
            가지게 됩니다.
          </>
        }
      />
      <Divide title='Problem' number='02' className='text-[#417EB4]' />
      <Image Image='/images/projects/layon/layon_02.webp' />

      <TitleBody
        title={
          <>
            미래로 나아가기 <br className='hidden md:block'/>
            위한 준비
          </>
        }
        text={
          <>
            현재 우리가 가진 디바이스와 앱에서 비전 데이터를 수집하고 활용하는 경험은 여전히 제한적이고 수동적인 방식에
            머물러 있습니다. 사용자가 직접 카메라를 켜고, 필요한 정보를 일일이 찾아야 하는 번거로움이 남아 있죠. 눈앞의
            비전 데이터를 실시간으로 포착하고, 적절한 타이밍에 필요한 경험을 제안하기 위해서는 새로운 디바이스와 서비스
            설계 방식이 필요합니다.
          </>
        }
      />
      <Divide title='Project Overview' number='03' className='text-[#417EB4]' />
      <MidTitle align='center' text='Get your layer on, LAY.ON' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110694544?h=be020ad889'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <MidBody
        align='left'
        content={
          <>
            AI는 우리가 보는 것을 함께 보고 이해하게 된 세상에서 우리의 시선은 새로운 의미와 능력을 갖추게 됩니다.
            보이지 않던 정보들이 눈앞에 나타나고, 바라보는 것만으로 원하는 행동이 바로 실행되죠. LAY.ON은 이러한 미래를
            단순한 상상이 아닌 현실로 이어가기 위해 새로운 디자인 원칙을 제안하며 다가오는 미래와 오늘을 잇는 징검다리를
            만들어갑니다.
          </>
        }
      />
      <Divide title='Design Strategy' number='04' className='text-[#417EB4]' />
      <Image Image='/images/projects/layon/layon_04.jpg' />
      <TitleBody
        title={
          <>
            필요한 만큼, <br className='hidden md:block'/>
            거슬리지 않는
          </>
        }
        text={
          <>
            인간은 시야에 들어온 모든 정보를 세밀하게 받아들이지 않고, 관심 대상에만 주의를 선택적으로 배분합니다. 또
            시선은 무의식중에 자연스럽게 움직이는 경우가 많으므로 작은 인위적 개입에도 쉽게 거슬림을 느낄 수 있습니다.
            LAY.ON의 제품과 OS는 이러한 시각 경험의 특성을 바탕으로 설계되었습니다. 내장된 센서 기술부터 AI의 제안
            타이밍과 방식까지 사용자가 필요한 만큼, 그리고 거슬리지 않도록 ‘충분’하면서도 ‘자연스러운’ 경험을 위한
            고민이 담겨 있죠.
            <br />
            <br />
            <a
              href='https://abiding-birth-ce4.notion.site/LAY-ON-Get-Your-Layer-On-23e5dd09e82c80df8013c8496d8fffd2?source=copy_link'
              target='_blank'
              className='underline font-semibold'
            >
              ▶︎ Learn more about detailed story of LAY.ON
            </a>
          </>
        }
      />
      <Divide title='Our Product' number='05' className='text-[#417EB4]' />
      <LeftTitle
        text={
          <>
            비전 데이터 수집에 최적화된 <br />
            차세대 디바이스
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110694602?h=5a3ef9adbc'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <MidBody
        align='left'
        content={
          <>
            비전 데이터를 수집하기 위해서는 디바이스가 우리의 눈과 가까운 곳에 있어야 합니다. 따라서 미래에 대중화될
            차세대 디바이스로 손꼽히는 'AR 글래스'는 비전 데이터 수집에 중요한 역할을 맡게 될 것입니다.
            <br/>
            이 AR 글래스는 어떤 기술을 담고, 또 어떤 형태여야 할까요?
          </>
        }
      />
      <Image Image='/images/projects/layon/layon_06.jpg' />
      <TitleBody
        title={
          <>
            꼭 필요한 기술만을 
            {' '}
            <br className='hidden md:block'/>
            가볍게 담아.
          </>
        }
        text={
          <>
            우리의 시선이 향하는 곳과 주변 환경에 대해 양질의 비전 데이터를 충분히 수집하기 위해 꼭 필요한 기술만을
            담았습니다. 제품의 앞뒤와 좌우로 정교하게 분산된 구조는 놀라울 만큼 가볍고, 얼굴에 자연스럽게 밀착됩니다.
          </>
        }
      />
      <Image Image='/images/projects/layon/layon_07.jpg' />
      <Image Image='/images/projects/layon/layon_08.jpg' />
      <TitleBody
        title={
          <>
            오늘의 나에게 
            {' '}
            <br className='hidden md:block'/>
            가장 어울리는 선택.
          </>
        }
        text={
          <>
            Z세대는 안경을 패션용으로 착용하며, 기능과 스타일에 따라 여러 종류의 안경을 가지고 있습니다. LAY.ON은 다양한
            스타일로 교체할 수 있도록 전면부의 'Face'와 안경다리 부분인 'Line'을 갈아 끼울 수 있는 모듈형 구조로
            설계하였습니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110694665?h=3f29f60aef'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <ImageGallery
        images={['/images/projects/layon/layon_10.jpg', '/images/projects/layon/layon_11.jpg']}
        alt='LAY.ON Image Gallery'
      />
      <MidBody
        align='center'
        content={
          <>
            오늘의 코디와 내 기분에 맞춰 마음에 드는 Face를 끼워보세요. 다양한 스타일의 Face는 내가 어떤 곳에 가든,{' '}
            <br className='hidden lg:block'/>
            무슨 옷을 입고 있든 비전 데이터를 수집할 수 있게 해줍니다.
          </>
        }
      />
      <Image Image='/images/projects/layon/layon_12.jpg' />
      <TitleBody
        title={
          <>
            쓰지 않을 때조차 <br className='hidden md:block' />
            즐거운.
          </>
        }
        text={
          <>
            Z세대는 특정 작업을 하거나 안경이 필요한 상황이 아니면 안경을 쓰지 않습니다. AR 글래스도 예외는 아닐
            것입니다. 벗고 싶을 땐 빠르게 벗고, 쓰고 싶으면 바로 꺼내서 쓸 수 있어야 하죠. 쓰지 않을 땐 가볍게 걸어
            휴대하고 키링처럼 나를 꾸밀 수 있는 아이템으로 활용해 보세요!
          </>
        }
      />
      <Image Image='/images/projects/layon/layon_13.jpg' />
      <Divide title='Our OS' number='06' className='text-[#417EB4]' />
      <LeftTitle text={<>필요한 경험이 먼저 제안되는 새로운 질서</>} />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110694674?h=0d98a04f83'
        preloadDelayMs={0}
        hasAudio={true}
        prewarm
        muted={false}
        loop
      />
      <MidBody
        align='left'
        content={
          <>
            AI가 우리를 더 잘 이해하게 된다면 더 이상 특정 앱과 기능을 직접 실행하지 않아도 될 것입니다. 적절한 타이밍에
            필요한 경험이 알아서 제안되죠. 이런 능동적인 실행 방식이 보편화된다면 우리가 서비스를 설계하는 방식 또한
            크게 달라져야 합니다.
            <br />
            <br />더 자세한 내용이 궁금하다면?
            <br />
            <br />
            <a
              href='https://abiding-birth-ce4.notion.site/UX-design-guideline-of-LAY-ON-23e5dd09e82c806085a3c3e8ae13e3e7'
              target='_blank'
              className='underline font-semibold'
            >
              ▶︎ Learn more about UX design guideline of LAY.ON
            </a>
          </>
        }
      />
      <Image Image='/images/projects/layon/layon_15.webp' />
      <TitleBody
        title={<>트리거가 되는 시선.</>}
        text={
          <>
            비전 데이터를 통해서 AI는 사용자의 행동, 주변 환경, 관심사나 습관에 대한 정보를 알 수 있습니다. 이는 시선의
            의도를 유추할 수 있는 근거가 되죠.
          </>
        }
      />
      <ImageGallery
        images={['/images/projects/layon/layon_16.jpg', '/images/projects/layon/layon_17.jpg']}
        alt='LAY.ON Image Gallery'
      />
      <RightBody
        text={
          <>
            앱에서 제공하는 경험들은 어떤 데이터를 트리거 삼아 제안되거나 실행될지, 명확한 기준에 기반해서 제안되어야
            합니다. 타이밍과 기능의 적합도는 사용 경험의 만족도를 결정짓는 핵심 요소입니다.
          </>
        }
      />
      <Image Image='/images/projects/layon/layon_18.jpg' />
      <TitleBody
        title={
          <>
            가장 필요한 것,
            {' '}
            <br className='hidden md:block'/>그 하나를 위한 선택지.
          </>
        }
        text={
          <>
            LAY.ON은 기능 간의 경합으로 느껴지지 않도록 여러 선택지가 있다는 것을 알리되 사용자에게 필요한 기능으로
            자연스럽게 연결되는 방법을 고민하였습니다.
          </>
        }
      />
      <Image Image='/images/projects/layon/layon_19.jpg' />
      <TitleBody
        title={
          <>
            자연스러운, 
            {' '}
            <br className='hidden md:block '/>
            그러나 분명하게.
          </>
        }
        text={
          <>
            사용자가 직접 경험을 실행하는 방식과 달리, 경험들이 능동적으로 작동되는 경우 유저에게 어떤 앱의 어떤 기능이
            동작하고 있는지 알리는 것이 중요합니다. LAY.ON은 사용자의 시야를 방해하지 않고 지금 어떤 일이 일어나고
            있는지, 사용자가 자연스럽게 인지할 수 있게 하는 방법을 고민하였습니다.
          </>
        }
      />
      <Divide title='Our Vision' number='07' className='text-[#417EB4]' />
      <Image Image='/images/projects/layon/layon_20.jpg' />
      <Image Image='/images/projects/layon/layon_21.jpg' />

      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '유해리',
              role: 'PL · ID',
              englishName: 'Haeri Ryoo',
              profileImage: '/images/profile/haeriryoo.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/haeriryoo',
                instagram: 'https://instagram.com/gla_sun_ss',
              },
            },
            {
              name: '김서현',
              role: 'UX',
              englishName: 'Seohyun Kim',
              profileImage: '/images/profile/minheekim.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/shmono',
                behance: 'https://www.behance.net/shmono',
                instagram: 'https://instagram.com/shmono',
              },
            },
            {
              name: '김민희',
              role: 'ID',
              englishName: 'Minhee Kim',
              profileImage: '/images/profile/seohyunkim.png',

              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/lciminhei',
                instagram: 'https://instagram.com/lciminhei',
              },
            },

            {
              name: '서유빈',
              role: 'VD',
              englishName: 'Yubin Seo',
              profileImage: '/images/profile/yubinseo.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/seoyubin',
                instagram: 'https://instagram.com/s_yubin__',
              },
            },
            {
              name: '최완혁',
              role: 'ID',
              englishName: 'Wanhyeok Choi',
              profileImage: '/images/profile/wanhyeokchoi.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/choiwanhyeok',
                instagram: 'https://instagram.com/0_0.10.15.d',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/projects/newbe' }}
          nextItem={{ label: 'Next', url: '/projects/hotcake' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/projects/newbe/newbe_thumbnail_1.jpg',
            englishName: 'Newbe',
            koreanName: '뉴비',
            linkUrl: '/projects/newbe',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/projects/hotcake/hotcake_thumbnail_1.jpg',
            englishName: 'Hotcake',
            koreanName: '핫케익',
            linkUrl: '/projects/hotcake',
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
