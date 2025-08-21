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
import { useIsPhone } from '@/hooks/useIsPhone'
import mainAnim from '@/animation/main.json'
import Lottie from 'lottie-react'

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
  const isPhone = useIsPhone()

  const delayFor = (i: number, base = 400) => i * base
  return (
    <>
      <div className='relative w-full h-fit md:hidden lg:block'>
        <Blank />
      </div>
      <div className='relative w-full aspect-[1440/1275] font-english font-semibold'>
        <h1 className='hidden md:block absolute text-white z-[10] md:top-[71.3px] lg:top-[68px] left-1/2 -translate-x-1/2 text-[clamp(25.6px,3.3vw,48px)] text-center mix-blend-difference leading-none'>
          New Formative
        </h1>
        <h2 className='hidden md:block absolute text-white z-[10] md:top-[134px] lg:top-[186px] left-1/2 -translate-x-1/2 text-[clamp(25.6px,3.3vw,48px)] text-center mix-blend-difference leading-none'>
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
          'Innovation is the steady progress of our way, not just the result of dramatic changes or rare moments. 2025 MEP 〈New Formative〉 shows the journey of steady progress— moving forward to create new forms through the unique energy of each individual.'
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

      {isPhone && (
        <Lottie
          animationData={mainAnim}
          autoplay={true}
          loop={true}
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          style={{ width: '100%', height: '100%' }}
          className='[&_svg]:w-full [&_svg]:h-full [&_svg]:block'
        />
      )}

      {!isPhone && (
        <CursorArea variant='drag'>
          <GraphicPlay />
        </CursorArea>
      )}

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
        title={
          <>
          Archive
          {' '}
            <br className='hidden md:block'/>
          Movement
          </>
        }
        text={
          'During the exhibition preparation, we archive photos and videos that trace every step of the journey — not only the attempts and explorations, but also the pauses and progress along the way.'
        }
      />

      {isPhone && (
        <MediaContainer
          type='video'
          src='https://player.vimeo.com/video/1112046440?h=104236d545'
          preloadDelayMs={0}
          prewarm
          muted
          loop
        />
      )}

      {!isPhone && <CursorPlay />}
      <Divide title='Identities' number='03' />
      <SpecialMidBody
        content={
          'At the exhibition, 9 teams share their unique rhythms and journeys of growth. Each team explores new directions, translating these movements into vibrant visual forms.'
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
        text='At 2025 MEP 〈New Formative〉, you can experience a journey that comes through your perspective and interpretations. Discover how a steady, ongoing attitude of creation expands our cognition and perception.'
      />
      <Image src='/images/about/about_7.jpg' alt='about_7.jpg' />
      <Image src='/images/about/about_8.jpg' alt='about_8.jpg' />
      <MidBody
        content={
          'The exhibition starts with New Step, reflecting the vision and attitude of the Samsung Design Membership members. Next, it moves to New Link, where different fields come together and new possibilities grow. Then comes New Focus, based on each member’s unique insights and defining problems. Finally, it ends with New Spark, where sensory experiments come together into a vivid and powerful expression.'
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
      title={
        <>
        Make your 
          {' '}
          <br className='hidden md:block'/>
        Movement
        </>
        }
        text={
          'What moment moves you?\nAdd your image, create your Formative Movement, and share it.'
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
