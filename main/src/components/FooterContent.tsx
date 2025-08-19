export function FooterContent() {
  return (
    <>
      <div className='flex text-sm text-white mb-6 md:mb-0 text-center font-normal capitalize leading-normal md:text-left'>
        © 2025 Samsung Design Membership<span className='md:hidden'>.</span>
        <br className='md:hidden' />
        <span className='hidden md:inline'> </span>
        <span className="md:block md-landscape-coming:block lg:hidden">All rights reserved</span>
      </div>

      <div className='w-fit h-6 inline-flex justify-center items-center gap-10'>
        <a href='https://www.design.samsung.com/kr/contents/sdm/' target='_blank' rel='noopener noreferrer'
           className='text-white text-sm font-medium underline uppercase text-nowrap leading-tight hover:opacity-80 transition-opacity'>
          Official Page
        </a>
        <a href='https://www.instagram.com/samsungdesignmembership/' target='_blank' rel='noopener noreferrer'
           className='text-white text-sm font-medium underline uppercase leading-tight hover:opacity-80 transition-opacity'>
          Instagram
        </a>
        <a href='https://www.behance.net/Samsung_Design_Mem' target='_blank' rel='noopener noreferrer'
           className='text-white text-sm font-medium underline uppercase leading-tight hover:opacity-80 transition-opacity'>
          Behance
        </a>
      </div>
    </>
  )
}
