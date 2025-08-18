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
      '/images/projects/merlin/archive/1.jpg',
      '/images/projects/merlin/archive/2.jpg',
      '/images/projects/merlin/archive/3.jpg',
      '/images/projects/merlin/archive/4.jpg',
      '/images/projects/merlin/archive/5.jpg',
      '/images/projects/merlin/archive/6.jpg',
      '/images/projects/merlin/archive/7.jpg',
      '/images/projects/merlin/archive/8.jpg',
      '/images/projects/merlin/archive/9.jpg',
      '/images/projects/merlin/archive/10.jpg',
    ],
  },
]

export default function Page() {
  const [isMouseInRightThird, setIsMouseInRightThird] = useState(false)
  const [isSidebarShown, setIsSidebarShown] = useState(true)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [currentPoint, setCurrentPoint] = useState(points[0])

  const designedByRef = useRef<HTMLDivElement>(null)

  const inView = useInView(designedByRef, {
    amount: 0.1,
    once: false,
  })

  useEffect(() => {
    // Hide sidebar when the Credits section is visible
    setIsSidebarShown(!inView)
  }, [inView])

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1440)
    }
    checkDeviceType()
    window.addEventListener('resize', checkDeviceType)
    return () => window.removeEventListener('resize', checkDeviceType)
  }, [])

  // Track mouse position on desktop only
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile || isTablet) return
      const rightThirdThreshold = window.innerWidth * (2 / 3)
      setIsMouseInRightThird(event.clientX >= rightThirdThreshold)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, isTablet])

  const handleSidebarExpandedChange = (expanded: boolean) => {
    setIsSidebarExpanded(expanded)
  }

  const shouldShowSidebar = isMobile || isTablet || isMouseInRightThird || isSidebarExpanded

  return (
    <>
      <Blank />
      <Header />
      <Summary
        svgSrc='/images/logo/Merlin_logo.svg'
        className='w-[52px] md:w-[100px] lg:w-[clamp(100px,10vw,144px)]'
        title={['Merlin', 'Into Your Flow, Merlin OS']}
        description='Merlin OS is a flow operating system. It helps you reach your goals faster by minimizing app switching and cutting through complexity. It understands your context in real time and connects features across apps into one seamless experience. Forget rigid, app-centered interfaces—Merlin offers a more flexible, immersive way to work. Your digital journey starts here.'
        credits='Yumin Kim, Soeun Lee, Jiwon An, Junhong Yang, Seohyeon Cho'
      />

      <Image Image='/images/projects/merlin/merlin_main.jpg' />

      {/* 01. Background */}
      <Divide title='Background' number='01' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110984354?h=fdebbff948'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <TitleBody
        title={'Static UI,\nlayered like blocks'}
        text='Everyone uses their phone differently: the apps they use, how they arrange the home screen, how they hold it, even how hard they press.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110984418?h=fa502d17c2'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <RightBody text="Yet today's mobile interfaces ignore these differences. The same buttons sit in the same places for everyone. Features stack like blocks on a fixed grid, passively waiting for you to learn and adapt." />

      {/* 02. Target */}
      <Divide number='02' title='Target' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110984446?h=68d550246a'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <TitleBody
        title={'Gen Z, caught in endless digital dribbling'}
        text='Static UI clashes with how Gen Z explores: rapid tab switching, hopping between launcher and recent tabs—repeating “digital dribbling” just to move forward.'
      />

      {/* 03. Research */}
      <Divide number='03' title='Research' />
      <Image Image='/images/projects/merlin/merlin_4.jpg' />
      <TitleBody
        title={'The familiar maze,\n the same moves'}
        text={
          <>
            Gen Z tends to focus on a small subset of features. They may have ~130 apps installed, but on average use
            only about 12 more than 10 times a week. Even inside those apps, a few actions dominate. The digital world
            becomes a familiar maze—complex on the surface, but navigated by the same taps and turns.
            <br />
            <br />
            <a href='https://umin.notion.site/merlinos' className='underline font-semibold' target='_blank'>
              ▶︎ More detailed UX process
            </a>
          </>
        }
      />

      {/* 04. Problem */}
      <Divide number='04' title='Problem' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110984480?h=8e144c0440'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <TitleBody
        title={'One goal,\ntoo many distractions'}
        text='Even to achieve a clear, single objective, people bounce through home screens, drawers, recents, and in-app navigation—wasting time and energy. These “speed bumps” break flow and add cognitive fatigue.'
      />

      {/* 05. Insight */}
      <Divide number='05' title='Insight' />
      <Image Image='/images/projects/merlin/merlin_6.webp' />
      <TitleBody
        title={'Gen Z needs flow,\nnot apps'}
        text='Apps are containers for features—but that container often interrupts flow. What if the needed features were connected into one continuous path from the start, guided by context and prediction?'
      />

      {/* 06. Solution */}
      <Divide number='06' title='Solution' />
      <Image Image='/images/projects/merlin/merlin_7.jpg' />
      <Image Image='/images/projects/merlin/merlin_8.jpg' />
      <MidTitle text='Into Your Flow, Merlin OS' padding={false} />
      <MidBody
        content={
          'Meet Merlin OS, a flow-first operating system.\nMerlin reshapes functions by context and bridges app boundaries to deliver one continuous experience.\nYou no longer think about the controls—you stay in the zone.'
        }
      />

      {/* 07. Scenario */}
      <Divide number='07' title='Scenario' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110680696?h=deddf9c47a'
        preloadDelayMs={0}
        hasAudio={true}
        prewarm
        muted={false}
        loop
      />
      <TitleBody
        title={'Three experiences,\nall flowing together'}
        text='Built on three principles—Contextual Flow, Appless Interface, and Flexible UI—Merlin adapts to your context and habits. You simply follow the flow and arrive faster, without learning complex interfaces.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110680719?h=578ca2f36a'
        preloadDelayMs={0}
        prewarm
        loop
      />

      {/* Contextual Flow */}
      <RightTitleBody
        title={'Contextual Flow:\nJust what you need, right when you need it'}
        text='Merlin understands time, place, and even your grip patterns to compose flows that match your situation—so your digital journey feels natural and effortless.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110680726?h=34144850a1'
        preloadDelayMs={0}
        prewarm
        loop
      />
      <RightBody text='By recognizing your time, location, and habits, Merlin automatically assembles the right tools. No redundant app hopping—what you need opens together on one screen.' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110680730?h=e5b347252a'
        preloadDelayMs={0}
        prewarm
        loop
      />

      {/* Appless Interface */}
      <RightTitleBody
        title={'Appless Interface:\nOne seamless experience'}
        text='Experience flows—not apps. You never dig through menus; functions come together on a single, continuous surface.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110680738?h=3a7f1783f6'
        preloadDelayMs={0}
        prewarm
        loop
      />
      <RightBody text='No laddering through hierarchies or switching between containers. The entire process happens in sequence on one screen—frictionless, distraction-free.' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110680745?h=4bc8cbf305'
        preloadDelayMs={0}
        prewarm
        loop
      />

      {/* Flexible UI */}
      <RightTitleBody
        title='Flexible UI: immersion, made practical'
        text='Interactions align to their essential roles—information for deep focus, controls for natural action—kept in distinct layers instead of being crammed together.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110680752?h=4ce0509902'
        preloadDelayMs={0}
        prewarm
        loop
      />
      <RightBody text='Controls recompose around your hand position, habits, and patterns—so you reach intended actions with minimal movement.' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110680764?h=b30313eef1'
        preloadDelayMs={0}
        prewarm
        loop
      />

      {/* 08. Value */}
      <Divide number='08' title='Value' />
      <MidTitle text='Merlin OS’s new digital flow' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110680777?h=f57c2cbfec'
        preloadDelayMs={0}
        prewarm
        loop
      />
      <TitleBody
        title={'Seamless focus,\nan OS that learns you'}
        text='With one uninterrupted flow (no app switching), Merlin reduces cognitive and operational fatigue—letting you focus immediately. Without explicit setup, it learns from your choices and interactions, evolving into a refined, personalized, algorithmic OS.'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110984503?h=34ff1adeac'
        preloadDelayMs={0}
        prewarm
        loop
      />
      <TitleBody
        title={'User experiences\nconnected by flow'}
        text='Merlin runs primarily on mobile, yet extends fluidly to AR, tablets, and desktops. A consistent, flow-based architecture brings boundary-less experiences to people and gives businesses a durable foundation for a multi-platform ecosystem.'
      />
      <Image Image='/images/projects/merlin/merlin_19.webp' />
      <Image Image='/images/projects/merlin/merlin_20.jpg' />
      <Image Image='/images/projects/merlin/merlin_21.webp' />

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
            imageUrl: '/images/projects/hotcake/hotcake_thumbnail_1.jpg',
            englishName: 'HOTCAKE',
            koreanName: '핫케익',
            linkUrl: '/en/projects/hotcake',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/projects/autonomy_practice/autonomy_practice_thumbnail_1.jpg',
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
