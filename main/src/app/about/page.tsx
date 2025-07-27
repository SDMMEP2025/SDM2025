'use client'
import { Header, Footer, MainImage, Divide, MidBody, CreditThanksTo } from '@/components/projects'
import { HeaderBody, Credit, SolutionSentence, TitleBody, Image } from '@/components/about'

export default function AboutPage() {
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

  return (
    <>
      <Header />
      <MainImage />
      <HeaderBody
        title={['We don’t Follow tracks.', 'We form them.']}
        description='2025 MEP 《New Formative》는 완성된 형태보다 ‘형성되어가는 과정’에 주목하며, 디자이너가 각자의 감각과 질문을 따라 자신만의 트랙을 개척해나가는 여정을 담은 전시입니다.'
      />
      <TitleBody
        title='What is New Formative?'
        text='우리는 주어진 길을 따르기보다, 낯선 질문과 실험을 통해 새로운 방향성과 정체성의 궤적을 만들어갑니다. 2025 MEP 전시 《New Formative》는 이러한 능동적이고 탐색적인 실천의 흐름이 서로 교차하고 확장되며 새로운 미래의 풍경을 만들어가는 과정을 보여주고자 합니다.'
      />
      <Image src='' />
      <Divide title='Problems' number='01' />
      <TitleBody
        title='Value of Formative'
        text="AI, 기후 위기, 정체성의 다원화, 불확실한 미래 등 복합적인 현안 앞에서, 고정된 기준이나 기존의 해법은 더 이상 유효하지 않습니다. 빠르게 진화하는 AI 기술이 정체성과 창작의 경계를 흐리고, 기후 변화가 미래의 삶의 방식 자체를 새롭게 설계하도록 요구하며, 성별, 국적, 정체성을 둘러싼 정의들이 다양해지고 유동적이 되는 등, 우리는 기존의 '하나의 해석', '하나의 길'로는 더 이상 설명할 수 없는 세계가 되었기 때문입니다."
      />
      <Image src='' />
      <Divide title='Solutions' number='01' />
      <MidBody content='이러한 복합적 변화 속에서, 우리는 완성된 해답이 아닌, 감각적이고 유연한 형성(Formative)의 과정을 하나의 해법으로 제안합니다.' />
      <Image src='' />
      <Divide title='System' number='01' />
      <TitleBody
        title='Track As A System'
        text='우리가 제안하는 트랙은 세 가지 다른 방식의 시선과 실천을 담고 있습니다. 선을 따르는 것에서, 틈을 만들고, 공간을 수놓는 것까지 말이죠. 이는 고정된 길이 아니라, 형성되는 과정 자체를 구조화한 시스템입니다.'
      />
      <Image src='' />
      <SolutionSentence text='Solution sentence' />
      <Image src='' />
      <Divide title='Archive' number='01' />
      <TitleBody
        title='Processual Track'
        text='9개의 팀들이 자신만의 것들을 새롭게 형성해나가는 과정은 우리가 가시화한 트랙 속에 고스란히 녹아있죠. 개별 팀프로젝트 뿐 아니라 전시 공간에서도 우리의 과정이 녹아든 트랙을 확인해보세요!'
      />
      <Image src='' />
      <Image src='' />
      <SolutionSentence
        text='We captured the tracks of nine teams, 
            each shaping their own sense of newness.'
      />
      <MainImage />
      <MidBody content='우리는 이처럼 각자의 속도로, 각자만의 방식으로 길을 형성하며 미래를 그려나가고 있습니다. 이처럼 미래를 유동적으로 그려나가는 흐름의 단면을 이제, 공간 속에서 마주해보세요.' />
      <Divide title='9Teams' number='01' />
      <SolutionSentence text='Welcome to the living field of Newformative!' />
      <Image src='' />
      <TitleBody
        title='Get your Insights from New Formative'
        text='이 전시는 관람자에게 결과를 소비하는 감상이 아닌, 과정을 감각하고 해석하는 실천적 경험을 제안합니다. 각 팀이 형성한 트랙을 따라가며 우리는 정답이 아닌 질문과 마주하고, 익숙한 언어 대신 새로운 표현 방식을 탐색하게 됩니다.
        이 전시를 관람하시는 여러분들도, 단순한 관찰자가 아니라 나아가 각자의 시선과 속도로 이 여정을 완성해가는 주체로 자리하며, ‘형성’이라는 태도가 어떻게 사고와 감각, 삶의 방식으로 확장될 수 있는지를 경험해보시길 바랍니다.'
      />
      <Image src='' />
      <HeaderBody
        title={'Sentence'}
        description='2025 MEP 《New Formative》는 완성된 형태보다 ‘형성되어가는 과정’에 주목하며, 디자이너가 각자의 감각과 질문을 따라 자신만의 트랙을 개척해나가는 여정을 담은 전시입니다.'
      />
      <Image src='' />
      <MidBody content='〈New Formative〉 전시는 정해진 해답을 찾기보다는, 형성 중인 질문과 실험의 과정을 따라가는 여정입니다. 전시는 집단의 비전과 태도를 드러내는 New Step을 시작으로, 다양한 분야가 교차하며 새로운 가능성을 모색하는 New Link, 각자의 고유한 문제의식을 바탕으로 전개된 New Focus, 마지막으로 감각적 실험이 응집된 New Crac 순으로 이어집니다. ' />
      <Image src='' />
      <Image src='' />
      <Image src='' />
      <Image src='' />
      <Image src='' />
      <TitleBody
        title='Make your Track'
        text='우리가 만들어간 트랙 시스템을 활용하여, 관람객분들도 직접 트랙을 만들어볼 수 있는 작은 창구를 마련했습니다. 직접 자신만의 길을 만들고 또 공유해보세요!'
      />
      <Image src='' />
      <Image src='' />
      <Image src='' />
      <Image src='' />
      <Image src='' />
      <Image src='' />
      <Image src='' />
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
