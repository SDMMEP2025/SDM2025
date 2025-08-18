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
    title: 'ID tutor',
    tutors: [{ name: '주호영', englishName: 'Hoyoung Joo' }],
  },
  {
    title: 'UX tutor',
    tutors: [{ name: '이진원', englishName: 'Jinwon Lee' }],
  },
  {
    title: 'VD tutor',
    tutors: [{ name: '조민혁', englishName: 'Minhyuk Jo' }],
  },
]

const thankstoData = [
  {
    title: 'Photographer',
    tutors: [
      { name: '안성훈', englishName: 'Seonghoon Ahn' },
      { name: '최주혁', englishName: 'Juhyuk Choi' },
      { name: '이원준', englishName: 'Wonjun Lee' },
    ],
  },
  {
    title: 'Technical Consulting',
    tutors: [
      { name: '하야카와 야스시', englishName: 'Hayakawa Yasushi' },
      { name: '허준', englishName: 'Jun Heo ' },
    ],
  },
  {
    title: 'Adviser',
    tutors: [
      { name: '김도아', englishName: 'Doa Kim' },
      { name: '박기령', englishName: 'Giryeong Park' },
    ],
  },
  {
    title: 'Hair Design Advisor',
    tutors: [{ name: '고병찬', englishName: 'Byungchan Ko' }],
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
    <Blank/>
      <Header />
      <Summary
        svgSrc='/images/logo/NewBe_logo.svg'
        title={['뉴비',
          <>
            The New Hair Station,
            <br/>
            Made to Fit You
          </>
        ]}
        description={
          <>
            NewBe는 머무르는 순간 자연스럽게 시작되는 나만의 새로운 헤어 스타일링 스테이션입니다. 스타일링이 필요한
            타이밍에 잠시 앉아있기만 하면 되니까요. 그 안에서 부담 없이 헤어 스타일링을 다양하게 시도하고 나에게 더
            Fit하게 맞도록 조율해 나가며, 보다 새로운 나를 발견해 보세요.
          </>
        }
        credits='이채원, 윤예현, 강동헌, 김시우, 정채영'
        className='w-[142px] md:w-[142px] lg:w-[clamp(196px,21.3vw,308px)]'
      />
      <Image Image='/images/projects/newbe/newbe_main.jpg'/>
      <Divide title='Background' number='01' className='text-[#7C8A8D]'/>
      <TitleBody
        title={
          <>
            헤어 스타일링이
            {' '}
            <br className='hidden md:block' />
            필요한 순간, 지금 NOW
          </>
        }
        text={
          <>
            헤어 스타일링은 이제 Z세대에게 더 이상 특별한 날에만 하는 이벤트가 아니라, 내 기분과 상황에 따라 나를
            표현하는 방식 중 하나가 되었습니다. 미용실 리뷰를 찾아보며 원하는 머리 스타일을 캡처하는 것부터, SNS로
            유명한 헤어 디자이너들의 튜토리얼 영상을 보거나 ‘추구미’ 머리를 보드에 저장하는 모습에서 이들의 활발한
            관심을 엿볼 수 있죠.
          </>
        }
      />
      <Image Image='/images/projects/newbe/newbe_1.webp' />
      <Divide title='Target' number='02' className='text-[#7C8A8D]'/>
      <TitleBody
        title={
          <>
            I Want to Be New,
            <br />내 스타일링은 ING니까
          </>
        }
        text={
          <>
            무엇보다 Z세대는 좋아하는 밴드 공연, 친구와의 여름 피크닉, 연인과의 데이트 등 매번 달라지는 상황에 맞게 나를
            새롭게 스타일링하는 일에 진심입니다. 나아가 ‘추구미’나 ‘도달 가능미’라는 말처럼, 이들에게 스타일링은 단 한
            번으로 완성되지 않는 진행형이죠. 이들은 계속 시도하며 다듬어가는 과정 자체에 새롭게 의미를 두고 있습니다.
          </>
        }
      />
      <Image Image='/images/projects/newbe/newbe_2.jpg' />
      <RightBody
        text={
          <>
            이러한 경험은 Z세대에게 보다 딱 맞는 자신만의 스타일을 발견하는 데에 있어서도 중요합니다. 그렇다면 매일
            거울을 보며 머리를 매만지는 이들에게 ‘헤어 스타일링’은 어떨까요?
          </>
        }
      />
      <Divide title='Problem' number='03' className='text-[#7C8A8D]'/>
      <TitleBody
        title={
          <>
            숙련도에 갇힌
            {' '}
            <br className='hidden md:block' />
            헤어 스타일링 경험
          </>
        }
        text={
          <>
            머리는 가장 나다운 영역인 동시에, 옷이나 신발처럼 벗을 수도 없어 훨씬 스타일링하기 어렵죠. 따라서 이들은
            그동안 내가 고데기를 얼마나 잘 다루느냐, 혹은 나보다 툴을 잘 다루는 미용사를 찾느냐와 같은 선택지에 주로
            기대어 왔습니다.
          </>
        }
      />
      <Image Image='/images/projects/newbe/newbe_3.webp' />
      <RightBody
        text={
          <>
            그러나 도구의 숙련도에만 의존하게 된 헤어 스타일링 경험은, Z세대가 일상에서 가볍게 시도하기엔 결국 더 큰
            부담으로 다가올 수밖에 없었습니다. 즉 매일의 헤어 스타일링이 여전히 무겁고, 어렵게만 느껴지는 것입니다.
          </>
        }
      />
      <Image Image='/images/projects/newbe/newbe_4.jpg' />
      <MidBody
        align='center'
        content={
          <>
            이제 우리에게 필요한 건 단지 도구를 능숙하게 다루기 위한 기술에만 그치지 않죠. 물리적인 장벽을 넘어, 헤어
            스타일링을 더욱 부담 없이 시도할 수 있어야 합니다. 마치 옷장에서 옷을 꺼내 이것저것 입어보며 조합하듯,
            나에게 맞는 스타일을 찾는 순간이 내 일상 속에 즐겁게 스며들 거니까요.
            <br />
            <br />
            <a
              href='https://rural-balmoral-f7c.notion.site/NewBe-UX-Process-23d292d2d1938007b54afdf92beb23e8?source=copy_link'
              target='_blank'
              className='underline font-semibold'
            >
              ▶ More Detailed UX Process
            </a>
          </>
        }
      />
      <Divide title='Solution' number='04' className='text-[#7C8A8D]'/>
      <MidTitle align='center' text='머무름 자체가 곧 스타일링이 되는 NewBe' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110696517?h=428d2ad897'
        preloadDelayMs={0}
        hasAudio={true}
        prewarm
        muted={false}
        loop
      />
      <TitleBody
        title={
          <>
            나만의 새로운
            {' '}
            <br className='hidden md:block' />
            헤어 스타일링 스테이션
          </>
        }
        text={
          <>
            NewBe는 Z세대가 머무르는 동안 자연스럽게 헤어 스타일링이 시작되는 스테이션 경험을 제안합니다. 헤어
            스타일링을 필요로 하는 순간이라면, 더 이상 복잡한 도구는 필요하지 않습니다. 이제 매일을 가볍게 시도하며
            나만의 헤어 스타일링을 새롭게 찾아나갈 수 있습니다.
          </>
        }
      />
      <Image Image='/images/projects/newbe/newbe_6.jpg' />
      <MidTitle align='center' text='#0 Meet My Hair Combo' />
      <Image Image='/images/projects/newbe/newbe_7.jpg' />
      <TitleBody
        title={
          <>
            New-Know Catching <br />: 나를 가장 잘 아는 콤보
          </>
        }
        text={
          <>
            스타일링을 하지 않을 때도 언제든 나만의 스테이션을 만나보세요. 머리를 말리고 빗는 일상적인 순간 속에서
            NewBe와 ComBe는 두상부터 모발, 텍스처 등 내 헤어 데이터를 자연스럽게 수집하며, 누구보다 내 머리를 가장 잘
            알고 있습니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110696594?h=7ba0530ce0'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='Scenario' number='05' className='text-[#7C8A8D]'/>
      <MidTitle align='center' padding={false} text='#1 How to Use NewBe' />
      <TitleBody
        title={
          <>
            나만의 헤어 스타일링
            {' '}
            <br className='hidden md:block' />
            생성하기
          </>
        }
        text={
          <>
            이제 본격적으로 스타일링을 준비해 볼까요? 원하는 머리를 일일이 설명하지 않아도 괜찮습니다. 내가 원하는
            헤어스타일이나 상황만 간단히 입력하면, 수집된 내 헤어 데이터를 바탕으로 지금 내 머리에 딱 맞는 스타일을
            제안해 줍니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110696620?h=812fda0809'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <RightBody
        text={
          <>
            그중 마음에 드는 스타일을 하나 선택해 그 안에서 세부 디테일을 내 마음대로 조율해 보세요. 이렇게 완성된
            나만의 스타일링, 우리의 New-Ing은 더욱 즐거워집니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110696638?h=16e5dc3df6'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <TitleBody
        title={
          <>
            내가 머무는 곳이
            {' '}
            <br className='hidden md:block' />곧 스타일링
          </>
        }
        text={
          <>
            NewBe는 언제든 스타일링을 실행할 준비가 되어 있습니다. 아침 화장대 앞에서 바쁘게 외출 준비를 할 때든, 화상
            미팅 직전 책상에 앉을 때든, 그저 머무르기만 하면 되죠. NewBe는 나의 생활 패턴과 리듬에 맞춰 머무름을 새로운
            스테이션으로 전환합니다.
          </>
        }
      />
      <Image Image='/images/projects/newbe/newbe_11.webp' />
      <MidBody
        align='center'
        content={
          <>
            NewBe가 보여줄 새로운 헤어 스타일링 씬은 더 이상 거울 앞에서 고데기를 들고 머뭇거리기만 하던 모습이
            아닙니다. 물리적 부담에서 벗어나 적외선 비접촉 기술로 내 두 손은 자유롭게, 그렇지만 더 세밀하게.
            <br />
            <br />
            <a
              href='https://rural-balmoral-f7c.notion.site/NewBe-Product-Process-23d292d2d19380ba8f5be46de930753e?source=copy_link'
              target='_blank'
              className='underline font-semibold'
            >
              ▶ Product Process
            </a>
          </>
        }
      />
     <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110696671?h=aaf756f866'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <MidBody
        align='center'
        content={
          <>
            기존의 압력과 열 대신, 내 머리카락 상태에 맞춰 조율되는 정밀한 열전달만을 통해
            <br />
            펌부터 스트레이트, 웨이브 등 내가 원하는 스타일을 더 자연스럽고 손상 없이 구현해 낼 수 있습니다.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110696722?h=023bb05217'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <MidTitle align='center' padding={false} text='#2 우리의 New-Ing이 계속 즐거울 수 있게' />
      <TitleBody
        title={
          <>
            NewBe는 언제든{' '}
            <br className='hidden md:block' />내 머리에 Fit하니까
          </>
        }
        text={
          <>
            예상치 못한 비 소식에 우리 머리는 쉽게 변하지만 괜찮습니다. NewBe는 그때그때 달라지는 콘텍스트에 맞춰, 지금
            내 스타일링에 가장 적합한 보정을 알아서 제안합니다. 나만의 헤어스타일을 지키는 태도가 곧 New-ttitude니까요.
          </>
        }
      />
      <Image Image='/images/projects/newbe/newbe_14.jpg' />
      <TitleBody
        title={
          <>
            마음에 드는 순간은 오래, <br />
            나만의 스타일링은 계속
          </>
        }
        text={
          <>
            그때 좋았던 그 스타일, 사진만 봐선 다시 따라 하기 어려울 때가 있죠. 내 헤어 스타일링은 순간들이 겹겹이 쌓여
            나만의 히스토리로 아카이브됩니다. <br />
            만약 매번 다시 불러오는 일이 번거롭다면, 나만의 프리셋으로 저장할 수도 있어요.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110696762?h=801d824d82'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <MidTitle align='center' padding={false} text='#3 확장되는 우리의 헤어 스타일링 씬' />
      <TitleBody
        title={
          <>
            그 머리, 이제 {' '}
            <br className='hidden md:block' />내 머리에도 New Me
          </>
        }
        text={
          <>
            전문가가 만든 스타일도, 나와 비슷한 유저가 완성한 스타일도 내 머리에 맞게 최적화된 스타일링 데이터로
            제공합니다. 유명한 헤어 디자이너의 ‘데이트 세팅’을 구매하고, 나와 머리 텍스처나 모발, 결 등 미세한 조건까지
            유사한 유저가 만든 반다나 스타일링을 저장할 수도 있죠.
            <br />
            NewBe는 이 모든 스타일링 데이터를 내 집에서 할 수 있도록 해줄 거예요.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110696762?h=801d824d82'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Divide title='Expectation' number='06' className='text-[#7C8A8D]'/>
      <MidTitle
        align='center'
        text={
          <>
            NewBe가 그리는 <br />
            미래의 헤어 스타일링 패러다임
          </>
        }
      />
      <Image Image='/images/projects/newbe/newbe_17.webp' />
      <MidBody
        align='center'
        content={
          <>
            우리는 숙련도가 부족한 사람을 Newbie라고 부르지만, 이제 내 머리를 스타일링한다는 것은 얼마나 능숙하게 도구를
            잘 다루느냐로만 정의되지 않습니다. NewBe를 통해 헤어 스타일링을 원하는 ‘순간’에만 머무른다면, 내 머리에 맞는
            스타일링을 원하는 대로 만들고 온전히 나를 표현하는 데에만 집중하면 되니까요.
          </>
        }
      />
      <Image Image='/images/projects/newbe/newbe_18.webp' />
      <MidBody
        align='center'
        content={
          <>
            나아가 내 곱슬머리를 매직으로만 펴는 것이 유일한 방법이 아닌 것처럼, 저마다의 고유한 머리를 개성 있는
            자신만의 스타일덴티티로 확장해 나가며, 헤어 표현의 새로운 패러다임 전환을 기대합니다.
          </>
        }
      />
      <Image Image='/images/projects/newbe/newbe_19.jpg' />

      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '이채원',
              role: 'PL · ID',
              englishName: 'Chaewon Lee',
              profileImage: '/images/profile/chaewonlee.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/chaewon-lee-63961a225/',
                behance: 'https://www.behance.net/chaewonleee',
                instagram: 'https://instagram.com/cherryonarchive',
              },
            },
            {
              name: '윤예현',
              role: 'UX',
              englishName: 'Yehyeon Yoon',
              profileImage: '/images/profile/yehyeonyoon.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/Yehyeon',
                instagram: 'https://instagram.com/hyeon.01__',
              },
            },
            {
              name: '강동헌',
              role: 'ID',
              englishName: 'Dongheon Kang',
              profileImage: '/images/profile/dongheonkang.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/dongheon',
                instagram: 'https://instagram.com/kd.heon',
              },
            },
            {
              name: '김시우',
              role: 'ID',
              englishName: 'Siwoo Kim',
              profileImage: '/images/profile/siwookim.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/S1W00Kim',
                instagram: 'https://instagram.com/w00si',
              },
            },
            {
              name: '정채영',
              role: 'UX',
              englishName: 'Chaeyoung Jung',
              profileImage: '/images/profile/chaeyoungjung.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/aydayd',
                instagram: 'https://instagram.com/cccccchaeyyyyy',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/projects/potrik' }}
          nextItem={{ label: 'Next', url: '/projects/layon' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/projects/potrik/potrik_thumbnail_1.jpg',
            englishName: 'PORTIK',
            koreanName: '포트릭',
            linkUrl: '/projects/potrik',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/projects/layon/layon_thumbnail_1.jpg',
            englishName: 'LAY.ON',
            koreanName: '레이온',
            linkUrl: '/projects/layon',
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
