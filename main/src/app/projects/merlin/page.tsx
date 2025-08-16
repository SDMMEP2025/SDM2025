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
      { name: '이우성', englishName: 'Wooseong Lee' },
      { name: '박수경', englishName: 'Sukyung Park' },
    ],
  },
  {
    title: 'UX tutor',
    tutors: [{ name: '이진원', englishName: 'Jinwon Lee' }],
  },
]

const thankstoData = [
  {
    title: 'Videographer',
    tutors: [{ name: '서영진', englishName: 'Youngjin Seo' }],
  },
  {
    title: 'Adviser',
    tutors: [
      { name: '김도아', englishName: 'Doa Kim' },
      { name: '박상희', englishName: 'Sanghee Park' },
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
        svgSrc='/images/logo/Merlin_logo.svg'
        className='w-[52px] md:w-[100px] lg:w-[clamp(100px,10vw,144px)]'
        title={['멀린', 'Into Your Flow, Merlin OS']}
        description='Merlin OS는 앱 전환과 복잡한 탐색을 줄여 사용자가 빠르게 목표에 도달하도록 돕는 흐름 중심 운영체제입니다. 사용자 상황을 실시간으로 인식하고, 여러 앱에 흩어진 기능을 하나의 흐름으로 연결해 기존의 정적이고 앱 중심적인 UI를 넘어 보다 유연하게 몰입하는 경험을 제공합니다. 흐름을 조율하는 새로운 운영체제, Merlin과 함께 미래의 디지털 여정을 시작해보세요.'
        credits='김유민, 이소은, 안지원, 양준홍, 조서현'
      />
      <MainImage Image='/images/projects/cruise/image1.png' />
      <Divide title='Background' number='01' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'블록처럼 쌓여있는\n정적인 UI'}
        text='모든 사용자는 저마다 서로 다른 방식으로 모바일을 사용합니다. 자주 사용하는 앱과 기능, 홈 화면의 배치는 물론이고, 모바일을 쥐는 방식, 손이 닿는 영역과 터치할 때의 압력까지도요.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody text='하지만, 현재의 모바일 인터페이스는 이러한 차이를 고려하지 않은 채, 모든 사용자에게 매번 동일한 위치에서 동일한 버튼을 제공하고 있습니다. 정적인 그리드 안에서 블록처럼 쌓인 기능들은, 사용자에게 학습되고 적응되기를 기다리며 수동적으로 존재합니다.' />
      <Divide number='02' title='Target' />

      <Image Image='/images/projects/cruise/cruise_2.jpg' />

      <TitleBody
        title={'디지털 드리블을 수없이\n반복하는 Z세대'}
        text='모두에게 똑같이 제공되는 정적인 UI 구조는 짧은 시간 동안 여러 앱을 넘나드는 Z세대의 탐색 방식과 충돌합니다. Z세대는 탭을 빠른 속도로 전환하며 인터랙션하는 패턴을 보이며, 탐색 과정에서 런처 또는 최근 탭 목록을 반복적으로 오가는 ‘디지털 드리블’을 경험합니다.'
      />
      <Divide number='03' title='Research' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />

      <TitleBody
        title={'‘익숙한 미로’ 같은\n디지털 길찾기'}
        text={
          <>
            Z세대는 앱이나 기능 전체보다는 일부 특정 기능을 집중적으로 사용하고 있습니다. 이들의 모바일에는 평균 130개의
            앱이 설치되어 있지만, 그중 주 10회 이상 사용하는 앱은 평균 12개에 불과하죠. 앱 내에서조차 나에게 편안한 몇
            가지 기능만을 집중적으로 사용하면서, 이들에게 디지털 경험은 복잡하더라도 늘 같은 경로를 따라 앱과 버튼을
            누르는 ‘익숙한 미로’입니다.
            <br />
            <br />
            <a href='https://umin.notion.site/merlinos' className='underline font-semibold' target='_blank'>
              &gt; 더 자세한 이야기는 여기에서
            </a>
          </>
        }
      />
      <Divide number='04' title='Problem' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'목표는 하나지만,\n 몰입을 끊는 수많은\n 중간 페이지들'}
        text={
          'Z세대는 습관적이고 빠르게 디지털을 사용하지만, 현재는 단 하나의 명확한 목적을 달성하기 위해서도 홈 화면, 앱 서랍, 최근 탭, 앱 내 탐색을 오가며 불필요한 시간과 에너지를 소모하고 있습니다. 이처럼 중간 과정에 해당하는 화면들이 방지턱처럼 작용해 사용자의 흐름을 끊으며, 과도한 인지적 부하와 피로를 유발하고 있습니다.'
        }
      />
      <Divide number='05' title='Insight' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'Z세대에게 필요한 것은\n 앱이 아닌 흐름'}
        text={
          '애플리케이션은 기능을 담는 공간이지만, 오히려 이 구조가 흐름을 끊는 걸림돌이 되고 있습니다. 사용자가 직접 여러 레이어를 오가며 원하는 기능을 찾아 헤매는 대신, 처음부터 필요한 기능들이 하나의 흐름 위에 자연스럽게 연결된다면 어떨까요? 사용자의 행동 패턴을 이해하고 다음에 할 일을 예측해 자연스럽게 이어주는 ‘흐름 중심’의 새로운 디지털 구조가 필요합니다.'
        }
      />
      <Divide number='06' title='Solution' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <MidTitle text='Into Your Flow, Merlin OS' padding={false} />
      <MidBody
        content={
          '흐름 중심의 차세대 운영 체제 Merlin OS를 소개합니다.\nMerlin OS는 맥락에 따라 기능을 재구성하고, 앱의 경계를 넘어 하나의 연속된 플로우를 제공합니다. \n사용자는 더 이상 조작을 인식하거나 고민하지 않고, 자연스럽게 몰입할 수 있습니다.'
        }
      />
      <Divide number='07' title='Scenario' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'흐름으로 연결되는\n세 가지 경험'}
        text={
          'Merlin OS는 Contextual Flow, Appless Interface, Flexible UI 세 가지 원칙을 바탕으로, 사용자의 맥락과 습관에 맞춘 흐름 중심의 새로운 디지털 몰입 환경을 제공합니다. 사용자는 앱을 탐색하거나 UI를 학습하지 않아도, 상황에 따라 재배치된 기능 흐름을 자연스럽게 따라가며 원하는 작업에 빠르게 도달할 수 있습니다.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title='지금 바로 내게 딱 맞는 기능들만 모아, Contextual Flow'
        text='시간대, 장소, 그립 패턴 등 사용자의 상황과 맥락을 이해하고, 그에 맞는 흐름을 제공합니다. 맥락에 맞게 재배치된 흐름을 통해 사용자는 자신을 둘러싼 환경에 최적화된 디지털 여정을 경험할 수 있습니다.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody text='사용자의 시간, 위치, 습관을 인식해 상황에 맞춰 최적화된 기능 모음이 자동으로 구성됩니다. 중복된 앱 탐색 없이, 지금 필요한 기능 모음이 한 화면에서 곧바로 열리며 복잡한 탐색 없이 곧바로 원하는 결과에 도달할 수 있습니다.' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title='전환 없이 하나로 이어지는 경험, Appless Interface'
        text='애플리케이션 중심이 아닌, 흐름 중심의 경험을 제공합니다. 사용자가 앱 안으로 들어가 기능을 찾지 않아도 하나의 화면에서 필요한 기능이 자연스럽게 이어집니다.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody text='조작 과정에서의 방해나 몰입을 끊는 요소 없이 모바일 경험이 하나의 흐름으로 이어집니다. 계층 구조를 오르내리거나 분절된 단계를 거치지 않고, 앱을 전환하거나 메뉴를 헤맬 필요가 없습니다. 여러 앱을 거치지 않고 필요한 과정을 한 화면에서 연속적으로 해결할 수 있죠.' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightTitleBody
        title='몰입을 몰입답게, Flexible UI'
        text='몰입과 조작 각각의 본질적 역할에 맞는 인터랙션 경험을 제공합니다. 정보와 조작을 한 화면에 억지로 섞지 않고, 몰입을 위한 정보 레이어와 손의 동작을 고려한 조작 레이어로 구분합니다.'
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <RightBody text='사용자의 손 위치, 습관, 인터랙션 패턴을 바탕으로 필요한 컨트롤러를 재구성해, 사용자는 최소한의 동작으로 원하는 액션에 바로 접근할 수 있습니다.' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Divide number='08' title='Value' />
      <MidTitle text='Merlin OS가 설계한 새로운 디지털 흐름' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'끊김 없는 몰입,\n나를 닮은 OS'}
        text={
          'Merlin OS는 앱 전환 없이 이어지는 단일 플로우로 인지적∙조작적 피로를 줄이고, 사용자가 본연의 목적에 곧바로 몰입할 수 있도록 돕습니다. 명시적인 설정 없이도 사용자의 선택과 인터랙션을 학습해 점차 정교하게 개인화된 알고리즘형 OS로 진화합니다.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <TitleBody
        title={'흐름으로 연결된\n사용자 경험'}
        text={
          'Merlin OS는 모바일을 중심으로 동작하지만, AR, 태블릿, 데스크탑 등 다양한 디바이스와 연동해 유연하게 확장됩니다. 여러 하드웨어에서 일관된 흐름 기반의 아키텍처를 제공함으로써 사용자에게는 경계를 초월해 통합되는 경험을, 기업에는 지속 가능한 멀티 플랫폼 생태계의 기틀을 제공합니다.'
        }
      />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />
      <Image Image='/images/projects/cruise/cruise_2.jpg' />

      <div ref={designedByRef}>
        <Credit
          title='Designed By'
          members={[
            {
              name: '김유민',
              role: 'PL · UX',
              englishName: 'Yumin Kim',
              profileImage: '/images/profile/yuminkim.png',
              socialLinks: {
                linkedin: 'https://www.linkedin.com/in/kmyumn/',
                behance: 'https://www.behance.net/kmyumn',
                instagram: 'https://instagram.com/k_.myum_.n',
              },
            },
            {
              name: '이소은',
              role: 'UX',
              englishName: 'Soeun Lee',
              profileImage: '/images/profile/soeunlee.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/dllthdms',
                instagram: 'https://instagram.com/dllthdms',
              },
            },
            {
              name: '안지원',
              role: 'UX',
              englishName: 'Jiwon An',
              profileImage: '/images/profile/jiwonan.png',
              socialLinks: {
                linkedin: '',
                behance: '',
                instagram: 'https://instagram.com/2woniee',
              },
            },

            {
              name: '양준홍',
              role: 'VD',
              englishName: 'Junhong Yang',
              profileImage: '/images/profile/junhongyang.png',
              socialLinks: {
                linkedin: '',
                behance: 'https://www.behance.net/JunRed',
                instagram: 'https://instagram.com/jun.__.blue',
              },
            },
            {
              name: '조서현',
              role: 'UX',
              englishName: 'Seohyeon Cho',
              profileImage: '/images/profile/seohyeoncho.png',
              socialLinks: {
                linkedin: '',
                behance: '',
                instagram: 'https://instagram.com/zo.xhyn',
              },
            },
          ]}
        />
        <CreditTutor title='Tutor' sections={tutorData} />
        <CreditThanksTo title='Thanks to' sections={thankstoData} />
        <MobileNavigation
          previousItem={{ label: 'Previous', url: '/projects/hotcake' }}
          nextItem={{ label: 'Next', url: '/projects/autonomy-practice' }}
        />
        <ProjectNavigation
          leftProject={{
            id: '1',
            title: 'Left Project',
            imageUrl: '/images/previous_image.png',
            englishName: 'HOTCAKE',
            koreanName: '핫케익',
            linkUrl: '/projects/hotcake',
          }}
          rightProject={{
            id: '2',
            title: 'Right Project',
            imageUrl: '/images/next_image.png',
            englishName: 'AUTONOMY PRACTICE',
            koreanName: '오토노미 프랙티스',
            linkUrl: '/projects/autonomy-practice',
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
