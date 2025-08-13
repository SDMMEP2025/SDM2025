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
      { name: '주호영', englishName: 'Hoyoung Joo' },
      { name: '양진우', englishName: 'Jeenwoo Yang' },
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
    tutors: [{ name: '정영훈', englishName: 'Younghoon Jeong' }],
  },
  {
    title: 'Adviser',
    tutors: [
      { name: '구형준', englishName: 'Hyungjun Koo' },
      { name: '박상희', englishName: 'Sanghee Park' },
      { name: '이재희', englishName: 'Jaehee Lee' },
      { name: '장순규', englishName: 'Soonkyu Jang' },
    ],
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
        svgSrc='/images/logo/CRUISE_logo.svg'
        title={['CRUISE', 'Style Our Mile, Drive Our Life']}
        description='In the age of level 5 autonomous vehicles, where every passenger is liberated from driving, CRUISE is an interactive device that reimagines travel as a dynamic, sharing experience. Inspired by familiar and intuitive gestures, CRUISE brings new significance and enthusiasm to everyday trips. Meet the new movement experience with CRUISE!'
        credits='Yeojun Yun, Hyunggoo Kang, Minji Kwon, Chaeyoung Baek, Minseo Jung'
        className='w-[200px] md:w-[200px] lg:w-[clamp(200px,21.3vw,308px)]'
      />
      <MainImage Image='/images/projects/cruise/image1.png' />
      <Divide title='Background' number='01' />
      <TitleBody
        title='A lifetime on the road'
        text='Morning commutes, busy day trips, weekend getaways, unexpected meetups—life takes place on the road. Likewise, movement is not just about getting from A to B; it is an inseparable part of everyday life, shaping our time & experiences.'
      />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106711843?h=ba42ab53da' />
      <Divide title='Target' number='02' />
      <TitleBody
        title={'The reimagined, new generation of movement'}
        text='In the time when autonomous driving becomes the norm, when even the steering wheel, our most trusted means of handling, is no longer needed, movement does not simply mean one getting to a destination. The traditional divide between driver and passenger fades, escaping the responsibility to operate the vehicle. Opening new possibilities for the ‘Navigators,’ shaping their own unique experiences and exploration.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title='Silent passengers to adventurous pioneers, CRUISER'
        text={
          <>
            Our definition of New Movement Generation, aka CRUISER, fundamentally differs from the past. They not only consume online content but also actively rearrange, explore deeper, and style it to fit their individuality. They naturally share what’s found and bring new value to the table.
            <br />
            <br />
            <a
              href=' https://www.notion.so/CRUISE-UX-BOOK-23d6cd1a9e8280a68d64f1b14879e6a1?source=copy_link'
              className='underline'
              target='_blank'
            >
              ▶ A detailed story of their background
            </a>
          </>
        }
      ></RightTitleBody>
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106712041?h=af8b7a7a8a' />
      <MidBody
        align='left'
        content='CRUISE expands these lifestyles into new movement experiences. To the Cruisers, movement becomes a platform to connect moments through personal preferences and to have fun engaging with friends. Roads become lively feeds, and vehicles transform into interactive devices—everyone becoming the creators and editors of your journey.'
      />
      <Divide title='Concept' number='03' />
      <Image Image='/images/projects/cruise/cruise_4.jpg' />
      <MidTitle align='center' text='Road as a feed—sharing every experience.' />
      <Image Image='/images/projects/cruise/cruise_5.jpg' />
      <MidBody
        content={'Style Our Mile, Drive Our Life! Let’s explore how CRUISE will change our movement!'}
      />
      <Image Image='/images/projects/cruise/cruise_6.jpg' />
      <Divide title='CRUISE Product' number='04' />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106712232?h=e815385a12' />

      <RightTitleBody
        title='CRUISE - Handle'
        text='CRUISE’s Handle is a new interaction device replacing the traditional steering wheel in the era of future autonomous vehicles. Handle references intuitive gesture controls that can be easily found in a mobile environment, making it possible for natural yet straightforward communication with the world around.'
      />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106712396?h=954343a016' />

      <RightTitleBody
        title='CRUISE - Dash'
        text='CRUISE Dash features A.I. cameras that recognize boarded passengers to further enhance the experience. The designated slot can easily accommodate the Handle when not in use. Dash is designed to provide core functions with minimized components—bringing the flexibility to be applied in various vehicles and situations.'
      />
      <Image Image='/images/projects/cruise/cruise_9.jpg' />

      <RightBody text='From cozy, manageable two-seaters to spacious vehicles that fit all your friends, CRUISE blends in effortlessly into any interior. Allowing for checking both external & Dash information in comfort, all while having Handle within arm’s reach.'/>
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106712557?h=5d7c488384' />

      <Divide title='Scenario' number='05' />
      <MidTitle align='center' padding={false} text='(1) Styling Our Journey, Together' />

      <TitleBody
        title={'What’s the Vibes for Today?'}
        text='Check the map together with friends to start the exploration. Artificial intelligence will recognize all passengers to set group algorithms. Then it suggests destinations and other sets of data to make the perfect journey possible—forming a Signature Map—expeditions showing our individuality.'
      />
      <Image Image='/images/projects/cruise/cruise_11.jpg' />

      <MidTitle align='center' padding={false} text='(2) Boundless Playground for Everyone' />
      <TitleBody
        title={'Map with numerous viewpoints'}
        text='Time being spent in moving vehicles turns into a delightful playground with CRUISE. When the Handle is passed around, AI recognizes who’s in charge & changes the algorithm accordingly. All individual perspectives come together on one Collective Map, making every trip a new adventure.'
      />

      <Image Image='/images/projects/cruise/cruise_12.jpg' />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106712720?h=5da78fb84e' />

      <MidTitle align='center' padding={false} text='(3) Boundless Playground for Everyone' />
      <TitleBody
        title={'Switching Vibes, Instantly.'}
        text='CRUISE instantly changes the current ambience with no interruptions. The pull and release gesture makes it possible to refresh your vibes and contents in the flick of your finger.'
      />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106712921?h=694cbd3bf9' />

      <TitleBody
        title={'Our journey, Our identity'}
        text='With CRUISE, our journeys together are more than just trails—they become ‘Mobility Personas,’ containing the user’s tastes and discoveries. Every recorded moment inspires others and grows through different perspectives. Our footsteps create an ever-changing map that fuels inspiration for every new adventure.'
      />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106713092?h=1946f5e58b' />

      <Divide title='Vision & Expectation' number='06' />

      <MidTitle align='center' padding={false} text='Future Value of CRUISE' />
      <MidBody
        content='CRUISE redefines everyday movement experiences into a dynamic, sharing journey. Proposing a future where people’s personal discoveries and tastes intertwine, every trip is filled with vibrant exploration.'
      />
      <Image Image='/images/projects/cruise/cruise_16.jpg' />

      <MidBody content='Ready to turn all everyday trips into a journey full of discoveries?' />
      <Image Image='/images/projects/cruise/cruise_17.jpg' />
      <Image Image='/images/projects/cruise/cruise_18.jpg' />
      <MediaContainer type='video' src='https://player.vimeo.com/video/1106713465?h=79087f8614' />
      <Image Image='/images/projects/cruise/cruise_20.jpg' />
      <Image Image='/images/projects/cruise/cruise_21.jpg' />

      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '윤여준',
              role: 'PL · ID',
              englishName: 'Yeojun Yun',
              profileImage: '/images/profile/yeojunyun.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/yjydesign',
                instagram: 'https://instagram.com/jun_e1ght',
              },
            },
            {
              name: '강형구',
              role: 'ID',
              englishName: 'HyungGoo Kang',
              profileImage: '/images/profile/hyunggookang.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/mikekang',
                instagram: 'https://instagram.com/imsii_id',
              },
            },
            {
              name: '권민지',
              role: 'UX',
              englishName: 'Minji Kwon',
              profileImage: '/images/profile/minjikwon.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/noeyeono',
                instagram: 'https://instagram.com/or.noey',
              },
            },
            {
              name: '백채영',
              role: 'VD',
              englishName: 'Chaeyoung Baek',
              profileImage: '/images/profile/chaeyoungbaek.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/baekchaeyoung',
                instagram: 'https://instagram.com/100__chaeyoung',
              },
            },
            {
              name: '정민서',
              role: 'ID',
              englishName: 'Minseo Jung',
              profileImage: '/images/profile/minseojung.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/msj',
                instagram: 'https://instagram.com/mseo_119',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/en/projects/mizi' }}
          nextItem={{ label: 'Next', url: '/en/projects/silmul' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'Mizi',
            koreanName: '미지',
            linkUrl: '/en/projects/mizi',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'Silmul',
            koreanName: '실물',
            linkUrl: '/en/projects/silmul',
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
