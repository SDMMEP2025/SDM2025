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
  const delayFor = (i: number, base = 200) => i * base

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
      <Blank />
      <Header />
      <Summary
        svgSrc='/images/logo/Silmul_logo.svg'
        title={['실물', 'Turning real senses into real objects']}
        description={
          <>
            Silmul은 자신의 실제 감각과 경험을 실물로 구현할 수 있는 새로운 창작 과정을 제안합니다. 나의 감각과 경험이
            만질 수 있는 실체가 될 때, 창작은 더 이상 어렵지 않고 계속 이어질 수 있을 거예요. <br />
            Realize Real Sense into Real Object, Silmul!
          </>
        }
        credits='김선일, 현수련, 박세연, 서현빈, 윤현경'
        className='w-[74px] md:w-[96px] lg:w-[clamp(96px,8.75vw,130px)]'
      />
      <Image Image='/images/projects/silmul/silmul_main.jpg' />
      <Divide title='Background' number='01' className='text-[#E30D2D]' />
      <RightTitleBody
        title='창작을 망설이게 하는 심리적 부담감'
        text={
          <>
            무언가를 만들고 표현하고자 하는 근원적인 창작 욕구는 누구에게나 존재합니다.
            <br />
            <br />
            그런데도 사람들은 창작을 막연히 ‘재능 있는 사람들의 일’로 인식하고, 쉽게 시작하기 어려운 일로 느끼곤 하죠.
            <br />
            <br />
            이는 창작을 ‘무(無)에서 유(有)를 창조하는 특별한 행위’로 생각하는 데서 비롯됩니다.
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_1.webp' />
      <Divide title='Discover' number='02' className='text-[#E30D2D]' />
      <MidBody
        align='left'
        content={
          <>
            그렇다면 창작은 정말 무(無)에서 유(有)를 만드는 과정일까요? 그렇지 않습니다.
            <br />
            <br />
            창작은 잠재된 경험의 총체가 표현되는 ‘유(有)에서 유(有)의 과정’입니다. 대부분의 창작은 완전한 백지상태에서
            출발하지 않고, 우리가 평소에 느끼는 감각과 축적된 경험 그리고 맥락을 토대로 이루어지기 때문이죠.
            <br />
            <br />
            특히 디지털 시대의 AI 창작 메커니즘을 살펴보면, 유(有)에서 유(有)의 창작 방식이 명확하게 드러납니다. 이러한
            도구와 기술의 발전으로 창작에 대한 진입 장벽 역시 함께 완화되고 있음을 알 수 있죠.
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_2.webp' />
      <Divide title='Limitation' number='03' className='text-[#E30D2D]' />
      <MidBody align='center' content={<>그러나, 디지털 시대의 창작에 대한 아쉬움의 목소리는 여전히 존재합니다.</>} />
      <Image Image='/images/projects/silmul/silmul_3.webp' />
      <LeftTitle
        text={
          <a href='https://bio.link/silmul' className='underline font-semibold' target='_blank'>
            ▶︎ A more detailed story of Silmul
          </a>
        }
        className='text-[#E30D2D]'
      />
      <Divide title='Concept' number='04' className='text-[#E30D2D]' />
      <LeftTitle
        text={
          <>
            Turning real senses into real objects , Silmul <br />
            실감을 실물로 구현하다
          </>
        }
        padding={false}
        className='text-[#E30D2D]'
      />
      <MidBody
        align='left'
        content={
          <>
            실감 ¹ : 개인이 이미 가지고 있는 감각, 기억, 취향 등 잠재된 경험의 총체
            <br />
            실물 ² : 흩어져 있던 경험을 보고 느끼고 만질 수 있는 구체적 형태로 만드는 것
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
        title='실감을 실물로 구현하는 창작 경험'
        text={
          <>
            Silmul[실물]은 ‘창작의 감각적 실감’을 경험하도록 돕는 새로운 창작 도구입니다.
            <br />
            <br />
            디지털 화면 속에만 존재하고, 만질 수 없었던 창작의 경험을 현실의 ‘실물’로 구현해 보세요. 더욱 적극적으로
            만지고, 상호작용을 하며 말이죠.
            <br />
            <br />
            이를 위해 Silmul은 Gen-AI의 쉽고 빠른 창작 프로세스에 더해, 실물로의 구현을 위해 3D Printing 기술을 함께
            활용합니다.
          </>
        }
      />
      <Divide title='Technical problem' number='05' className='text-[#E30D2D]' />
      <MidBody
        align='center'
        content={
          <>
            3D 프린터는 근미래에 가정에서도 사용할 수 있을 만큼 발전하고 있지만,
            <br />
            여전히 가정 환경에서 창작 도구로 활용하기에 형태나 사용 방식은 적합하지 않습니다.
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_5.webp' />
      <Divide title='New Creation Paradigm' number='06' className='text-[#E30D2D]' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1110683367?h=168d4cbe88'
        preloadDelayMs={0}
        prewarm
        muted
        loop
      />
      <Image Image='/images/projects/silmul/silmul_7.jpg' />
      <RightTitleBody
        title='Product, ‘Sense’ ¹'
        text={
          <>
            실공간에서 제스처로 크기를 확인하고, 색감과 형태 등의 요소를 Seamless 하게 데이터로 연동시켜 주는 프로덕트
          </>
        }
      />
      <RightTitleBody
        title='Product, ‘Realize’ ²'
        text={<>창작자가 만지고 느낄 수 있는 ‘실물’ 자체를 출력해 주는 프로덕트</>}
      />
      <Divide title='User Scenario' number='07' className='text-[#E30D2D]' />
      <MidTitle align='center' text='Sense: The easiest way to start creating' className='text-[#E30D2D]' />
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
            일상에서 마주하는 모든 감각[실감]은 창작의 밑거름이 됩니다.
            <br />
            Sense를 활용하면 ‘무엇을 어떻게 만들지’ 고민하지 않아도 자연스럽게 창작을 시작할 수 있습니다.
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_9.webp' />
      <RightTitleBody
        title={null}
        text={
          <>
            'Sense'와 함께라면 평소 가늠하기 어렵던 크기도 제스처 하나로 쉽게 확인할 수 있어요. 일상에서 마주하는
            다채로운 색상과 형태도 다른 장치를 거치지 않고 곧바로 창작에 활용할 수 있죠.
          </>
        }
      />
      <MidTitle align='center' text='Service: Generate experiences through Gen-AI' className='text-[#E30D2D]' />
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
            감각과 경험은 형체가 없죠. 하지만 'Sense'를 통해 데이터화되고, Silmul App와 연동됩니다. 자연스럽게 모인
            감각의 조각들을 조합하여, 만들고 싶은 실물의 이미지를 Gen-AI로 생성해 보세요. 그렇게 만들어진 결과물은
            나만의 경험에서 비롯된, 세상에 단 하나뿐인 결과물이 되죠!
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
      <MidBody align='center' content={<>원하는 결과물이 만들어졌다면, 이제는 진짜 실물로 출력해 보죠!</>} />
      <Image Image='/images/projects/silmul/silmul_12.webp' />

      <MidTitle align='center' text='Realize: From experience to real object' className='text-[#E30D2D]' />
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
            실물로 출력하기 위해서는 필라멘트와 잉크만 준비하면 됩니다.
            <br />
            상상 속 이미지가 실물로 구현되는 과정을 지켜보며, 창작의 즐거움에 푹 빠져보세요!
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_15.webp' />
      <Divide title='Extra Value' number='08' className='text-[#E30D2D]' />
      <MidTitle
        align='center'
        text='Tagging: Not the end of making - the beginning of expanding'
        className='text-[#E30D2D]'
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
            출력되는 실물에 태그가 새겨지며, 이를 스캔하면 창작 과정에서의 경험과 기억이 재생됩니다. Tagging System은
            사용 중에도 쌓이는 새로운 경험도 계속해서 추가할 수 있어요. 실물 창작의 경험은 계속 확장될 수 있다는 뜻이죠.
          </>
        }
      />
      <MidTitle align='center' text='Melting: Sustainable cycle of Silmul' className='text-[#E30D2D]' />
      <Image Image='/images/projects/silmul/silmul_17.webp' />
      <MidBody
        align='center'
        content={
          <>
            출력된 실물이 쓰임을 다했거나, 벌써 취향이 바뀌었다고요?
            <br />
            Melting System으로 다시 녹여 친환경 필라멘트로 재활용할 수 있어요. 이게 바로 지속 가능한 순환이죠.
          </>
        }
      />
      <Image Image='/images/projects/silmul/silmul_18.webp' />
      <Image Image='/images/projects/silmul/silmul_19.jpg' />
      <Image Image='/images/projects/silmul/silmul_20.jpg' />

      <MidTitle align='center' text='Turning real senses into real objects, Silmul' className='text-[#E30D2D]' />

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
          previousItem={{ label: 'Previous', url: '/projects/cruise' }}
          nextItem={{ label: 'Next', url: '/projects/potrik' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'Cruise',
            koreanName: '크루즈',
            linkUrl: '/projects/cruise',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'Potrik',
            koreanName: '포트릭',
            linkUrl: '/projects/potrik',
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
