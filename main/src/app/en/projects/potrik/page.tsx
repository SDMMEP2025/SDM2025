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
    title: 'Advisor',
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
      '/images/projects/potrik/archive/1.jpg',
      '/images/projects/potrik/archive/2.jpg',
      '/images/projects/potrik/archive/3.jpg',
      '/images/projects/potrik/archive/4.jpg',
      '/images/projects/potrik/archive/5.jpg',
      '/images/projects/potrik/archive/6.jpg',
      '/images/projects/potrik/archive/7.jpg',
      '/images/projects/potrik/archive/8.jpg',
      '/images/projects/potrik/archive/9.jpg',
      '/images/projects/potrik/archive/10.jpg',
    ],
    labels: [
      'Form Study',
      'Photoshoot',
      'Ideation',
      'Mockup',
      'Prototyping',
      'Modeling',
      'Affinity diagram',
      'Behind',
      'Prototyping',
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
        svgSrc='/images/logo/Potrik_logo.svg'
        title={[
          'POTRIK',
          <>
            'No pack, No stop. <br className='md:hidden' />
            Just POTRIK'
          </>,
        ]}
        description={
          <>
            POTRIK offers a new way of living—one where you no longer have to carry your baggage by hand. No more
            complicated reservations or heavy bags to carry. Send and receive items effortlessly, along your path. Both
            hands are free, and your journey flows more freely than ever with POTRIK.
            <br />
            <br />
            POTRIK—the delivery system that makes every moment easier.
          </>
        }
        credits='Yungwon Kang, Hyogyeong Park, Hyeonji Yang, Jueun Lee, Hyeongjoon Joo'
        className='w-[144px] md:w-[144px] lg:w-[clamp(180px,21.3vw,308px)]'
      />

      {/* HERO */}
      <Image Image='/images/projects/potrik/potrik_main.jpg' />

      <Divide title='Background' number='01' className='text-[#09C17A]' />
      <TitleBody
        title={
          <>
            Free to Move, <br className='hidden md:block' />
            Heavy to Carry
          </>
        }
        text={
          <>
            As technology evolves, we can now move farther, more often, and more freely than ever before.
            <br />
            However, we still face challenges that disrupt our ability to move around. Like bulky laptop bags, winter
            coats, and shopping bags that fill both hands. We still carry too much, and it slows us down. <br />
            <br />
            What if every journey began and ended with nothing to carry?POTRIK was born from this simple idea.
          </>
        }
      />
      <Image Image='/images/projects/potrik/potrik_1.webp' />

      <Divide title='New Lifestyle' number='02' className='text-[#09C17A]' />
      <TitleBody
        title={
          <>
            Move Light, from
            <br />
            Beginning to End
          </>
        }
        text={
          <>
            No more changing your path because of heavy bags, looking for public lockers, or walking extra just to hand
            something off.
            <br />
            POTRIK is a new delivery system that lets you send and receive items exactly at the right moment.
            <br />
            <br />
            This is the freedom of movement we have always dreamed of.
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
            Send your items now, and receive them at your destination.
            <br />
            Use the app to call POTRIK and store whatever has been weighing you down.
            <br />
            POTRIK delivers your baggage to the destination you have set.
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
            POTRIK is a modular sharing mobility with a detachable structure, designed to easily switch between roads
            and sidewalks. Carry your baggage quickly and directly wherever you go.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110679279?h=743bbc4061'
        preloadDelayMs={0}
        hasAudio={true}
        prewarm
        muted={false}
        loop
      />
      <ImageGallery images={['/images/projects/potrik/potrik_5.jpg', '/images/projects/potrik/potrik_6.jpg']} />

      <TitleBody
        title={<>Driving Module</>}
        text={
          <>
            Driving Module is designed to transport items quickly and efficiently on roads.
            <br />
            <br />
            When you request it, you’ll see Driving Module, which was waiting at the charging station, combine into a
            single unit. Then baggage is safely and quickly delivered to your destination.
          </>
        }
      />
      <Image Image='/images/projects/potrik/potrik_7.webp' />

      <TitleBody
        title={<>Storage Module</>}
        text={
          <>
            Storage Module safely stores your baggage. It is designed to navigate sidewalks and approach building
            entrances to reach you.
            <br />
            <br />
            Near the destination, Storage Module detaches from Driving Module and autonomously moves to the destination,
            making it easy to connect with you along your route.
          </>
        }
      />
      <Image Image='/images/projects/potrik/potrik_8.webp' />

      <MidTitle align='center' text=' Ready to experience POTRIK?' padding={true} className='text-[#09C17A]' />
      <Image Image='/images/projects/potrik/potrik_9.jpg' />

      <Divide title='Scenario' number='05' className='text-[#09C17A]' />
      <TitleBody
        title={
          <>
            S1. <br className='hidden md:block' />
            Shopping During Trip
          </>
        }
        text={
          <>
            Too much baggage and stuff can easily disrupt your trip.
            <br />
            <br />
            If you travel around cities like Seongsu, Hongdae, or Yeonnam, you often carry heavy bags and shopping bags.
            You might also need to search for a public locker to store your belongings.
            <br />
            <br />
            POTRIK changes how you experience everyday hassles. No more carrying. No more interruptions. Just a smooth,
            natural journey through the city. POTRIK keeps your journey light and seamless.
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
            Call POTRIK to your location through the app, or simply tap the NFC on a sidewalk Storage Module to drop off
            your bags. Set your next stop and time, and POTRIK will be there waiting.
            <br />
            <br />
            If you want to send several items several times during a day? Try 24H PASS. So you can use POTRIK anytime,
            anywhere—no need to set your destination.
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
            You can check the real-time location and status of your belongings through the POTRIK app.
            <br />
            <br />
            With the 24H PASS, POTRIK moves to nearby stations along your route, staying ready to respond anytime and
            anywhere.
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
            With POTRIK, your items arrive exactly where and when you need them.
            <br />
            Just tap with NFC, and Storage Module opens—letting you grab your baggage quickly and effortlessly.
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
        title={
          <>
            S2. <br className='hidden md:block' />
            After shopping, your hands-free
          </>
        }
        text={
          <>
            From grocery shopping to a playground — your hands are free.
            <br />
            <br />
            Imagine moments when your kids want to go to the playground after grocery shopping. Before, heavy bags meant
            going straight home — no chance to stop and play. Now, you send your bags home and let your kids run free.
            <br />
            <br />
            Even the unexpected feels lighter.
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
        title={<>S3. Marketplace</>}
        text={
          <>
            ”Could you send it to POTRIK please?“
            <br />
            <br />
            Imagine you are working in a coffee shop, and your laptop charger is broken.You used to have to pick one up
            yourself. Now, you can get what you need delivered right where you are.
            <br />
            <br />
            No extra walking, no hassle, just send and receive what you need, exactly when you need it. POTRIK changes
            the way your day flows.
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
            No more moving things from place to place.
            <br />
            POTRIK works like a new personal and flexible delivery system.
            {' '}
            <br className='hidden md:block'/>
            From [Here] to [Here], POTRIK moves with you.
          </>
        }
      />
      <Image Image='/images/projects/potrik/potrik_16.webp' />
      <MidTitle align='center' text='POTRIK, the personal delivery system that lightens every moment.' />
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
          previousItem={{ label: 'Previous', url: '/en/projects/silmul' }}
          nextItem={{ label: 'Next', url: '/en/projects/newbe' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/projects/silmul/silmul_thumbnail_1.jpg',
            englishName: 'Silmul',
            koreanName: '실물',
            linkUrl: '/en/projects/silmul',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/projects/newbe/newbe_thumbnail_1.jpg',
            englishName: 'Newbe',
            koreanName: '뉴비',
            linkUrl: '/en/projects/newbe',
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
