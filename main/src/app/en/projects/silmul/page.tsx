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
      { name: '장민욱', englishName: 'Minwook Jang' },
      { name: '정수헌', englishName: 'Soohun Jung' },
    ],
  },
  {
    title: 'VD tutor',
    tutors: [{ name: '우민성', englishName: 'Minsung Woo' }],
  },
]

const thankstoData = [
  {
    title: 'Photographer',
    tutors: [
      { name: '박도현', englishName: 'Dohyun Park' },
      { name: '이재윤', englishName: 'Jaiyun Lee' },
    ],
  },
  {
    title: 'Technical Advisory',
    tutors: [{ name: '이호원', englishName: 'Howon Lee' }],
  },

  {
    title: 'Adviser',
    tutors: [{ name: '김현준', englishName: 'Hyeonjun Kim' }],
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

  const inView = useInView(designedByRef, { amount: 0.1, once: false })

  useEffect(() => {
    // Fix: show sidebar unless the credit section is in view
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
    return () => {
      window.removeEventListener('resize', checkDeviceType)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile || isTablet) return
      const rightThirdThreshold = window.innerWidth * (2 / 3)
      setIsMouseInRightThird(event.clientX >= rightThirdThreshold)
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
        svgSrc='/images/logo/Silmul_logo.svg'
        title={['Silmul', 
          <>
          'Turning real senses
          {' '}
          <br className='block md:hidden'/>
          into real objects'
          </>
          ]}
        description={
          <>
            Enjoy a new way to create. Turn your senses and experiences into physical products. If you could touch your
            senses and experiences, creating would not be difficult anymore.
            <br />
            Turning real senses into real objects, SILMUL.
          </>
        }
        credits='Sunil Kim, Suryun Hyeon, Seyeon Park, Hyunbin Seo, Hyeongyeong Yun'
        className='w-[74px] md:w-[96px] lg:w-[clamp(96px,8.75vw,130px)]'
      />
      <MainImage Image='/images/projects/silmul/silmul_main.jpg' />

      <Divide title='Background' number='01' className='text-[#E30D2D]' />
      <RightTitleBody
        title='Psychological pressure blocks creativity'
        text={
          <>
            Everyone has the desire to create.
            <br />
            <br />
            But many believe that creativity is reserved for the talented, making it hard to take the first step.
            <br />
            <br />
            Because we see creating as something extraordinary—an act of making something out of nothing.
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_1.webp' />

      <Divide title='Discover' number='02' className='text-[#E30D2D]' />
      <MidBody
        align='left'
        content={
          <>
            Is creating really about making something out of nothing? No. Creation evolves what already exists—the sum
            of our senses and experiences—into new forms.
            <br />
            <br />
            Most creations don’t begin on a blank page. As seen in today’s AI workflows, creativity clearly flows from
            existing contexts and memories.
            <br />
            <br /> And as tools evolve, the barriers to creating continue to fade.
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_2.webp' />

      <Divide title='Limitation' number='03' className='text-[#E30D2D]' />
      <MidBody align='center' content={<>Still, something is missing in the digital era of creativity.</>} />
      <Image Image='/images/projects/silmul/silmul_3.webp' />

      <LeftTitle
        text={
          <a href='https://bio.link/silmul' className='underline text-[#E30D2D] font-semibold' target='_blank'>
            ▶︎ A more detailed story of Silmul
          </a>
        }
      />

      <Divide title='Concept' number='04' className='text-[#E30D2D]' />
      <LeftTitle
        text={
          <>
            Turning real senses into real objects, Silmul
            <br/>
            Bring your senses to life.
          </>
        }
        padding={false}
        className='text-[#E30D2D]'
      />
      <MidBody
        align='left'
        content={
          <>
            Silgam ¹ : All the senses, memories, and preferences that make up your personal experience.
            <br />
            Silmul ² : Shaping scattered experiences into tangible forms you can see and touch.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110683335?h=f11057a475'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />

      <RightTitleBody
        title='A creative journey from sensation to reality'
        text={
          <>
            Silmul is a new tool that brings the sensory experience of creation to life.
            <br />
            <br />
            Bring your creations into the real world—touch, interact with, and experience them directly.
            <br />
            <br />
            To make this possible, Silmul combines Generative AI with 3D printing technology.
          </>
        }
      />

      <Divide title='Technical problem' number='05' className='text-[#E30D2D]' />
      <MidBody
        align='center'
        content={
          <>
            3D printers are evolving toward home use,
            <br className='hidden md:block'/>
            but their forms and usage still aren’t friendly as everyday creative tools.
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_5.webp' />

      <Divide title='New Creation Paradigm' number='06' className='text-[#E30D2D]' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110683367?h=168d4cbe88'
        preloadDelayMs={0}
        hasAudio={true}
        prewarm
        loop
        muted={false}
      />
      <Image Image='/images/projects/silmul/silmul_7.jpg' />

      <RightTitleBody
        title='Product, “Sense” ¹'
        text={
          <>
            Check dimensions with gestures in real space and seamlessly link elements—color, shape, and more—into
            digital data.
          </>
        }
      />
      <RightTitleBody title='Product, “Realize” ²' text={<>Print the tangible object you can hold and feel.</>} />

      <Divide title='User Scenario' number='07' className='text-[#E30D2D]' />
      <MidTitle align='center' className='text-[#E30D2D]' text='Sense: The easiest way to start creating' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110683387?h=8e744e1286'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <MidBody
        align='center'
        content={
          <>
            Every sensation in daily life becomes the seed of creativity.
            <br className='hidden md:block'/>
            With Sense, you can start creating naturally—without worrying about “what” or “how.”
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_9.webp' />
      <RightTitleBody
        title={null}
        text={
          <>
            With Sense, even tricky dimensions are easy with a single gesture. Colors and shapes you encounter every day
            can be captured and used instantly—no extra devices needed.
          </>
        }
      />

      <MidTitle align='center' className='text-[#E30D2D]' text='Service: Generate experiences through Gen-AI' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110683395?h=844ef70dd2'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <RightTitleBody
        title={null}
        text={
          <>
            Feelings and experiences are invisible. Sense turns them into data and syncs with the Silmul App. Combine
            the fragments of your senses and generate the image of the object you want with Gen-AI—creating a one-of-a-kind
            result, born from your own experiences.
          </>
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110683901?h=7e32a7979c'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <MidBody align='center' content={<>Got it? Now, let’s make it real.</>} />
      <Image Image='/images/projects/silmul/silmul_12.webp' />

      <MidTitle align='center' className='text-[#E30D2D]'
      text={[
        <>
        Realize: From experience
        <br className='block md:hidden'/>
        to real object
        </>
      ]}
       />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110683419?h=ca560c55e3'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110683432?h=9ee46753e1'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <MidBody
        align='center'
        content={
          <>
            All you need to print is filament and ink.
            <br className='hidden md:block'/>
            Watch your imagination take physical form—and enjoy the joy of making.
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_15.webp' />

      <Divide title='Extra Value' number='08' className='text-[#E30D2D]' />
      <MidTitle
        align='center'
        className='text-[#E30D2D]'
        text={[
          <>
          Tagging: Not the end of making 
          <br className='block md:hidden'/>
          - the beginning of expanding
          </>
        ]}
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110683441?h=cb28511544'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <RightTitleBody
        title={null}
        text={
          <>
            A tag is embedded into each print. Scan it to relive memories and process from creation. You can keep adding
            new experiences as you use the object—the creative journey keeps expanding.
          </>
        }
      />

      <MidTitle align='center' className='text-[#E30D2D]' text='Melting: Sustainable cycle of Silmul' />
      <Image Image='/images/projects/silmul/silmul_17.webp' />
      <MidBody
        align='center'
        content={
          <>
            Done with an object—or tastes have changed?
            <br />
            Use the Melting System to recycle it into eco-friendly filament.
            <br />
            That’s sustainable creativity.
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_18.webp' />
      <Image Image='/images/projects/silmul/silmul_19.jpg' />
      <Image Image='/images/projects/silmul/silmul_20.jpg' />

      <MidTitle align='center' className='text-[#E30D2D]' text='Turning real senses into real objects, Silmul' />

      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '김선일',
              role: 'PL · ID',
              englishName: 'Sunil Kim',
              profileImage: '/images/profile/sunilkim.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/sun_1',
                instagram: 'https://instagram.com/sun__1d_ay',
              },
            },
            {
              name: '현수련',
              role: 'VD',
              englishName: 'Suryun Hyeon',
              profileImage: '/images/profile/suryunhyeon.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/hyeonsuryun/',
                behance: 'https://www.behance.net/SuryunHyeon',
                instagram: 'https://instagram.com/hyeonsuryun',
              },
            },
            {
              name: '박세연',
              role: 'ID',
              englishName: 'Seyeon Park',
              profileImage: '/images/profile/seyeonpark.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/pseyeonn',
                instagram: 'https://instagram.com/1.30ps',
              },
            },
            {
              name: '서현빈',
              role: 'ID',
              englishName: 'HyunBin Seo',
              profileImage: '/images/profile/hyunbinseo.png',
              socialLinks: {
                linkedin:
                  'https://www.linkedin.com/in/%EC%84%9C%ED%98%84%EB%B9%88-seo-a493b8331/',
                behance: 'https://www.behance.net/kyoma',
                instagram: 'https://instagram.com/_kyoma___',
              },
            },
            {
              name: '윤현경',
              role: 'UX',
              englishName: 'Hyeongyeong Yun',
              profileImage: '/images/profile/hyeongyeongyun.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/yink38',
                instagram: 'https://instagram.com/stigma___',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />

        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/en/projects/cruise' }}
          nextItem={{ label: 'Next', url: '/en/projects/potrik' }}
        />

        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/projects/cruise/cruise1_thumbnail_1.jpg',
            englishName: 'CRUISE',
            koreanName: '크루즈',
            linkUrl: '/en/projects/cruise',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/projects/potrik/potrik_thumbnail_1.jpg',
            englishName: 'POTRIK',
            koreanName: '포트릭',
            linkUrl: '/en/projects/potrik',
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
