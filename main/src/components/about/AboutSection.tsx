// components/about/AboutSection.tsx
'use client'

import { Header, Footer, MainImage, Divide, MidBody, CreditThanksTo, MediaContainer } from '@/components/projects'
import {
  HeaderBody,
  Credit,
  SolutionSentence,
  Image,
  TitleBody,
  CursorPlay,
  GraphicPlay,
  Blank,
  SpecialMidBody,
} from '@/components/about'
import { FooterDocked } from '@/components/projects'
import classNames from 'classnames'
import Link from 'next/link'
import { CursorArea } from '../cursor/CursorArea'
type Tutor = { name: string; englishName?: string }
type ThanksSection = { title: string; tutors: Tutor[] }
type Props = { embedded?: boolean }

export default function AboutSection({ embedded = false }: Props) {
  const thankstoData = [
    {
      subSections: [
        {
          title: 'Project Director',
          tutors: [{ name: '정소영', englishName: 'Soyeong Jeong' }],
        },
        {
          title: 'Project Management',
          tutors: [
            { name: '배석원', englishName: 'Seokwon Bae' },
            { name: '이희원', englishName: 'Heewon Lee' },
          ],
        },
      ],
    },
    {
      title: 'Advisory\nProfessor',
      tutors: [
        { name: '김치헌', englishName: 'Chiheon Kim' },
        { name: '이문환', englishName: 'Moonhwan Lee' },
      ],
    },
    {
      title: 'BX Tutor',
      tutors: [
        { name: '윤지영', englishName: 'Jiyoung Yoon' },
        { name: '이재민', englishName: 'Jaemin Lee' },
      ],
    },
    {
      subSections: [
        {
          title: 'Motion Tutor',
          tutors: [{ name: '이태열', englishName: 'Taeyeol Lee' }],
        },
        {
          title: 'Space Tutor',
          tutors: [{ name: '이달우', englishName: 'Dalwoo Lee' }],
        },
      ],
    },
    {
      title: 'Web Tutor',
      tutors: [{ name: '고윤서', englishName: 'Yunseo Go' }],
    },
    {
      title: 'Web Developer',
      tutors: [{ name: '장예원', englishName: 'Yewon Jang' }],
    },
    {
      title: 'Translator',
      tutors: [{ name: '김소현', englishName: 'Sohyun Kim' }],
    },
    {
      title: 'Photographer',
      tutors: [{ name: '김세희', englishName: 'Sehee Kim' }],
    },
  ]

  const delayFor = (i: number, base = 400) => i * base
  return (
    <>
      <div className='relative w-full h-fit md:hidden lg:block'>
        <Blank />
      </div>
      <div className='relative w-full aspect-[1440/1275] font-english font-semibold'>
        <h1 className='hidden md:block absolute text-white z-[1000] md:top-[71.3px] lg:top-[68px] left-1/2 -translate-x-1/2 text-[clamp(25.6px,3.3vw,48px)] text-center mix-blend-difference leading-none'>
          New Formative
        </h1>
        <h2 className='hidden md:block absolute text-white z-[1000] md:top-[134px] lg:top-[186px] left-1/2 -translate-x-1/2 text-[clamp(25.6px,3.3vw,48px)] text-center mix-blend-difference leading-none'>
          Steady Movement
          <br />
          For Progress
        </h2>
        <MediaContainer
          type='video'
          src='https://player.vimeo.com/video/1111955721?h=6dd9a3908a'
          preloadDelayMs={delayFor(0)}
          prewarm
          muted
          loop
          position='relative'
          aspect='aspect-[1440/1275]'
        />
      </div>
      <HeaderBody
        title={['What is New Formative?']}
        description={
          '새로움을 만드는 데 필요한 것은 대단한 변화나 특별한 순간이 아닌, 자신만의 방향을 탐색하며 꾸준히 움직이는 에너지입니다. 2025 MEP 〈New Formative〉는 새로운 형성을 위해 나아가며 각자의 에너지가 만들어내는 꾸준한 움직임의 과정을 담고 있습니다.'
        }
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1111698129?h=054df76750'
        preloadDelayMs={delayFor(1)}
        prewarm
        muted
        loop
        position='absolute'
      />
      {/* 여기에 인터랙션 */}
      <CursorArea variant='drag'>
        <GraphicPlay />
      </CursorArea>
      <Divide title='Movement as a System' number='01' />
      <Image src='/images/about/about_3.jpg' alt='about_3.png' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1111698151?h=6558b4a627'
        preloadDelayMs={delayFor(2)}
        prewarm
        muted
        loop
        position='absolute'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1111698170?h=1605b05f58'
        preloadDelayMs={delayFor(3)}
        prewarm
        muted
        loop
        position='absolute'
        aspect='aspect-[1440/1440]'
      />
      <Divide title='Archive' number='02' />
      <TitleBody
        title={'Archive\nMovement'}
        text={
          '전시 준비 과정에서 움직임의 궤적을 놓치지 않기 위해, 형성의 과정에서 만들어진 사진과 영상을 아카이빙합니다. 수많은 시도와 탐색의 과정은 물론, 멈칫하거나 전환되는 순간의 과정까지 움직임의 일부로 포착합니다.'
        }
      />
      <CursorPlay />
      <Divide title='Identities' number='03' />
      <SpecialMidBody
        content={
          '전시장에서는 9개의 팀과 개인들이 각자의 리듬과 방식으로 걸어온 형성의 과정들이 펼쳐집니다. 저마다의 궤적을 통해 새로운 방향을 실험하고, 그 움직임을 시각화합니다.'
        }
        align='center'
      />
      <HeaderBody title={'9Teams are Formative'} />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1111923208?h=8ffe13e711'
        preloadDelayMs={delayFor(4)}
        prewarm
        muted
        loop
        position='absolute'
      />
      <TitleBody
        title={'New Formative \nBegins Here'}
        text='2025 MEP 〈New Formative〉 전시 공간에서는 여러분의 감각과 해석으로 완성되어 가는 여정을 경험할 수 있습니다. 형성이라는 태도가 우리의 사고와 감각으로 어떻게 확장될 수 있는지, 이곳에서 함께 포착해 보세요.'
      />
      <Image src='/images/about/about_7.jpg' alt='about_7.jpg' />
      <Image src='/images/about/about_8.jpg' alt='about_8.jpg' />
      <MidBody
        content={
          '삼성디자인멤버십 회원들의 비전과 태도를 드러내는 ‘New Step’을 시작으로, 다양한 분야가 교차하며 새로운 가능성을 모색하는 ‘New Link’, 각자의 고유한 문제의식을 바탕으로 전개된 ‘New Focus’, 마지막으로 감각적 실험이 응집된 ‘New Spark’순으로 이어집니다.'
        }
      />
      <Image src='/images/about/about_9.jpg' alt='about_9.jpg' />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1111922823?h=ac59ec64c9'
        preloadDelayMs={delayFor(5)}
        prewarm
        muted
        loop
        position='absolute'
      />
      <TitleBody
        title={'Make your \nMovement'}
        text={
          '당신을 움직이게 하는 순간은 무엇인가요?\n웹사이트에 이미지를 등록하고, 나만의 Formative Movement를 만들어 공유해보세요.'
        }
      />
      <div
        className={classNames(
          'w-full flex justify-center items-center',
          'px-[4.10vw] pb-[56px]',
          'md:px-[5.2vw] md:pb-[56px]',
          'lg:px-[14.10vw] lg:pb-[84px]',
        )}
      >
        <Link
          href='/movement'
          className={classNames(
            'bg-black text-white rounded-full font-medium md:hover:opacity-80 active:scale-95 transition-all duration-300 flex justify-center items-center',
            'px-[20px] py-[6px] w-[210px] h-[56px] text-[17px] tracking-[-0.34px] leading-[1.3]',
            'md:px-[20px] md:py-[6px] md:w-[210px] md:h-[56px] md:text-[17px] md:tracking-[-0.34px]',
            'lg:px-[34.2px] lg:py-0 lg:w-fit lg:h-[68px] lg:text-[18px] lg:tracking-[-0.36px]',
          )}
        >
          Let's Move
        </Link>
      </div>

      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1111698249?h=c3c60ea4e2'
        preloadDelayMs={delayFor(6)}
        prewarm
        muted
        loop
        position='absolute'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1112031282?h=09ff3b19f0'
        preloadDelayMs={delayFor(7)}
        prewarm
        muted
        loop
        position='absolute'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1111698334/?h=1bbff8b3c0'
        preloadDelayMs={delayFor(8)}
        prewarm
        muted
        loop
        position='absolute'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1111698364?h=ae4b7882d5'
        preloadDelayMs={delayFor(9)}
        prewarm
        muted
        loop
        position='absolute'
      />
      <MediaContainer
        type='video'
        src='https://player.vimeo.com/video/1111745680?h=557e6bfee9'
        preloadDelayMs={delayFor(9)}
        prewarm
        muted
        loop
        position='absolute'
      />
      <Image src='/images/about/about_16.webp' alt='about_16.gif' />
      <Image src='/images/about/about_17.jpg' alt='about_17.jpg' aspect='aspect-[1440/1920]' />
      <Image src='/images/about/about_18.jpg' alt='about_18.jpg' />
      <Image src='/images/about/about_19.jpg' alt='about_19.jpg' />
      <Image src='/images/about/about_20.jpg' alt='about_20.jpg' />
      <Image src='/images/about/about_21.webp' alt='about_21.gif' aspect='aspect-[1440/940]' />
      <Image src='/images/about/about_22.jpg' alt='about_22.jpg' />
      <Image src='/images/about/about_23.jpg' alt='about_23.jpg' />
      <Image src='/images/about/about_24.jpg' alt='about_24.jpg' />
      <Credit
        title='Designed By'
        members={[
          {
            name: '김자영',
            role: 'PL',
            englishName: 'Zay Kim',
            profileImage: '/images/about/32_UX_김자영_1.png',
            socialLinks: {
              linkedin: 'https://www.linkedin.com/in/za0kim/',
              behance: 'https://www.behance.net/kzmgy',
              instagram: 'https://instagram.com/dynamicsgraphics',
            },
          },
          {
            name: '고윤서',
            englishName: 'Yoonseo Ko',
            profileImage: '/images/about/32_UX_고윤서_1.png',
            socialLinks: {
              linkedin: '',
              behance: 'https://www.behance.net/kohyoonseo',
              instagram: 'https://instagram.com/go.kkirri',
            },
          },
          {
            name: '황다영',
            englishName: 'Dayeong Hwang',
            profileImage: '/images/about/32_UX_황다영_1.png',
            socialLinks: {
              linkedin: '',
              behance: 'https://www.behance.net/dayeonghwang',
              instagram: 'https://instagram.com/alsbiwc',
            },
          },
          {
            name: '김민채',
            englishName: 'Minchae Kim',
            profileImage: '/images/about/32_UX_김민채_1.png',
            socialLinks: {
              linkedin: 'https://www.linkedin.com/in/minchaekim02/',
              behance: 'https://www.behance.net/mck020406',
              instagram: 'https://instagram.com/minn_works',
            },
          },
          {
            name: '이채연',
            englishName: 'Chaeyeon Lee',
            profileImage: '/images/about/32_UX_이채연_1.png',
            socialLinks: {
              linkedin: '',
              behance: 'https://www.behance.net/chaeyeon_lee',
              instagram: 'https://instagram.com/aceehnoy',
            },
          },
          {
            name: '장유진',
            englishName: 'Yujin Jang',
            profileImage: '/images/about/32_UX_장유진_1.png',
            socialLinks: {
              linkedin: '',
              behance: 'https://www.behance.net/iiamyooo',
              instagram: 'https://instagram.com/iiamyooo',
            },
          },
        ]}
      />
      <CreditThanksTo title='Thanks to' sections={thankstoData} />
      <FooterDocked />
    </>
  )
}
