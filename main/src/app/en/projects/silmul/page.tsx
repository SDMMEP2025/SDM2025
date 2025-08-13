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

  const inView = useInView(designedByRef, {
    amount: 0.1,
    once: false,
  })

  useEffect(() => {
    if (inView) {
      setIsSidebarShown(false)
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
      <Header />
      <Summary
        svgSrc='/images/logo/Silmul_logo.svg'
        title={['Silmul', 'Turning real senses into real objects']}
        description={
          <>
            Enjoy a new way to create. Turn your senses and experiences into physical products. If you could touch your
            senses and experiences, creating would not be difficult anymore.<br></br>Turning real senses into real
            objects, SILMUL
          </>
        }
        credits='Sunil Kim, Suryun Hyeon, Seyeon Park, Hyunbin Seo, Hyeongyeong Yun'
        className='w-[80px] md:w-[96px] lg:w-[clamp(60px,8.75vw,130px)]'
      />
      <MainImage />
      <Divide title='Background' number='01' />
      <RightTitleBody
        title='Psychological pressure blocks creativity'
        text={
          <>
            Everyone has the desire to create. <br />
            <br />
            But many believe that creativity is reserved for the talented, making it hard to take the first step. <br />
            <br />
            Because we see creating as something extraordinary—an act of making something out of nothing.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide title='Discover' number='02' />
      <MidBody
        align='left'
        content={
          <>
            Is creating really about making something out of nothing? No, creation is about evolving something into
            something else—like a reflection of your hidden experiences.
            <br />
            <br />
            Most creations do not begin on a blank page. Look at how AI generates images today—it's clear: creativity
            flows from what already exists. <br />
            <br /> And as these tools evolve, the barriers to creating are fading.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide title='Limitation' number='03' />
      <MidBody
        align='center'
        content={<>However, there's still something missing when it comes to creativity in the digital era.</>}
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <LeftTitle
        text={
          <a href='https://bio.link/silmul' className='underline' target='_blank'>
            ▶︎ A more detailed story of Silmul
          </a>
        }
      />
      <Divide title='Concept' number='04' />
      <LeftTitle
        text={
          <>
            Turning real senses into real objects , Silmul <br />
            Bring your senses to life.
          </>
        }
        padding={false}
      />
      <MidBody
        align='left'
        content={
          <>
            Silgam ¹ : All the senses, memories, and preferences that make up your personal experience.
            <br />
            Silmul ² : The act of shaping scattered experiences into tangible forms you can see and touch.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title='A creative journey from sensation to reality'
        text={
          <>
            Silmul is a new tool that brings the sensory experience of creation to life.
            <br />
            <br />
            Bring your creations into the real world — touch, interact with, and experience them more directly than ever
            before.
            <br />
            <br />
            To make this possible, Silmul combines generative Artificial Intelligence with 3D printing technology.
          </>
        }
      />
      <Divide title='Technical problem' number='05' />
      <MidBody
        align='center'
        content={
          <>
            3D printers are becoming more common at home,
            <br />
            but their design and how they work still aren’t suitable for everyday use.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide title='New Creation Paradigm' number='06' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title='Product, ‘Sense’ ¹'
        text={
          <>
            Use simple gestures to check the size and sync color, shape, and other details seamlessly into digital data.
          </>
        }
      />
      <RightTitleBody
        title='Product, ‘Realize’ ²'
        text={<>Bring your creation to life—print a object that you can touch and feel.</>}
      />
      <Divide title='User Scenario' number='07' />
      <MidTitle align='center' text='Sense: The easiest way to start creating' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidBody
        align='center'
        content={
          <>
            Every sensation sparks creativity in daily life.
            <br />
            With Sense, you can start creating without worrying about how to make it.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title={null}
        text={
          <>
            Measure sizes easily with a simple gesture. It used to be hard to measure. Plus, you can instantly bring
            vibrant colors and shapes to life. No extra tools required.
          </>
        }
      />
      <MidTitle align='center' text='Service: Generate experiences through Gen-AI' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title={null}
        text={
          <>
            Feelings and experiences are invisible. But with Sense, you can turn them into data and connect seamlessly
            to the Silmul App. Gather the fragments of your senses and experiences, and use generative AI to create
            images of the physical objects you want to make. This way, you craft a truly unique creation, shaped
            entirely by your own experience.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidBody align='center' content={<>Now, bring your design to life by turning it into a real object.</>} />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />

      <MidTitle align='center' text='Realize: From experience to real object' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidBody
        align='center'
        content={
          <>
            To print real objects, all you need is filament and ink.
            <br />
            Enjoy the process of turning your ideas into physical form and bringing your imagination to life.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide title='Extra Value' number='08' />
      <MidTitle align='center' text='Tagging: Not the end of making - the beginning of expanding' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title={null}
        text={
          <>
            Each printed piece is marked with a tag you can scan to see memories and experiences from your creative
            work. New experiences are added in real time as you use the tagging system. It means your creative
            experience can keep expanding.
          </>
        }
      />
      <MidTitle align='center' text='Melting: Sustainable cycle of Silmul' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidBody
        align='center'
        content={
          <>
            Do you feel tired of your objects?
            <br />
            Try the Melting System: melt them down and recycle into eco-friendly filament.
            <br/>
            That’s sustainable creativity.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidTitle align='center' text='Turning real senses into real objects, Silmul' />

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
                linkedin: 'https://www.linkedin.com/in/%EC%84%9C%ED%98%84%EB%B9%88-seo-a493b8331/',
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
            imageUrl: '/images/previous_image.png',
            englishName: 'Cruise',
            koreanName: '크루즈',
            linkUrl: '/en/projects/cruise',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'Potrik',
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
