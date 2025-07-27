'use client'

export function MainImage() {
  return (
    <div className='w-full aspect-[390/365] xs:aspect-[390/365] md:aspect-[768/720] lg:aspect-[1440/1350] relative bg-gray-400 flex justify-center items-center'>
      {/* 모바일 이미지 (0~389px, 390~767px) */}
      <img 
        src="/mo_main_image.jpg" 
        alt="Main Image"
        className='w-full h-full object-cover md:hidden'
      />
      
      {/* 태블릿 이미지 (768~1439px) */}
      <img 
        src="/tab_main_image.jpg" 
        alt="Main Image"
        className='w-full h-full object-cover hidden md:block lg:hidden'
      />
      
      {/* PC 이미지 (1440px+) */}
      <img 
        src="/pc_main_image.jpg" 
        alt="Main Image"
        className='w-full h-full object-cover hidden lg:block'
      />
    </div>
  )
}