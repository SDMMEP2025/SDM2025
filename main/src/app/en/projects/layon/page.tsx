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
  const [currentPoint, setCurrentPoint] = useState(points[0])

  const designedByRef = useRef<HTMLDivElement>(null)

  const inView = useInView(designedByRef, {
    amount: 0.1,
    once: false,
  })

  useEffect(() => {
    if (inView) {
      setIsSidebarShown(false)
    } else {
      setIsSidebarShown(true)
    }
  }, [inView, setIsSidebarShown])

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1440)
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
      <Blank />
      <Header />
      <Summary
        svgSrc='/images/logo/Layon_logo.svg'
        title={['LAY.ON', 'Get your layer on, LAY.ON']}
        description={
          <>
            LAY.ON defines the future of devices and apps, powered by smarter Artificial Intelligence. We share our
            vision with AI, so it understands us deeply. No more opening apps. AI delivers the right experience, exactly
            when you need it. This is the new digital life. LAY.ON studies the best devices to capture your visual data
            and how AI brings experiences to life. We shape the future of user experience with AI. Open a new layer of
            experience.
          </>
        }
        credits='Haeri Ryoo, Seohyun Kim, Minhee Kim, Yubin Seo, Wanhyeok Choi'
        className='w-[133px] md:w-[196px] lg:w-[clamp(196px,21.3vw,308px)]'
      />

      {/* HERO */}
      <MainImage Image='/images/projects/layon/layon_main.jpg' />

      <Divide title='Background' number='01' className='text-[#417EB4]' />

      {/* Background image (same 위치 as KR) */}
      <Image Image='/images/projects/layon/layon_01.jpg' />

      <TitleBody
        title={
          <>
            AI understands
            <br />
            the world like you do
          </>
        }
        text={
          <>
            There is a lot of meaning in where you look, what you focus on, and for how long.It reflects your attention,
            intent, and the context. What if AI could see what you see? Multimodal AI processes the vision data from
            you, allowing AI to start understanding you and the world in a deeper way. Discover new possibilities—ones
            that could fundamentally change how we live and interact with technology.
          </>
        }
      />

      <Divide title='Problem' number='02' className='text-[#417EB4]' />

      {/* Problem key visual */}
      <Image Image='/images/projects/layon/layon_02.webp' />

      <TitleBody
        title={
          <>
            Preparing for
            <br />
            the future
          </>
        }
        text={
          <>
            Right now, we already have vision data, but its functions are limited. People still have to turn on cameras
            and search for information themselves. That is why we need new devices and services that can capture what is
            happening around people and suggest the experiences that people need.
          </>
        }
      />

      <Divide title='Project Overview' number='03' className='text-[#417EB4]' />
      <MidTitle align='center' text='Get your layer on, LAY.ON' />

      {/* Overview video */}
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
            When AI can see and understand what we see, our vision takes on new meaning and power.
            <br />
            Information that was invisible comes into view, and actions are triggered just by looking.
            <br />
            LAY.ON provides new design principles to help bring this future to life.
          </>
        }
      />

      <Divide title='Design Strategy' number='04' className='text-[#417EB4]' />

      {/* Strategy image */}
      <Image Image='/images/projects/layon/layon_04.jpg' />

      <TitleBody
        title={
          <>
            As much
            <br />
            as you need
          </>
        }
        text={
          <>
            People naturally filter the world around them—focusing only on what captures their interest. Our vision
            moves unconsciously and naturally, which is why small interruptions can feel intrusive. LAY.ON and OS are
            designed with these behaviors. From the built-in sensors to the timing of AI suggestions, everything is
            carefully crafted to provide an experience that feels just right. It’s subtle, natural, and never
            overwhelming.
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
            Next-generation devices
            <br />
            optimized for vision data
          </>
        }
      />

      {/* Product intro video */}
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
            To capture vision data, devices need to be close to your eyes. That’s why AR glasses—often called the
            next-generation device—are perfectly suited for the role. But what kind of technology will these AR glasses
            need, and what will their design look like?
          </>
        }
      />

      {/* Product images */}
      <Image Image='/images/projects/layon/layon_06.jpg' />

      <TitleBody
        title={
          <>
            Only the essentials,
            <br />
            kept light.
          </>
        }
        text={
          <>
            LAY.ON includes only the essential technologies to capture high-quality vision data and the surrounding
            environment. The weight is carefully balanced around the front, back, and sides of the device, making it
            feel lightweight and fit naturally on your face.
          </>
        }
      />
      <Image Image='/images/projects/layon/layon_07.jpg' />
      <Image Image='/images/projects/layon/layon_08.jpg' />

      <TitleBody
        title={
          <>
            The perfect pick for
            <br />
            today’s vibe.
          </>
        }
        text={
          <>
            Gen Z wears glasses as a fashion item. They have multiple glasses for different looks and functions. LAY.ON
            features a modular design that lets you easily swap ‘Face’ and ‘Line’. So you can change your style to match
            your vibes.
          </>
        }
      />

      {/* Modular swap video */}
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
            Choose Face that fits your outfit and today vibes. With diverse styles, LAY.ON collects vision data
            seamlessly—no matter where you go or what you’re wearing.
          </>
        }
      />

      <Image Image='/images/projects/layon/layon_12.jpg' />

      <TitleBody
        title={
          <>
            Not in use,
            <br />
            still in style
          </>
        }
        text={
          <>
            Gen Z only wears glasses when they need them, like when reading or working. AR glasses will be the same.
            Take them off quickly and put them back on just as easily. If you don’t use it now? Use AR glasses like a
            keychain—a fashion accessory that shows off your vibes.
          </>
        }
      />
      <Image Image='/images/projects/layon/layon_13.jpg' />

      <Divide title='Our OS' number='06' className='text-[#417EB4]' />
      <LeftTitle text={<>A new paradigm that knows what you need.</>} />

      {/* OS video (has audio) */}
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
            You don’t need to open apps anymore—AI brings what you need, when you need it. As this kind of proactive
            system becomes the norm, the way we design services must evolve too. LAY.ON introduces a new standard for
            usability, built for an AI-driven world.
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
        title={<>Vision is the trigger</>}
        text={
          <>
            AI understands your behavior, surroundings, interests, and habits through vision data. This information
            provides clues to the intent behind your vision.
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
            App experiences should be triggered and recommended based on clear, well-defined data criteria. The right
            timing and relevance are essential to creating a satisfying experience.
          </>
        }
      />

      <Image Image='/images/projects/layon/layon_18.jpg' />

      <TitleBody
        title={
          <>
            Options for what
            <br />
            matters most
          </>
        }
        text={
          <>
            Sometimes, multiple features may be suggested at once. LAY.ON makes sure this never feels overwhelming.
            Instead, it highlights the options clearly and guides you smoothly to the feature you actually need.
          </>
        }
      />

      <Image Image='/images/projects/layon/layon_19.jpg' />

      <TitleBody
        title={
          <>
            Natural,
            <br />
            yet Clear
          </>
        }
        text={
          <>
            When apps run automatically, it’s important to clearly show which app and feature are in use. LAY.ON allows
            you to stay naturally aware of what is happening. It provides this information in a way that does not
            interrupt the view.
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
          previousItem={{ label: 'Previous', url: '/en/projects/newbe' }}
          nextItem={{ label: 'Next', url: '/en/projects/hotcake' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/projects/newbe/newbe_thumbnail_1.jpg',
            englishName: 'Newbe',
            koreanName: '뉴비',
            linkUrl: '/en/projects/newbe',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/projects/hotcake/hotcake_thumbnail_1.jpg',
            englishName: 'Hotcake',
            koreanName: '핫케익',
            linkUrl: '/en/projects/hotcake',
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
