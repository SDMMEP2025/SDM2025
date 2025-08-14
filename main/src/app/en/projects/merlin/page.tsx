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
      { name: '이우성', englishName: 'Wooseong Lee' },
      { name: '박수경', englishName: 'Sukyung Park' },
    ],
  },
  {
    title: 'UX tutor',
    tutors: [{ name: '이진원', englishName: 'Jinwon Lee' }],
  },
]

const thankstoData = [
  {
    title: 'Videographer',
    tutors: [{ name: '서영진', englishName: 'Youngjin Seo' }],
  },
  {
    title: 'Adviser',
    tutors: [
      { name: '김도아', englishName: 'Doa Kim' },
      { name: '박상희', englishName: 'Sanghee Park' },
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
      <Header />
      <Summary
        svgSrc='/images/logo/Merlin_logo.svg'
        className='w-[52px] md:w-[100px] lg:w-[clamp(100px,10vw,144px)]'
        title={['Merlin', 'Into Your Flow, Merlin OS']}
        description='Merlin OS is a flow operating system. It helps you reach your goals faster by minimizing app switching and cutting through complexity.  It understands your context in real time and connects features across apps into one seamless experience. Forget rigid, app-centered interfaces. Merlin offers a more flexible, more immersive way to work. Your digital journey starts here.'
        credits='Yumin Kim, Soeun Lee, Jiwon An, Junhong Yang, Seohyeon Cho'
      />
      <MainImage Image='/images/projects/cruise/image1.png' />
      <Divide title='Background' number='01' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'Static UI,\nlayered like blocks'}
        text='Everyone uses their phone differently: the apps they use, how they arrange their home screen, how they hold it, even how hard they press the screen.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody
        text='However, today’s mobile interfaces weren’t designed for these differences.
They offer the same buttons, in the same spots, to every people. 
Features are stacked like blocks on a fixed grid, waiting passively for you to learn and adapt.'
      />
      <Divide number='02' title='Target' />

      <Image Image='/images/projects/cruise/cruise_2.jpg' />

      <TitleBody
        title={'Gen Z, Caught in Endless Digital Dribbling'}
        text='For Gen Z, Current User Interaction doesn’t match how they use apps. Gen Z tends to interact through quick tab switching and often experiences “digital dribbling” repeatedly going back and forth between launchers or recent tabs during their exploration.'
      />
      <Divide number='03' title='Research' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />

      <TitleBody
        title={'The Same Maze,\nThe Same Moves'}
        text={
          <>
            Gen Z uses only the features. They might have around 130 apps on their phones, but typically use just 12 of
            them more than 10 times a week. Even within those apps, they stick to a few familiar actions. For them, the
            digital world is a familiar maze—complex on the surface, but made up of the same taps and same turns.
            <br />
            <br />
            <a href='https://umin.notion.site/merlinos' className='underline font-semibold' target='_blank'>
              ▶︎ More Detailed UX Process
            </a>
          </>
        }
      />
      <Divide number='04' title='Problem' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'One goal,\nToo much Distractions.'}
        text={
          'Gen Z uses digital tools quickly, but they often jump between lots of screens to achieve a single goal. Like the home, app drawer, recent apps, and search. They waste time and energy. These interruptions slow them down, break their flow, and make them tired.'
        }
      />
      <Divide number='05' title='Insight' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'Gen Z needs flow,\nnot apps'}
        text={
          'Apps are built to deliver features. But this setup often interrupts the flow. What if the features needed were all connected in one seamless path—no digging through layers? A flow design that understands work and predicts what comes next, guiding progress.'
        }
      />
      <Divide number='06' title='Solution' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidTitle text='Into Your Flow, Merlin OS' padding={false}/>
      <MidBody
        content={
          'Merlin OS is the next-generation operating system.\nIt remakes features based on context and breaks down app boundaries to create one seamless, continuous experience.\nYou do not have to think about controls, so you can stay fully focused.'
        }
      />
      <Divide number='07' title='Scenario' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'Three experiences, all flowing together'}
        text={
          'Merlin OS is a flow-centered experience. Merlin OS is designed with your context and habits, built on three key principles: Contextual Flow, Appless Interface, and Flexible UI. So you can follow a natural flow and get things done faster without learning complex interfaces.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title={'Contextual Flow:\nJust what you need, at just the right time.'}
        text='Merlin OS understands your time, place, and even how you hold your device—and adjusts the flow to match. Experience the new digital journey that feels effortless and naturally in sync with your world.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody text='Merlin OS recognizes your time, location, and habits to automatically organize the right set of tools. No more jumping between apps. Merlin OS opens what you need instantly. So you can get things done without any extra searching.' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title={'Appless Interface:\nOne seamless experience. No distractions.'}
        text='Experience flow, not apps. No more digging through menus—everything you need comes together seamlessly on one screen.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody text='Flow smoothly, without any interruptions or distractions. No more switching between apps or navigating complicated steps. Everything you need happens seamlessly on a single screen, making it effortless to get things done.' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title='Flexible UI: so you stay focused'
        text='Flexible UI provides interactions built around the essential roles of focus and control. Information and controls remain separate—an information layer designed for deep focus, and a control layer crafted to move naturally.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody text='Based on your hand position, habits, and interactions, controls are intelligently arranged. So you can access what you need easily.' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide number='08' title='Value' />
      <MidTitle text='Merlin OS’s new digital flow' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'Focus with an OS\nthat gets you'}
        text={
          'Merlin OS reduces mental and physical stress by using a seamless flow—no more app switching. So you can focus on what matters right away. With no setup needed, Merlin OS learns from your choices and adapts over time, becoming a smart, personalized OS made just for you.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'User experiences connected by flow'}
        text={
          'Merlin OS provides a consistent, flow-based architecture across multiple devices. It delivers a seamless, boundary-free experience. If you have a business, Merlin OS gives you a solid foundation to build a sustainable multi-platform ecosystem.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />

      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '김유민',
              role: 'PL · UX',
              englishName: 'Yumin Kim',
              profileImage: '/images/profile/yuminkim.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/kmyumn/',
                behance: 'https://www.behance.net/kmyumn',
                instagram: 'https://instagram.com/k_.myum_.n',
              },
            },
            {
              name: '이소은',
              role: 'UX',
              englishName: 'Soeun Lee',
              profileImage: '/images/profile/soeunlee.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/dllthdms',
                instagram: 'https://instagram.com/dllthdms',
              },
            },
            {
              name: '안지원',
              role: 'UX',
              englishName: 'Jiwon An',
              profileImage: '/images/profile/jiwonan.png',
              socialLinks: {
                linkedin: '',
                behance: '',
                instagram: 'https://instagram.com/2woniee',
              },
            },

            {
              name: '양준홍',
              role: 'VD',
              englishName: 'Junhong Yang',
              profileImage: '/images/profile/junhongyang.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/JunRed',
                instagram: 'https://instagram.com/jun.__.blue',
              },
            },
            {
              name: '조서현',
              role: 'UX',
              englishName: 'Seohyeon Cho',
              profileImage: '/images/profile/seohyeoncho.png',
              socialLinks: {
                linkedin: '',
                behance: '',
                instagram: 'https://instagram.com/zo.xhyn',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/en/projects/hotcake' }}
          nextItem={{ label: 'Next', url: '/en/projects/autonomy-practice' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'HOTCAKE',
            koreanName: '핫케익',
            linkUrl: '/en/projects/hotcake',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'AUTONOMY PRACTICE',
            koreanName: '오토노미 프랙티스',
            linkUrl: '/en/projects/autonomy-practice',
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
