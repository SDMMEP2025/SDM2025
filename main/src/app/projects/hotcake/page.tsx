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
    tutors: [{ name: '주호영', englishName: 'Hoyoung Joo' }],
  },
  {
    title: 'UX tutor',
    tutors: [{ name: '오승빈', englishName: 'Seungbin Oh' }],
  },
  {
    title: 'VD tutor',
    tutors: [{ name: '워크스', englishName: 'WORKS' }],
  },
]

const thankstoData = [
  {
    title: 'Photographer',
    tutors: [{ name: '최주혁', englishName: 'Juhyuk Choi' }],
  },
  {
    title: 'Videographer',
    tutors: [{ name: '최주혁', englishName: 'Juhyuk Choi' }],
  },
  {
    title: 'D.O.P.',
    tutors: [{ name: '박기정', englishName: 'Gijeong Park' }],
  },
  {
    title: 'Gaffer',
    tutors: [{ name: '양의열', englishName: 'Uiyeol Yang' }],
  },
  {
    title: 'Music Producer',
    tutors: [{ name: '코토바', englishName: 'cotoba' }],
  },
  {
    title: 'Model',
    tutors: [{ name: '됸쥬', englishName: 'DyoN Joo' }],
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
        svgSrc='/images/logo/hotcake_logo.svg'
        title={['핫케익', 'Heat it, Play it, Hotcake']}
        description='Hotcake는 공간 제약 없이 즐거운 합주를 할 수 있는 경험을 선사합니다. 마치 한 공간에 함께 있는 듯한 입체적인 사운드를 구현하고, 서로의 타이밍이 정확히 맞아떨어지는 짜릿한 순간을 놓치지 않도록 도와주죠. Hotcake와 함께, 평범한 일상 공간에서도 몰입감 넘치는 유난스러운 합주의 즐거움을 느껴보세요!'
        credits='장우진, 정혜령, 김채은, 이일여, 장은혜'
        className='w-[85px] md:w-[96px] lg:w-[clamp(96px,10vw,144px)]'
      />
      <MainImage Image='/images/projects/cruise/image1.png' />
      <Divide title='A way of enjoying music' number='01' />
      <TitleBody
        title='음악은 결국 하고 싶어지니까'
        text='음악은 우리 삶 곳곳에 스며든 일상 그 자체입니다. 음악을 즐기는 방식은 저마다 다르지만, 어떤 이들은 단순히 듣기만 하는 것을 넘어 더 깊이 음악에 다가가 참여하고 싶어 하죠. 그렇게 누군가는 악기를 손에 쥐고, ‘방구석 뮤지션’으로서 첫발을 내딛습니다.'
      />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106711843?h=ba42ab53da' />
      <Divide title='The joy of being together' number='02' />
      <TitleBody
        title={'혼자 연주하는 시간, \n함께 빠져드는 순간으로'}
        text='음악은 결코 혼자만으로 완성되는 것이 아닙니다. 다양한 악기들이 겹겹이 쌓이며 풍성해지고, 그만큼 즐거움도 커지죠. 방구석 뮤지션들 역시 처음에는 혼자 음악을 즐기는 것만으로도 충분했지만, 점차 그 음악의 재미를 누군가와 함께 즐기고 싶어지기 마련입니다. 리듬을 주고받는 쾌감, 그루브를 맞춰가는 짜릿한 순간은 혼자서는 결코 느낄 수 없는 특별한 즐거움이니까요.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'합주는 당연히\n즐거워야 하니까'}
        text={
          <>
            합주는 늘 합주실에 가야만 가능한 일이었습니다. 무거운 악기를 들고, 비용을 지급해 예약한 공간에서는 괜히
            잘해야 할 것만 같은 압박이 따르곤 했죠. 하지만 집에서도 합주가 가능하다면 어떨까요? Hotcake는 집이라는 가장
            편안한 공간에서, 더 자유롭고 즐거운 합주를 지향합니다. 박자가 조금 틀리거나 음이 어긋나도 괜찮아요. 그저
            음악에 몸을 맡겨보세요!
            <br /> <br />
            <a href='https://bio.link/silmul' className='underline font-semibold' target='_blank'>
              ▶︎ 더 자세한 이야기는 여기에
            </a>
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidTitle align='center' text='Heat It, Play It, Hotcake' />
      <Image Image='/images/projects/cruise/cruise_5.jpg' />
      <TitleBody
        title={'온라인 합주의 완성\nCake & Butter'}
        text={
          'Hotcake는 모듈 스피커와 우퍼 스테이션으로 구성된 Cake와 햅틱 웨어러블 디바이스인 Butter로 구성되어 있습니다. Cake와 Butter는 각 세션이 연주하고 있는 소리를 공간 음향으로 구현해 실제 합주를 하는 듯한 경험을 제공하고, 연주하고 있는 음악의 파장을 햅틱 피드백으로 전달해 음악을 피부로 느낄 수 있도록 합니다.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <TitleBody
        title={'지구 반대편에서도\n함께 합주하는 경험'}
        text={
          '합주에서 타이밍은 생명이기에, 온라인 합주에서는 딜레이 없는 환경이 필수입니다. Cake 스테이션은 유선 이더넷을 통해 안정적인 네트워크 연결을 유지하며, 거리의 제한 없이 연주 중인 음원을 실시간으로 수신합니다. 또한 각 모듈은 스테이션과 2.4GHz RF 채널을 통해 각 세션이 연주 중인 음원을 전달받아 레이턴시 없는 온라인 합주 경험을 가능하게 합니다.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <TitleBody
        title={'음악에 텍스처를 입히다'}
        text={
          '라이브 음악의 묘미는 온몸으로 느껴지는 떨림에 있습니다. Butter는 연주 중인 음악의 파장에 맞춰 햅틱 피드백을 전달함으로써 단순히 귀로 듣기만 하는 음악에 텍스처를 더해 더욱 다이나믹한 라이브 경험을 가능하게 합니다. 또한, 메트로놈 모드로 바꿔 박자를 모니터링하거나 내장된 마이크를 통해 보이스 채팅도 가능합니다.'
        }
      />
      <Divide title='Scenario' number='04' />
      <MidTitle align='center' text='(1) Connection with Sessions' padding={false} />
      <TitleBody
        title={'손쉽게 구하는\n나만의 즉흥 밴드'}
        text={
          '당장 합주를 즐기고 싶어도 주변에 함께할 사람이 없을 때가 있죠. 오픈 커뮤니티를 통해 나와 음악 취향이 잘 맞는 친구를 찾아 밴드를 꾸릴 수 있고, 친구 리스트를 통해 기존에 친한 친구와도 손쉽게 합주를 시작할 수 있습니다. 만약 세션이 부족할 때는 AI 세션이 나의 리듬에 맞춰 함께 연주하며, 몰입감 있는 퍼포먼스를 완성해 줍니다.'
        }
      />

      <Image Image='/images/projects/cruise/cruise_6.jpg' />

      <MidTitle align='center' text='(2) New Experience with Hotcake' />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106712720?h=5da78fb84e' />

      <TitleBody
        title={'빛, 진동, 그리고 소리로\n이어지는 합주 경험'}
        text={
          'Cake의 모듈 스피커를 공간에 배치하면, 단순히 소리를 재생하는 것을 넘어 빛을 통해 친구들의 연주를 실시간으로 경험할 수 있습니다. 웨어러블 기기인 Butter를 함께 사용하면, 사운드에 맞춰 반응하는 햅틱을 통해 리듬과 그루브를 느낄 수 있습니다.'
        }
      />

      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />

      <TitleBody
        title={'집에서도, 더 유난스럽고\n더 재미있게'}
        text={
          '합주의 가장 큰 재미 요소는 무엇보다도 박자가 딱 맞아떨어지는 그 순간이죠. 합이 딱 맞춰지는 순간 Cake 모듈 스피커에서 나오는 LED 라이팅이 방 안을 작은 무대로 꾸밉니다. 연주가 클라이맥스에 달하면 모션 제스처를 통한 사운드 이펙트로 뜨거움이 가득한 합주를 경험해 보세요.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <MidTitle align='center' text='(3) Frame the Heated Moment' padding={false} />
      <TitleBody
        title={'뜨거운 합주의\n순간으로 돌아가기'}
        text={
          '합주가 끝난 후에는 AI가 솔로 파트나 하이라이트를 자동으로 편집해 줍니다. 완성된 영상은 함께 연주한 친구들과 바로 공유할 수 있어, 그 여운이 자연스럽게 이어집니다. 또한 모니터링 영상 속 나의 연주를 되돌아보며, 합주의 순간을 다시 돌아볼 수 있습니다.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />

      <Divide title='New Expandability' number='05' />
      <TitleBody
        title={'모두가 합주의 즐거움을\n느낄 수 있도록'}
        text={
          'Hotcake는 기존의 연주 방식을 해치지 않으면서, 누구나 쉽게 합주를 즐길 수 있는 접근성 중심의 플랫폼으로 확장됩니다. Butter의 뮤직 햅틱 기능은 소리를 온전히 듣기 어려운 사람도 리듬을 피부로 느끼며 합주에 참여할 수 있게 합니다. 또한, 헤드폰 기반 스튜디오 모드는 언제 어디서든 몰입감 있는 연주 환경을 제공하며, 개인의 감각적 표현이 콘텐츠가 되는 새로운 음악 생태계를 만들어갑니다.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />

      <MidTitle align='center' text='Heat it, Play It, Groove It, Melt It, Drop It, Fade It, Link It, Hotcake' />

      <Image Image='/images/projects/cruise/cruise_6.jpg' />

      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />

      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '장우진',
              role: 'PL · ID',
              englishName: 'Woojin Jang',
              profileImage: '/images/profile/woojinjang.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/woojinjid/',
                behance: 'https://www.behance.net/woojinjid',
                instagram: 'https://instagram.com/woojinjid',
              },
            },
            {
              name: '정혜령',
              role: 'UX',
              englishName: 'Hyeryoung Jeong',
              profileImage: '/images/profile/hyeryoungjeong.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/hyeryoungjeong',
                behance: 'https://www.behance.net/hyeryoungjeong',
                instagram: 'https://instagram.com/hyeryoung2',
              },
            },
            {
              name: '김채은',
              role: 'BX',
              englishName: 'Chaeeun Kim',
              profileImage: '/images/profile/chaeeunkim.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/rlaeunoia',
                instagram: 'https://instagram.com/rlaeunoia',
              },
            },
            {
              name: '이일여',
              role: 'VD',
              englishName: 'Ilyeo Lee',
              profileImage: '/images/profile/ilyeolee.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/leeilyeoo',
                instagram: 'https://instagram.com/leeilyeoo',
              },
            },
            {
              name: '장은혜',
              role: 'ID',
              englishName: 'Eunhye Jang',
              profileImage: '/images/profile/eunhyejang.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/eunhye-jang-5373b4326/',
                behance: 'https://www.behance.net/ihaveaspirit',
                instagram: 'https://instagram.com/ihaveaspirit',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/projects/layon' }}
          nextItem={{ label: 'Next', url: '/projects/merlin' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'LAY.ON',
            koreanName: '레이온',
            linkUrl: '/projects/layon',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'MERLIN',
            koreanName: '멀린',
            linkUrl: '/projects/merlin',
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
