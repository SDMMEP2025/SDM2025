//app/about/page.tsx

'use client'
import { Header, Footer, MainImage, Divide, MidBody, CreditThanksTo } from '@/components/projects'
import { HeaderBody, Credit, SolutionSentence, TitleBody, Image } from '@/components/about'
import classNames from 'classnames'

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
      <MainImage Image='/5TF/'/>
      <HeaderBody
        title={['What is New Formative?']}
        description='새로움을 만드는 데 필요한 것은 대단한 변화나 특별한 순간이 아닌, 자신만의 방향을 탐색하며 꾸준히 움직이는 에너지입니다. 2025 MEP 〈New Formative〉는 새로운 형성을 위해 나아가며  각자의 에너지가 만들어내는 꾸준한 움직임의 과정을 담고 있습니다.'
      />
      <Image src='' alt='main image' />
      <Divide title='Behind Formative' number='01' />
      <TitleBody
        title={'Value of \nNew Formative'}
        text={
          '우리는 이미 완료된 수많은 혁신들 사이에서 다양한 것들을 수용하고, 적응하는 데 익숙해져 있습니다. 하지만 변화의 속도는 점점 더 빨라지고, 새로운 것이 등장하는 주기 역시 짧아지고 있죠. 이러한 흐름 속에서 단순히 수용하고 적응하는 데에만 머물러도 괜찮을까요?'
        }
      />
      <Image src='' alt='behind formative1' />
      <TitleBody
        text={
          '2025 MEP 〈New Formative〉는 이 질문에서 출발해, 완성된 결과가 아닌 형성의 과정에 주목했습니다. 꾸준한 시도와 점진적인 움직임이야말로 진정한 새로움을 만드는 태도라 믿으며, 그 안의 가능성과 방향을 함께 나누고자 합니다.'
        }
      />
      <Image src='' alt='behind formative2' />

      <Divide title='Concept' number='02' />
      <TitleBody
        title={'Movement \nAs a System'}
        text={
          '점진적이고 멈추지 않는 우리의 움직임은 각기 다른 궤적으로 남아 시각화됩니다. 자신만의 방향을 탐색하며 꾸준히 움직이는 에너지는 끊임없이 나아갑니다.'
        }
      />
      <Image src='' alt='movement1' />
      <MidBody content='움직임은 경계를 확장하고, 변화시키며 조금씩 새로운 형태를 만들어냅니다.' />
      <Image src='' alt='movement2' />
      <SolutionSentence text={'Steady Movement \nFor Progress'} />
      <Image src='' alt='movement3' />

      <Divide title='Archive' number='03' />
      <TitleBody
        title={'Archive \nMovement'}
        text='전시 준비 과정에서 움직임의 궤적을 놓치지 않기 위해, 형성의 과정에서 만들어진 사진과 영상을 아카이빙합니다. 수많은 시도와 탐색의 과정은 물론, 멈칫하거나 전환되는 순간의 과정까지 움직임의 일부로 포착합니다.'
      />
      <Image src='' alt='archive1' />

      <Divide title='Identities' number='04' />
      <SolutionSentence text={'Various Identities \nFrom Various Movements.'} />
      <MidBody content='전시장에서는 9개의 팀과 개인들이 각자의 리듬과 방식으로 걸어온 형성의 과정들이 펼쳐집니다. 저마다의 궤적을 통해 새로운 방향을 실험하고, 그 움직임을 시각화합니다.' />
      <Image src='' />
      <SolutionSentence text='Welcome to New Formative!' />
      <TitleBody
        title={'New Formative \nBegins Here'}
        text='2025 MEP 〈New Formative〉 전시 공간에서는 여러분의 감각과 해석으로 완성되어 가는 여정을 경험할 수 있습니다. 형성이라는 태도가 우리의 사고와 감각으로 어떻게 확장될 수 있는지 이곳에서 함께 포착해보세요.'
      />
      <Image src='' alt='new formative1' />
      <MidBody content={'삼성디자인멤버십 회원들의 비전과 태도를 드러내는 ‘New Step’을 시작으로, 다양한 분야가 교차하며 새로운 가능성을 모색하는 ‘New Link’, 각자의 고유한 문제의식을 바탕으로 전개된 ‘New Focus’, 마지막으로 감각적 실험이 응집된 ‘New Spark’순으로 이어집니다.'} />
      <Image src='' alt='new formative2' />
      <Image src='' alt='new formative3' />
      <Image src='' alt='new formative4' />
      <SolutionSentence type='section' text='Web Exhibition' />
      <Image src='' alt='web exhibition1' />
      <Image src='' alt='web exhibition2' />
      <Image src='' alt='web exhibition3' />
      <TitleBody
        title={'Make your \nMovement'}
        text={'당신을 움직이게 하는 순간은 무엇인가요?\n 웹사이트에 이미지를 등록하고, 나만의 Formative Movement를 만들어 공유해보세요.'}
      />
      {/* CTA */}
      <div
        className={classNames(
          'w-full flex justify-center items-center',
          //mobile
          'px-[4.10vw] pb-[56px]',
          //tablet
          'md:px-[5.2vw] md:pb-[56px]',
          //desktop
          'lg:px-[14.10vw] lg:pb-[84px]',
        )}
      >
        <button
          className={classNames(
            'bg-black text-white rounded-full font-medium md:hover:opacity-80 active:scale-95 transition-all duration-300',
            //mobile
            'px-[20px] py-[6px] w-[210px] h-[56px] text-[17px] tracking-[-0.34px] leading-[1.3]',
            //tablet
            'md:px-[20px] md:py-[6px] md:w-[210px] md:h-[56px] md:text-[17px] md:tracking-[-0.34px]',
            //desktop
            'lg:px-[34.2px] lg:py-0 lg:w-fit lg:h-[68px] lg:text-[18px] lg:tracking-[-0.36px]  ',
          )}
        >
          Movement 만들러 가기
        </button>
      </div>
      <Image src='' />
      <SolutionSentence type='section' text='More Details' />
      <Image src='' alt='detail1' />
      <Image src='' alt='detail2' />
      <Image src='' alt='detail3' />
      <Image src='' alt='detail4' />
      <Image src='' alt='detail5' />
      <Image src='' alt='detail6' />
      <Image src='' alt='detail7' />

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
      <Footer />
    </>
  )
}




