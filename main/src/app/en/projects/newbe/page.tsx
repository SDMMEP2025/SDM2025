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
      <Header />
      <Summary
        svgSrc='/images/logo/NewBe_logo.svg'
        title={['NewBe', 'The New Hair Station, Made to Fit You']}
        description={
          <>
            NewBe is a hair styling station. Take a seat when you want to freshen up your look. Explore different hair
            styles, adjust what works best for you, and discover a fresh version of you.
          </>
        }
        credits='Chaewon Lee, Yehyeon Yoon, Dongheon Kang, Siwoo Kim, Chaeyoung Jung'
        className='w-[142px] md:w-[196px] lg:w-[clamp(196px,21.3vw,308px)]'
      />
      <MainImage />
      <Divide title='Background' number='01' className='text-[#7C8A8D]'/>
      <TitleBody
        title={
          <>
            The Moment You
            <br />
            Need Style, Now
          </>
        }
        text={
          <>
            Hair styling is not just for special occasions anymore for Gen Z—it is a form of self-expression shaped by
            their moods and everyday situations. They take screenshots of hair inspiration while browsing salon reviews,
            watch trendy tutorials from viral stylists, and create mood boards filled with their dream looks. It shows
            how much they have a strong interest in hair styling.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide title='Target' number='02' className='text-[#7C8A8D]'/>
      <TitleBody
        title={
          <>
            I Want to Be New,
            <br />
            Styling’s Always ON
          </>
        }
        text={
          <>
            Gen Z is all about reinventing their style to fit every moment—whether it is their favorite band’s concert,
            a summer picnic with friends, or a date night. Styling isn’t a one-time act. It’s a journey—like a glow-up
            goal or an everyday beauty moment. Always evolving, refining, and becoming. So, Gen Z enjoys trying out new
            styles and making changes, finding new meaning in every step of the process.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody
        text={
          <>
            Finding the perfect hairstyle is important for Gen Z. So, what does “hair styling” mean to those who tend to
            their hair in front of the mirror every day?
          </>
        }
      />
      <Divide title='Problem' number='03' className='text-[#7C8A8D]'/>
      <TitleBody
        title={
          <>
            Styling, <br />
            Stuck in Skill
          </>
        }
        text={
          <>
            Hair is a deeply personal part of us—unlike clothes or shoes, it isn’t something we can simply change. That
            is why styling is so much harder. Until now, people have mainly depended on styling tools or a hairdresser.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody
        text={
          <>
            However, when hair styling depends on mastering tools, it quickly becomes a burden. For Gen Z, everyday
            styling still feels tough and challenging.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidBody
        align='center'
        content={
          <>
            It’s no longer just about mastering the tool.
            <br />
            NewBe removes the barriers,
            <br />
            so styling your hair feels as natural and simple as picking an outfit.
            <br />
            Try, mix, and discover what suits you best. When the process feels effortless, finding your style becomes
            part of the everyday joy.
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
      <MidTitle align='center' text=' With NewBe, just staying turns into effortless styling' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={
          <>
            New Station,
            <br />
            New Style
          </>
        }
        text={
          <>
            NewBe is a station experience where hair styling begins naturally.Complicated tools are no longer needed.
            Try new looks every day and discover your unique style.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidTitle align='center' text='#0 Meet My Hair Combo' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={
          <>
            New-Know Catching
            <br />: Knows Me Best
          </>
        }
        text={
          <>
            During the day and night time, like drying and brushing your hair, NewBe and ComBe quietly collect your hair
            data—scalp shape, hair type, texture—getting to know your hair better.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide title='Scenario' number='05' className='text-[#7C8A8D]'/>
      <MidTitle align='center' padding={false} text='#1 How to Use NewBe' />
      <TitleBody
        title={
          <>
            Signature Style,
            <br />
            Crafted by Me
          </>
        }
        text={
          <>
            Ready to start styling? No need to explain every detail of the look you want, just type your hair
            inspiration or occasion. NewBe will analyze your hair data and suggest the best style for you.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody
        text={
          <>
            Pick your favorite hairstyle, then customize the details. New-Ing experience becomes even more fun and
            exciting.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={
          <>
            Where I Stay,
            <br />
            Style Happens
          </>
        }
        text={
          <>
            NewBe is ready whenever you are. Rushing in the morning? Or clearing your desk before a video call? Just be
            there. NewBe adapts to your rhythm and makes every moment a fresh styling experience.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidBody
        align='center'
        content={
          <>
            NewBe reimagines what hair styling looks like. It’s no longer about standing uncertain in front of the
            mirror, flat iron in hand. With touch-free technology, your hands stay free, while your hair becomes more
            perfect.
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
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidBody
        align='center'
        content={
          <>
            Instead of using high heat and physical pressure,
            <br />
            NewBe uses heat control tailored to your hair’s condition—
            <br />
            allowing you to create curls, waves, or straight styles more naturally, with less damage.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidTitle align='center' padding={false} text='#2 New-Ing, Keep it fun.' />
      <TitleBody
        title={
          <>
            NewBe, Always Fits
            <br />
            Always Me
          </>
        }
        text={
          <>
            A sudden rain might mess up your hair, but that’s okay. NewBe knows what your hair needs—and offers the
            right touch-up at just the right time. Because keeping your style, your way—that’s the New-ttitude.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={
          <>
            Keep the Styles
            <br />
            You Love
          </>
        }
        text={
          <>
            Hairstyle you liked, but couldn’t get it right again?
            <br />
            Archive hair styling you have tried, so you can go back to it anytime.
            <br />
            Save your favorite styles as presets.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidTitle align='center' padding={false} text='#3 Evolving Our Hair Styling Scene' />
      <TitleBody
        title={
          <>
            That Hair,
            <br />
            Now New Me
          </>
        }
        text={
          <>
            You can explore styles from top stylists — or from people with the same hair texture and type as yours.
            Choose a “Date Look” from a top stylist, or save a stylish look with a hair accessory created by someone
            with your exact hair type and texture. NewBe brings all these styles to your home.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide title='Expectation' number='06' className='text-[#7C8A8D]'/>
      <MidTitle
        align='center'
        text={
          <>
            NewBe
            <br />
            Styling for Tomorrow
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidBody
        align='center'
        content={
          <>
            People often call beginners “Newbies.”
            <br />
            But styling your hair is no longer just about mastering the tools.
            <br />
            With NewBe, you style only when you want — so you can focus entirely on creating a look that suits your hair
            and expresses who you are
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidBody
        align='center'
        content={
          <>
            It is no longer just about making your hair look a certain way.<br/>Embrace natural hair and turn it into a
            unique style. This is a new way to express who you really are through hairstyling.
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />

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
          previousItem={{ label: 'Previous', url: '/en/projects/potrik' }}
          nextItem={{ label: 'Next', url: '/en/projects/layon' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'Potrik',
            koreanName: '포트릭',
            linkUrl: '/en/projects/potrik',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'Lay.On',
            koreanName: '레이온',
            linkUrl: '/en/projects/layon',
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
