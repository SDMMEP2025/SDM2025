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
        title={['Hotcake', 'Heat it, Play it, Hotcake']}
        description='Hotcake lets you enjoy playing music with your friends, no matter where you are. It delivers rich, 3D sound that makes it feel like you are all in the same room. Hotcake keeps everyone perfectly in sync, so you can feel magical moments. Experience immersive, unforgettable jam sessions even in your home.'
        credits='Woojin Jang, Hyeryoung Jeong, Chaeeun Kim, Ilyeo Lee, Eunhye Jang'
        className='w-[85px] md:w-[100px] lg:w-[clamp(100px,10vw,144px)]'
      />
      <MainImage Image='/images/projects/cruise/image1.png' />
      <Divide title='A way of enjoying music' number='01' />
      <TitleBody
        title={'Eventually,\nYou Want to Play'}
        text='Music is a part of everyday life. Some people want to truly engage and participate. Which means some people grab an instrument and begin their journey as a “bedroom musician’’.'
      />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106711843?h=ba42ab53da' />
      <Divide title='The joy of being together' number='02' />
      <TitleBody
        title={'Playing Alone,\nGrooving Together'}
        text='Music is never complete when played alone. As different instruments come together, the sound gets richer and joyful. At first, you might play alone in your room. But before long, you will want to play with others. You just can’t fully enjoy the thrill of trading rhythms and locking into a groove when you’re playing solo.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'Playing Together\nShould Be Fun'}
        text={
          <>
            Jam sessions used to require going to a rehearsal studio. You had to carry heavy instruments and pay a fee.
            There was pressure to perform perfectly. However, what if you could play together from home? Hotcake offers
            a more enjoyable way to connect. Play in your home. It’s fine if the beat or notes slip a bit. Let the music
            take over your soul.
            <br /> <br />
            <a href='https://bio.link/silmul' className='underline font-semibold' target='_blank'>
              ▶︎ A more detailed story of Silmul
            </a>
          </>
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidTitle align='center' text='Heat It, Play It, Hotcake' />
      <Image Image='/images/projects/cruise/cruise_5.jpg' />
      <TitleBody
        title={'Online Jam,\nPerfected\nCake & Butter'}
        text={
          'Hotcake includes Cake, a modular speaker and woofer system, and Butter, a wearable device that lets you feel the music. Hotcake turns the sounds from your jam session into immersive 3D audio, making it feel like you’re all playing in the same room. Butter also sends vibrations, so you can feel the beat as you play.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <TitleBody
        title={'Half a World Away,\nStill in Sync'}
        text={
          'Perfect timing is very important for online jam sessions. Cake makes sure there is no delay or freezing, so everything feels smooth. Cake stays connected through a wired Ethernet, delivering real-time audio no matter the distance. Each module picks up the live sound from the station via a 2.4GHz RF channel, making sure your online jam feels smooth and perfectly in sync.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <TitleBody
        title={'Adding Texture to Music'}
        text={
          "What makes live music special is the way you can feel it in your body.Butter brings this feeling. It syncs haptics to the music you're playing, adding a rich layer to the sound. Also, you can switch to metronome mode to stay on beat or use the built-in mic to chat with others."
        }
      />
      <Divide title='Scenario' number='04' />
      <MidTitle align='center' text='(1) Connection with Sessions' padding={false} />
      <TitleBody
        title={'Your Instant Band,\nAnytime, Anywhere'}
        text={
          'If there is no one around to jam with, just open Hotcake’s community. You can find new bandmates who share your taste in music, or start a session with a friend from your list. Missing a player? An AI musician will jump in and play along with your rhythm, so you can always enjoy a full and immersive session.'
        }
      />

      <Image Image='/images/projects/cruise/cruise_6.jpg' />

      <MidTitle align='center' text='(2) New Experience with Hotcake' />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106712720?h=5da78fb84e' />

      <TitleBody
        title={'A Live Experience with Light, Vibration, Sound'}
        text={
          'Set up modular speakers and experience more than just sound. Cake lights up in real time, so you can visually feel your friends’ performances as they play. Pair them with Butter, which is the wearable device. Feel the rhythm and groove through haptic.'
        }
      />

      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />

      <TitleBody
        title={'At Home, But Louder, More Fun'}
        text={
          'The best part of playing together is when everyone’s timing clicks. At this perfect moment, LED lights turn your room into a stage. When the music hits its peak, gesture motion triggers sound effects. So you can explore your jam session.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <MidTitle align='center' text='(3) Frame the Heated Moment' padding={false} />
      <TitleBody
        title={'Return To The\nHeat Of The Jam'}
        text={
          'After the jam, AI automatically edits your solo parts and highlights them into a complete video. So, you can share it with your bandmates to keep the feeling going. Replay your performance and relive the spark of the session anytime.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />

      <Divide title='New Expandability' number='05' />
      <TitleBody
        title={'Playing Together,\nFor Everyone'}
        text={
          'Hotcake becomes a platform where everyone can enjoy jamming, without changing how you normally play. For those who are deaf or hard of hearing to feel the rhythm, Butter features music haptics make you feel the rhythm through vibrations and join the session. Enjoy an immersive playing experience anytime, anywhere with Studio Mode headphones. It is a new music life, where your personal expression becomes part of the content.'
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
          previousItem={{ label: 'Previous', url: '/en/projects/layon' }}
          nextItem={{ label: 'Next', url: '/en/projects/merlin' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'LAY.ON',
            koreanName: '레이온',
            linkUrl: '/en/projects/layon',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'MERLIN',
            koreanName: '멀린',
            linkUrl: '/en/projects/merlin',
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
