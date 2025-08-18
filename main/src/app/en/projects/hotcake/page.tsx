'use client'
import {
  Header,
  Footer,
  Summary,
  MainImage,
  Divide,
  TitleBody,
  MidTitle,
  MediaContainer,
  ImageGallery,
  Credit,
  CreditTutor,
  CreditThanksTo,
  ProjectNavigation,
  MobileNavigation,
  ArchiveSidebar,
  Image,
  Blank,
} from '@/components/projects'
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
  { title: 'ID tutor', tutors: [{ name: '주호영', englishName: 'Hoyoung Joo' }] },
  { title: 'UX tutor', tutors: [{ name: '오승빈', englishName: 'Seungbin Oh' }] },
  { title: 'VD tutor', tutors: [{ name: '워크스', englishName: 'WORKS' }] },
]

const thankstoData = [
  { title: 'Photographer', tutors: [{ name: '최주혁', englishName: 'Juhyuk Choi' }] },
  { title: 'Videographer', tutors: [{ name: '최주혁', englishName: 'Juhyuk Choi' }] },
  { title: 'D.O.P.', tutors: [{ name: '박기정', englishName: 'Gijeong Park' }] },
  { title: 'Gaffer', tutors: [{ name: '양의열', englishName: 'Uiyeol Yang' }] },
  { title: 'Music Producer', tutors: [{ name: '코토바', englishName: 'cotoba' }] },
  { title: 'Model', tutors: [{ name: '됸쥬', englishName: 'DyoN Joo' }] },
]

const points = [
  {
    id: '1',
    top: '50%',
    left: '50%',
    images: [
      '/images/projects/hotcake/archive/1.jpg',
      '/images/projects/hotcake/archive/2.jpg',
      '/images/projects/hotcake/archive/3.jpg',
      '/images/projects/hotcake/archive/4.jpg',
      '/images/projects/hotcake/archive/5.jpg',
      '/images/projects/hotcake/archive/6.jpg',
      '/images/projects/hotcake/archive/7.jpg',
      '/images/projects/hotcake/archive/8.jpg',
      '/images/projects/hotcake/archive/9.jpg',
      '/images/projects/hotcake/archive/10.jpg',
    ],
  },
]

export default function Page() {
  const [isMouseInRightThird, setIsMouseInRightThird] = useState(false)
  const [isSidebarShown, setIsSidebarShown] = useState(true)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [currentPoint] = useState(points[0])

  const designedByRef = useRef<HTMLDivElement>(null)
  const inView = useInView(designedByRef, { amount: 0.1, once: false })

  useEffect(() => {
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

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile || isTablet) return
      const rightThirdThreshold = window.innerWidth * (2 / 3)
      setIsMouseInRightThird(event.clientX >= rightThirdThreshold)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, isTablet])

  const shouldShowSidebar = isMobile || isTablet || isMouseInRightThird || isSidebarExpanded
  const handleSidebarExpandedChange = (expanded: boolean) => setIsSidebarExpanded(expanded)

  return (
    <>
      <Blank />
      <Header />
      <Summary
        svgSrc='/images/logo/hotcake_logo.svg'
        title={['Hotcake', 'Heat it, Play it, Hotcake']}
        description='Hotcake lets you enjoy playing music with your friends, no matter where you are. It delivers rich, 3D sound that makes it feel like you are all in the same room. Hotcake keeps everyone perfectly in sync, so you can feel magical moments. Experience immersive, unforgettable jam sessions even in your home.'
        credits='Woojin Jang, Hyeryoung Jeong, Chaeeun Kim, Ilyeo Lee, Eunhye Jang'
        className='w-[85px] md:w-[85px] lg:w-[clamp(100px,10vw,144px)]'
      />

      {/* 1 */}
      <MainImage Image='/images/projects/hotcake/hotcake_main.jpg' />

      <Divide title='A way of enjoying music' number='01' />
      <TitleBody
        title={[
          <>
            Eventually, <br className='hidden md:block' />
            You Want to Play
          </>,
        ]}
        text='Music is a part of everyday life. Some people want to truly engage and participate. Which means some people grab an instrument and begin their journey as a “bedroom musician’’.'
      />

      {/* 2,3,4 */}
      <Image Image='/images/projects/hotcake/hotcake_1.jpg' />
      <Divide title='The joy of being together' number='02' />
      <TitleBody
        title={[
          <>
            Playing Alone,
            <br className='hidden md:block' /> Grooving Together
          </>,
        ]}
        text='Music is never complete when played alone. As different instruments come together, the sound gets richer and joyful. At first, you might play alone in your room. But before long, you will want to play with others. You just can’t fully enjoy the thrill of trading rhythms and locking into a groove when you’re playing solo.'
      />
      <Image Image='/images/projects/hotcake/hotcake_2.jpg' />

      {/* 5 */}
      <TitleBody
        title={[
          <>
            Playing Together,
            <br className='hidden md:block' /> Should Be Fun
          </>,
        ]}
        text={
          <>
            Jam sessions used to require going to a rehearsal studio. You had to carry heavy instruments and pay a fee.
            There was pressure to perform perfectly. However, what if you could play together from home? Hotcake offers
            a more enjoyable way to connect. Play in your home. It’s fine if the beat or notes slip a bit. Let the music
            take over your soul.
            <br />
            <br />
            <a href='https://bio.link/silmul' className='underline font-semibold' target='_blank'>
              ▶︎ A more detailed story of Silmul
            </a>
          </>
        }
      />
      <Image Image='/images/projects/hotcake/hotcake_3.jpg' />

      <MidTitle align='center' text='Heat It, Play It, Hotcake' />

      {/* 6 (Vimeo) */}
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110677386?h=40b3b7092a'
        hasAudio
        muted={false}
        preloadDelayMs={0}
        prewarm
        loop
      />

      {/* 7,8 */}
      <TitleBody
        title={[
          <>
            Online Jam,
            <br className='hidden md:block' /> Perfected
            <br className='hidden md:block' /> Cake & Butter
          </>,
        ]}
        text='Hotcake includes Cake, a modular speaker and woofer system, and Butter, a wearable device that lets you feel the music. Hotcake turns the sounds from your jam session into immersive 3D audio, making it feel like you’re all playing in the same room. Butter also sends vibrations, so you can feel the beat as you play.'
      />
      <Image Image='/images/projects/hotcake/hotcake_5.jpg' />

      {/* 9,10,11 */}
      <TitleBody
        title={[
          <>
            Half a World Away,
            <br className='hidden md:block' /> Still in Sync
          </>,
        ]}
        text='Perfect timing is very important for online jam sessions. Cake makes sure there is no delay or freezing, so everything feels smooth. Cake stays connected through a wired Ethernet, delivering real-time audio no matter the distance. Each module picks up the live sound from the station via a 2.4GHz RF channel, making sure your online jam feels smooth and perfectly in sync.'
      />
      <ImageGallery
        images={['/images/projects/hotcake/hotcake_6.jpg', '/images/projects/hotcake/hotcake_7.jpg']}
        alt='HOTCAKE Image Gallery'
      />

      {/* 12,13 */}
      <TitleBody
        title={[
          <>
            Adding Texture
            <br className='hidden md:block' /> to Music
          </>,
        ]}
        text="What makes live music special is the way you can feel it in your body. Butter brings this feeling. It syncs haptics to the music you're playing, adding a rich layer to the sound. Also, you can switch to metronome mode to stay on beat or use the built-in mic to chat with others."
      />
      <Image Image='/images/projects/hotcake/hotcake_8.jpg' />

      <Divide title='Scenario' number='04' />
      <MidTitle align='center' text='(1) Connection with Sessions' padding={false} />
      <TitleBody
        title={[
          <>
            Your Instant Band,
            <br className='hidden md:block' /> Anytime, Anywhere
          </>,
        ]}
        text='If there is no one around to jam with, just open Hotcake’s community. You can find new bandmates who share your taste in music, or start a session with a friend from your list. Missing a player? An AI musician will jump in and play along with your rhythm, so you can always enjoy a full and immersive session.'
      />

      {/* 14 */}
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110677417?h=849f8b5e1f'
        preloadDelayMs={0}
        prewarm
        loop
      />

      <MidTitle align='center' text='(2) New Experience with Hotcake' />
      <TitleBody
        title={[
          <>
            A Live Experience
            <br className='hidden md:block' /> with Light, Vibration, Sound
          </>,
        ]}
        text='Set up modular speakers and experience more than just sound. Cake lights up in real time, so you can visually feel your friends’ performances as they play. Pair them with Butter, the wearable device, and feel the rhythm and groove through haptics.'
      />

      {/* 15,16,17 */}
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110677428?h=24666f17bc'
        preloadDelayMs={0}
        prewarm
        loop
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110677453?h=9dfe315642'
        preloadDelayMs={0}
        prewarm
        loop
      />

      <TitleBody
        title={'At Home, But Louder, More Fun'}
        text='The best part of playing together is when everyone’s timing clicks. At this perfect moment, LED lights turn your room into a stage. When the music hits its peak, gesture motion triggers sound effects. Explore your jam session to the fullest.'
      />

      {/* 18,19 */}
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110677453?h=9dfe315642'
        preloadDelayMs={0}
        prewarm
        loop
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110677477?h=6e7bb30ead'
        preloadDelayMs={0}
        prewarm
        loop
      />

      <MidTitle align='center' text='(3) Frame the Heated Moment' padding={false} />
      <TitleBody
        title={[
          <>
            Return To The <br className='hidden md:block' />
            Heat Of The Jam
          </>,
        ]}
        text='After the jam, AI automatically edits your solo parts and highlights them into a complete video. Share it with your bandmates to keep the feeling going. Replay your performance and relive the spark of the session anytime.'
      />

      {/* 20 */}
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110677496?h=9764a64822'
        preloadDelayMs={0}
        prewarm
        loop
      />

      <Divide title='New Expandability' number='05' />
      <TitleBody
        title={[
          <>
            Playing Together, <br className='hidden md:block' />
            For Everyone
          </>
        ]}
        text='Hotcake becomes a platform where everyone can enjoy jamming, without changing how you normally play. For those who are deaf or hard of hearing, Butter’s music haptics help you feel the rhythm and join the session. Studio Mode headphones provide immersive playing anywhere. Your personal expression becomes part of a new music ecosystem.'
      />

      {/* 21 */}
      <ImageGallery
        images={['/images/projects/hotcake/hotcake_16.jpg', '/images/projects/hotcake/hotcake_17.jpg']}
        alt='HOTCAKE Image Gallery'
      />

      <MidTitle align='center' text='Heat it, Play It, Groove It, Melt It, Drop It, Fade It, Link It, Hotcake' />

      {/* 22 */}
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110680480?h=9740795744'
        preloadDelayMs={0}
        prewarm
        loop
      />

      {/* 23,24 */}
      <Image Image='/images/projects/hotcake/hotcake_19.jpg' />
      <Image Image='/images/projects/hotcake/hotcake_20.webp' />

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
            imageUrl: '/images/projects/layon/layon_thumbnail_1.jpg',
            englishName: 'LAY.ON',
            koreanName: '레이온',
            linkUrl: '/en/projects/layon',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/projects/merlin/merlin_thumbnail_1.jpg',
            englishName: 'Merlin',
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
