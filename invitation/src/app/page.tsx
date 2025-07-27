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
} from '@/components/projects'
import { useScrollAtBottom } from '@/hooks'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const tutorData = [
  {
    title: 'Advisory Professor',
    tutors: [
      { name: '홍길동', englishName: 'Gildong Hong' },
      { name: '김철수', englishName: 'Cheolsu Kim' },
    ],
  },
  {
    title: 'UX tutor',
    tutors: [{ name: '이영희', englishName: 'Younghee Lee' }],
  },
  {
    title: 'VD tutor',
    tutors: [
      { name: '박민수', englishName: 'Minsu Park' },
      { name: '최지은', englishName: 'Jieun Choi' },
      { name: '최지은', englishName: 'Jieun Choi' },
      { name: '최지은', englishName: 'Jieun Choi' },
    ],
  },
]

const thankstoData = [
  {
    title: 'VD tutor',
    tutors: [
      { name: '박민수', englishName: 'Minsu Park' },
      { name: '최지은', englishName: 'Jieun Choi' },
      { name: '최지은', englishName: 'Jieun Choi' },
      { name: '최지은', englishName: 'Jieun Choi' },
    ],
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
  const [isPointClicked, setIsPointClicked] = useState(false)
  const [currentPoint, setCurrentPoint] = useState(
    points[0], // 초기값으로 첫 번째 포인트 설정
  )

  const isAtBottom = useScrollAtBottom(10)

  const setOpenSidebar = (point: any) => {
    if (isPointClicked) {
      setIsPointClicked(false)
      return
    }
    setCurrentPoint(point)
    setIsPointClicked(true)
  }

  return (
    <>
      <Header />
      <Summary />
      <MainImage />
      <Divide title='Background' number='01' />
      <TitleBody title='‘나의 순간’에 몰입하는 방법' text='Slac은 언제나 소리와 함께하는 Z세대가 소리로 ‘나의 순간’에 몰입하는 방법을 제안합니다. 모든 순간 나를 가장 가까이서 이해하는 웨어러블 오디오를 통해 나와 닮아가는 소리는 마치 나에게 딱 맞는 옷을 입는 것처럼 변화합니다. Slac과 함께 디렉터가 되어, 소리로 완성되는 나만의 #Scene을 만나보세요!'/>
      <RightTitleBody />
      <RightBody />
      <MidBody content='Slac은 언제나 소리와 함께하는 Z세대가 소리로 ‘나의 순간’에 몰입하는 방법을 제안합니다. 모든 순간 나를 가장 가까이서 이해하는 웨어러블 오디오를 통해 나와 닮아가는 소리는 마치 나에게 딱 맞는 옷을 입는 것처럼 변화합니다. Slac과 함께 디렉터가 되어, 소리로 완성되는 나만의 #Scene을 만나보세요!' />
      <MidTitle />
      <LeftTitle />
      <MediaContainer type='video' src='https://player.vimeo.com/video/844128999' alt='이곳에 비디오를' />
      <ImageGallery images={['/images/image1.jpeg', '/images/image2.jpeg', '/images/image3.jpeg']} />
      <Credit
        title='Designed By'
        members={[
          {
            name: '김민채',
            role: 'PL · UX',
            englishName: 'Gildong Hong',
            profileImage: '/images/32_UX_백채영_1.png',
            socialLinks: {
              linkedin: 'https://linkedin.com',
              behance: 'https://behance.net/kim',
              instagram: 'https://instagram.com/kim',
            },
          },
          {
            name: '김민채',
            role: 'PL · UX',
            englishName: 'Gildong Hong',
            profileImage: '/images/32_UX_백채영_1.png',
            socialLinks: {
              linkedin: 'https://linkedin.com',
              behance: 'https://behance.net/kim',
              instagram: 'https://instagram.com/kim',
            },
          },
          {
            name: '김민채',
            role: 'PL · UX',
            englishName: 'Gildong Hong',
            profileImage: '/images/32_UX_백채영_1.png',
            socialLinks: {
              linkedin: 'https://linkedin.com',
              behance: 'https://behance.net/kim',
              instagram: 'https://instagram.com/kim',
            },
          },
          {
            name: '김민채',
            role: 'PL · UX',
            englishName: 'Gildong Hong',
            profileImage: '/images/32_UX_백채영_1.png',
            socialLinks: {
              linkedin: 'https://linkedin.com',
              behance: 'https://behance.net/kim',
              instagram: 'https://instagram.com/kim',
            },
          },
          {
            name: '김민채',
            role: 'PL · UX',
            englishName: 'Gildong Hong',
            profileImage: '/images/32_UX_백채영_1.png',
            socialLinks: {
              linkedin: 'https://linkedin.com',
              behance: 'https://behance.net/kim',
              instagram: 'https://instagram.com/kim',
            },
          },
        ]}
      />
      <CreditTutor title='Tutor' sections={tutorData} />
      <CreditThanksTo title='Thanks to' sections={thankstoData} />
      <MobileNavigation />
      <ProjectNavigation />
      <ArchiveImage src='/images/pc_archive.png'>
        <ArchivePoint point={points[0]} setOpenSidebar={setOpenSidebar} />
      </ArchiveImage>
      <AnimatePresence>
        {isPointClicked && <ArchiveSidebar isVisible={!isAtBottom} currentPoint={currentPoint} />}
      </AnimatePresence>
      <div className='h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100 flex items-center justify-center text-gray-500 text-sm'>
        스크롤이 바닥에 닿을 때, 사라지는 사이드바 기능을 확인하기 위한 여백입니다.
      </div>
      <Footer />
    </>
  )
}
