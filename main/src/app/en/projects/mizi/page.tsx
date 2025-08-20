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
    labels: [
      'Modeling',
      'Modeling',
      'Visual Study',
      'Modling',
      'Behind',
      'UI 작업화면',
      'Visual Study',
      '프로세스북 가인쇄',
      'Behind',
      'Idea Sketch',
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
    if (inView) setIsSidebarShown(false)
    else setIsSidebarShown(true)
  }, [inView, setIsSidebarShown])

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

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile || isTablet) return
      const windowWidth = window.innerWidth
      const mouseX = event.clientX
      const rightThirdThreshold = windowWidth * (2 / 3)
      setIsMouseInRightThird(mouseX >= rightThirdThreshold)
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
        svgSrc='/images/logo/Mizi_logo.svg'
        className='w-[74px] md:w-[74px] lg:w-[clamp(130px,9vw,229px)]'
        title={['MIZI', 'Into the Moment, MIZI']}
        description={
          'MIZI is an on-demand immersive experience platform that allows users to enter the world they desire—right here, right now—free from the limits of time and distance. Its telepresence avatar, NOMA, gathers sensory data from real locations and delivers it to users in real time through haptic devices, creating an experience that feels as if they’re truly there.\nStep into the moment you imagined. Fully, freely, in this very instant.'
        }
        credits='Jimin Park, Seunghwan Ra, Doyoung Kim, Junyoung Lee'
      />

      {/* HERO */}
      <MainImage Image='/images/projects/mizi/mizi_main.jpg' />

      <Divide title='Background' number='01' className='text-[#FF2A00]' />

      <TitleBody
        title={[
          <>
            The 'Instant' Society Life, <br className='hidden md:block' />
            On demand
          </>,
        ]}
        text='We live in an on-demand world—where a single click gets food delivered in under an hour, a package ordered today arrives by dawn, and a simple tap streams a full movie. Services like quick commerce and real-time streaming have become part of daily life, and for Generation Z, the idea of waiting has become almost unbearable.'
      />

      {/* Background visuals */}
      <Image Image='/images/projects/mizi/mizi_1.webp' />

      <TitleBody
        title={[
          <>
            Travel, <br className='hidden md:block' />
            The Last Realm of Waiting
          </>,
        ]}
        text='And yet, travel remains one of the few experiences that still demands waiting.Even after deciding to go, we must plan, prepare, and wait for the departure day to arrive. Many say this waiting is part of the journey—an essential, meaningful phase. But what if, in all that waiting, we’ve missed the moment we were meant to leave?'
      />

      <Image Image='/images/projects/mizi/mizi_2.jpg' />

      <Divide title='Insight' number='02' className='text-[#FF2A00]' />

      <TitleBody
        title={'Between Intention and Action,\nEmotional Time Lag'}
        text='When we feel down, we long for the ocean. When we’re exhausted, we crave the forest. But such desires are rarely fulfilled in the moment. The instant we decide to go, reality steps in—work, school, responsibilities. And by the time we finally arrive, weeks or months later, is that original feeling still with us? Between intention and action lies a wall of reality, and the time spent waiting creates a delay—not just in schedule, but in emotion.'
      />

      <Image Image='/images/projects/mizi/mizi_3.jpg' />

      <Divide title='Hypothesis' number='03' className='text-[#FF2A00]' />
      <MidTitle
        align='left'
        padding={false}
        text={[
          <>
            In the Years Ahead, <br className='block md:hidden' />
            How Technology Will Redefine Experience
          </>,
        ]}
      />
      <RightBody text='By definition, experience is what we see, hear, or feel—and the knowledge or skill gained from it. We perceive and understand the world by receiving sensory input, processing it in the brain, and storing it as memory. Now, technologies that extend perception by digitizing our senses—through XR and haptics—are evolving rapidly. In the near future, we’ll be able to replicate all senses in real time, reaching a point where the line between reality and the virtual dissolves. When that day comes, even the meaning of “I’ve been there” will change—and with it, the very way we define experience.' />

      <Image Image={['/images/projects/mizi/mizi_4.jpg', '/images/projects/mizi/mizi_5.jpg']} />

      <Divide title='Project Overview' number='04' className='text-[#FF2A00]' />
      <MidTitle align='center' className='text-[#FF2A00]' text='Into the Moment, MIZI' />

      {/* Overview video */}
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110676481?h=c5679d04aa'
        preloadDelayMs={0}
        hasAudio={true}
        prewarm
        muted={false}
        loop
      />

      <TitleBody
        title={'On-Demand Travel,\nMIZI'}
        text='MIZI is a platform that enables instant immersion into any desired world, unrestricted by time or distance. The moment a user envisions a particular feeling or atmosphere, NOMA, the avatar, seamlessly connects them to the most fitting physical space.'
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
        text='NOMA, MIZI’s telepresence avatar, transmits real-world sensory experiences on behalf of the user. Distributed across global locations, each NOMA collects diverse sensory data in real time and delivers it through the user’s haptic device. From sight and touch to synesthetic sensations, users can fully feel the scenery, textures, and even the movement of air—as if they were truly there.'
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
        text='Sensory input from NOMA’s built-in spatial and tactile sensors is transmitted directly to the user’s haptic device—raw and unfiltered. With 56 actuated joints, NOMA’s range of motion dynamically adapts to everyday human movements, seamlessly mirroring the user’s actions without dissonance.'
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
        title={'Curating Places in Real Time, by Mood'}
        text='Describe the mood or atmosphere your heart longs for. After scanning NOMA’s current locations, the MIZI:AI recommends the space that best matches your desired experience. You won’t know the exact coordinates—but you’ll know the mood, the textures, the sensations. Choose one or more curated destinations, and set off on a journey into the unknown. Each location is updated in real time with changes in weather and time of day.'
      />

      <Image Image='/images/projects/mizi/mizi_11.jpg' />

      <Divide title='Feature 02' number='07' className='text-[#FF2A00]' />

      <TitleBody
        title={'Seamless Immersion on the Move'}
        text='Does the place you arrived at feel a little underwhelming?Tell MIZI:AI what you’re looking for—what your emotions truly want. It will instantly curate a new destination that better matches your mood, and you can transition there right away. Go beyond a single space. Experience multiple locations, shifting atmospheres, and evolving sensations in a continuous flow. Design your own journey—freely, emotionally, and endlessly.'
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
        title={[
          <>
            On-Off <br className='hidden md:block' />
            Hybrid Experience
          </>,
        ]}
        text='Through MIZI’s avatar, users can explore objects in real time across various locations around the world. Items available for purchase on-site can be browsed remotely, and if desired, users can complete the transaction through the on-site system and the MIZI app. Purchased items are packaged and delivered later to the user’s own space. It’s a hybrid experience—merging the physical presence of offline with the convenience of online—offering the best of both worlds.'
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
        title={'An Auto-Archive for Every Moment'}
        text='While using MIZI, your connected devices detect physical signals like heart rate and blood pressure. Moments of deep calm or peak excitement are recognized, and the sensations you felt are automatically archived. Want to relive that moment? You can recall the sensations of that moment and experience it again—just as it was. Feel it all, anytime you choose.'
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
        title={'Freedom in Motion\n∞ Dune'}
        text='Trapped in the repetition of daily tasks and confined urban spaces, modern workers crave freedom from the weight of routine. MIZI’s avatar, NOMA:Dune, operates in harsh terrains like deserts, delivering a sense of liberation and speed—transmitting raw, open sensations that break away from the ordinary.'
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
        title={'Longing for the Ocean\n∞ Nautilus'}
        text='For those with limited mobility, the ocean remains one of the most inaccessible places. Navigating walkways, sand, and entering designated safe zones in the water is often a difficult or even impossible task. MIZI’s avatar, NOMA:Nautilus, is an underwater module that transmits oceanic sensations to the user—enabling immersive underwater experiences from rehabilitation centers, swimming pools, or wherever they may be.'
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
        title={'To infinity and beyond\n∞ Stardust'}
        text='Everyone has dreamed of space—vast, silent, and out of reach.
Now, with NOMA:Stardust, MIZI’s space avatar, that dream becomes real. Experience the galaxy beyond Earth in real time. With MIZI, the final frontier isn’t imagined—it’s lived.'
      />

      <Image Image='/images/projects/mizi/mizi_18.jpg' />

      <Divide title='Project Value' number='13' className='text-[#FF2A00]' />

      <MidBody
        align='center'
        content={
          <>
            MIZI redefines what ‘experience’ means in the age of advancing technology. In a world where every sense can
            be reproduced remotely and in real time, physical limitations no longer apply. From the everyday to the
            seemingly impossible, any destination is within reach. MIZI offers an on-demand immersive experience that
            turns distant dreams into reality.
            <br />
            <br />
            <a
              href='https://heyzine.com/flip-book/041d1f584b.html'
              className='underline text-[#FF2A00] font-semibold'
              target='_blank'
            >
              ▶ Click here for more MIZI stories.
            </a>
          </>
        }
      />

      <MidTitle align='center' text='A New Way of Seeing the World' />

      <Divide title='MIZI Branding Story' number='14' className='text-[#FF2A00]' />

      <TitleBody
        title={[
          <>
            Into a New World, <br />
            with Broadened Vision
          </>,
        ]}
        text='MIZI empowers users to expand their own personal worlds through the avatar NOMA. Even uncertain or undefined realms become clearer with MIZI by your side. At its core, MIZI is built on the value of expanding perception—a vision that shapes its unique brand identity.'
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
          previousItem={{ label: 'Previous', url: '/en/projects/autonomy-practice' }}
          nextItem={{ label: 'Next', url: '/en/projects/mizi' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/projects/autonomy_practice/autonomy_practice_thumbnail_1.jpg',
            englishName: 'Autonomy Practice',
            koreanName: '오토노미 프랙티스',
            linkUrl: '/en/projects/autonomy-practice',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/projects/cruise/cruise1_thumbnail_1.jpg',
            englishName: 'CRUISE',
            koreanName: '크루즈',
            linkUrl: '/en/projects/cruise',
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
