//app/about/page.tsx

'use client'
import { Header, Footer, MainImage, Divide, MidBody, CreditThanksTo } from '@/components/projects'
import { HeaderBody, Credit, SolutionSentence, TitleBody, Image } from '@/components/about'
import classNames from 'classnames'
import AboutSection from '@/components/about/AboutSection'

export default function AboutPage() {
  const thankstoData = [
    {
      title: 'Advisory \nProfessor',
      tutors: [
        { name: '김지헌', englishName: 'Kim Chiheon' },
        { name: '이문환', englishName: 'Lee Moonhwan' },
      ],
    },
    {
      title: 'ID tutor',
      tutors: [{ name: '홍길동1', englishName: 'Gildong Hong' }],
    },
    {
      title: 'UX tutor',
      tutors: [
        { name: '홍길동2', englishName: 'Gildong Hong' },
        { name: '홍길동3', englishName: 'Gildong Hong' },
        { name: '홍길동4', englishName: 'Gildong Hong' },
      ],
    },
    {
      title: 'VD tutor',
      tutors: [
        { name: '홍길동5', englishName: 'Gildong Hong' },
        { name: '홍길동6', englishName: 'Gildong Hong' },
      ],
    },
  ]

  return (
    <>
      <Header />
      <AboutSection/>
      <Footer />
    </>
  )
}




