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
      { name: '나하나', englishName: 'Hana Na' },
      { name: '권진형', englishName: 'Jinhyeong Kwon' },
      { name: '정재연', englishName: 'Jaeyun Jung' },
      { name: '김승우', englishName: 'Seungwoo Kim' },
      { name: '김지윤', englishName: 'Jiyoun Kim' },
    ],
  },
]

const thankstoData = [
  {
    title: 'Photographer',
    tutors: [{ name: '권진형', englishName: 'Jinhyeong Kwon' }],
  },
  {
    title: 'Model',
    tutors: [{ name: '이효재', englishName: 'Hyojae Lee' }],
  },
  {
    title: 'Textile Designer',
    tutors: [
      { name: '박나은', englishName: 'Naeun Pak' },
      { name: '김규림', englishName: 'Gyurim Kim' },
    ],
  },
]

const points = [
  {
    id: '1',
    top: '50%',
    left: '50%',
    images: [
      '/images/projects/autonomy_practice/archive/1.jpg',
      '/images/projects/autonomy_practice/archive/2.jpg',
      '/images/projects/autonomy_practice/archive/3.jpg',
      '/images/projects/autonomy_practice/archive/4.jpg',
      '/images/projects/autonomy_practice/archive/5.jpg',
    ],
    labels: ['Form Study', 'Idea Sketch', 'Experiment', 'Form Study', 'Modeling'],
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
    return () => {
      window.removeEventListener('resize', checkDeviceType)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile || isTablet) return
      const windowWidth = window.innerWidth
      const rightThirdThreshold = windowWidth * (2 / 3)
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
        svgSrc='/images/logo/AutonomyPractice_logo.svg'
        className='w-[132px] md:w-[132px] lg:w-[clamp(180px,16vw,229px)]'
        title={['Autonomy Practice', 'Act Then Build']}
        description='Autonomy Practice is an experimental footwear brand that challenges how materials are used. We treat CMF not just as a surface detail, but as a responsive element that adapts to its environment. This belief led us to design self-disassembling shoes using shape memory polymers (SMP). Footwear that assembles and comes apart on its own—redefining the boundary between creation and consumption.'
        credits='Jeseok Poong, Minhee Lee, Seungmin Ha, Minyoung Jeong, Yujin Jung'
      />

      {/* Main image */}
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_main.jpg' />

      {/* Hero video (has audio) */}
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110918569?h=f95d5d87e2'
        preloadDelayMs={0}
        hasAudio={true}
        prewarm
        muted={false}
        loop
      />

      <Divide title='Context' number='01' className='text-[#949598]' />
      <MidBody
        align='left'
        content='CMF has long been about enhancing how products look and feel. At Autonomy Practice, we redefine our role, seeing CMF as an active material that responds to its environment and transforms the product itself. This perspective inspired us to explore shape memory polymers (SMP), materials that change shape with temperature. By blending adaptive materials with product design, we’re discovering new ways to shape interaction, meaning, and use.'
      />

      {/* Context images / video */}
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_2.webp' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110685628?h=2c55296633'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_4.jpg' />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_5.webp' />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_6.jpg' />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_7.jpg' />

      <Divide title='Structure' number='02' className='text-[#949598]' />
      <MidBody
        align='left'
        content={
          'Shape Memory Polymers (SMP) can be set to react between 25°C and 90°C. When heated to a certain temperature, SMP becomes soft and flexible. When it cools down, it hardens in that shape. Heat it again, and it goes back to its original form. After testing, we chose 80°C as the best temperature for our design.\n\nBased on this, we made a shoe that can be put together when hot, stays strong at room temperature, and can be taken apart easily by heating again. We get rid of glued construction and move to an assembly-based design. This change offers a new way to make and use complex products like footwear. It transforms the whole process, from production to how people experience the product.'
        }
      />

      {/* Structure images / video */}
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_8.jpg' />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_9.jpg' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110685706?h=aabdb47992'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />

      <Divide title='Practice Log' number='03' className='text-[#949598]' />
      <MidBody
        align='left'
        content={
          'Autonomy Practice approaches materials with autonomy, exploring how this shapes structure and form. We record the design journey that comes from the interaction between dynamic materials and products, and share it as a unified process.'
        }
      />

      {/* Practice log images / videos */}
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_11.webp' />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_12.jpg' />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_13.jpg' />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_14.jpg' />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_15.webp' />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_16.jpg' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110685738?h=4d907155e1'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Image Image='/images/projects/autonomy_practice/autonomy_practice_18.jpg' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110685765?h=7aaba7ed6f'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />

      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '풍제석',
              role: 'PL · ID',
              englishName: 'Jeseok Poong',
              profileImage: '/images/profile/jeseokpoong.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/jspoong',
                instagram: 'https://instagram.com/jeseok_id',
              },
            },
            {
              name: '이민희',
              role: 'BX',
              englishName: 'Minhee Lee',
              profileImage: '/images/profile/minheelee.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/minhe01295a2b',
                instagram: 'https://instagram.com/minheecar',
              },
            },
            {
              name: '하승민',
              role: 'ID',
              englishName: 'Seungmin Ha',
              profileImage: '/images/profile/seungminha.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/haseungmin',
                instagram: 'https://instagram.com/Pro.__.dukt',
              },
            },
            {
              name: '정민영',
              role: 'ID',
              englishName: 'Minyoung Jeong',
              profileImage: '/images/profile/minyoungjeong.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/meenzro',
                instagram: 'https://instagram.com/meeenork',
              },
            },
            {
              name: '정유진',
              role: 'VD',
              englishName: 'Yujin Jung',
              profileImage: '/images/profile/yujinjung.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/jungyujin_',
                instagram: 'https://instagram.com/ujin_tonic',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />

        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/en/projects/merlin' }}
          nextItem={{ label: 'Next', url: '/en/projects/mizi' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/projects/merlin/merlin_thumbnail_1.jpg',
            englishName: 'Merlin',
            koreanName: '멀린',
            linkUrl: '/en/projects/merlin',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/projects/mizi/mizi_thumbnail_1.jpg',
            englishName: 'MIZI',
            koreanName: '미지',
            linkUrl: '/en/projects/mizi',
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
