'use client'

interface TeamMember {
  name: string
  role?: string
  englishName: string
  profileImage: string
  socialLinks?: {
    behance?: string
    instagram?: string
    linkedin?: string
  }
}

interface CreditProps {
  title?: string
  members: TeamMember[]
}

export function Credit({ title = 'Designed By', members }: CreditProps) {
  return (
    <div className='w-full px-4 py-14 xs:px-4 xs:py-14 md:px-[40px] md:py-[56px] lg:px-[235px] lg:py-[84px] xl:px-[240px] bg-white flex flex-col justify-start items-start gap-2.5'>
      <div className='w-full flex flex-col justify-start items-start xs:gap-[22px] md:gap-[16px] lg:gap-[24px]'>
        {/* 제목 */}
        <div className="text-neutral-800 text-base xs:text-base md:text-base lg:text-lg font-bold leading-[1.6] xs:leading-[1.6] md:leading-[1.5] lg:leading-[1.5] tracking-[-0.02em]">
          {title}
        </div>

        {/* 멤버 그리드 */}
        <div className='w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-3.5 xs:gap-x-[14px] xs:gap-y-[36px] md:gap-x-[7px] md:gap-y-[24px] lg:gap-[10px] flex-wrap'>
          {members.map((member, index) => (
            <div key={index} className='flex flex-col justify-start items-start gap-2 xs:gap-[8px] md:gap-3 lg:gap-[5px]'>
              {/* 프로필 이미지 */}
              <div className='w-full aspect-[176/240] xs:aspect-[176/240] md:aspect-[132/182] lg:aspect-[190/254] relative bg-white overflow-hidden'>
                <img src={member.profileImage} alt={`${member.name} 프로필`} className='w-full h-full object-cover' />
              </div>

              {/* 멤버 정보 */}
              <div className='w-full flex flex-col justify-start items-start gap-3'>
                {/* 이름과 역할 */}
                <div className='w-full flex flex-col justify-start items-start'>
                  <div className='w-full flex justify-start items-center gap-1.5'>
                    <div className="text-neutral-800 text-base xs:text-base md:text-base lg:text-lg font-bold leading-[1.6] xs:leading-[1.6] md:leading-[1.5] lg:leading-[1.5] tracking-[-0.02em]">
                      {member.name}
                    </div>
                    {/* role이 있을 때만 구분선과 role 표시 */}
                    {member.role && member.role.trim() !== '' && (
                      <>
                        <div className='w-0 h-3 border-l border-neutral-800' />
                        <div className="text-neutral-800 text-base xs:text-base md:text-base lg:text-lg font-bold leading-[1.6] xs:leading-[1.6] md:leading-[1.5] lg:leading-[1.5] tracking-[-0.02em]">
                          {member.role}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-full text-zinc-600 text-[16px] font-regular leading-[1.6] xs:leading-[1.6] md:leading-[1.5] lg:leading-[1.5] tracking-[-0.02em]">
                    {member.englishName}
                  </div>
                </div>

                {/* 소셜 링크 */}
                {member.socialLinks && (
                  <div className='w-full flex justify-start items-center gap-2 xs:gap-1 md:gap-1 lg:gap-1'>
                    {member.socialLinks.instagram && (
                      <a
                        href={member.socialLinks.instagram}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='xs:w-[26px] xs:h-[26px] md:w-[24px] md:h-[24px] lg:w-[30px] lg:h-[30px] bg-zinc-600 hover:bg-[#4B4F57] rounded flex items-center justify-center'
                        aria-label='Instagram'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='none'
                          className='w-full h-full'
                        >
                          <rect width='24' height='24' rx='4' fill='#4B4F57' />
                          <path
                            d='M11.762 6.48431C8.35829 6.48431 5.6001 9.24339 5.6001 12.6459C5.6001 16.0485 8.35929 18.8075 11.762 18.8075C15.1646 18.8075 17.9238 16.0485 17.9238 12.6459C17.9238 9.24339 15.1646 6.48431 11.762 6.48431ZM11.762 16.6461C9.55262 16.6461 7.76163 14.8552 7.76163 12.6459C7.76163 10.4367 9.55262 8.64576 11.762 8.64576C13.9713 8.64576 15.7623 10.4367 15.7623 12.6459C15.7623 14.8552 13.9713 16.6461 11.762 16.6461Z'
                            fill='white'
                          />
                          <path
                            d='M19.6081 6.24029C19.6081 7.03614 18.9636 7.68059 18.1677 7.68059C17.3718 7.68059 16.7274 7.03614 16.7274 6.24029C16.7274 5.44444 17.3718 4.79999 18.1677 4.79999C18.9636 4.79999 19.6081 5.44444 19.6081 6.24029Z'
                            fill='white'
                          />
                        </svg>
                      </a>
                    )}

                    {member.socialLinks.behance && (
                      <a
                        href={member.socialLinks.behance}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='xs:w-[26px] xs:h-[26px] md:w-[24px] md:h-[24px] lg:w-[30px] lg:h-[30px] bg-zinc-600 hover:bg-[#4B4F57] rounded flex items-center justify-center'
                        aria-label='Behance'
                      >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 17 13'
                            fill='none'
                            className='w-full h-full px-[4.3px] py-[5.2px]'
                          >
                          <g clipPath='url(#clip0_5_4247)'>
                            <path
                              d='M6.72061 6.03252C6.70101 6.11376 6.7324 6.11891 6.77709 6.16343C6.93209 6.31776 7.24225 6.46695 7.42316 6.65002C7.81156 7.04324 8.12405 7.6614 8.17555 8.21676C8.35214 10.1202 7.15869 11.3197 5.40571 11.7554C3.76039 12.1644 1.88316 11.9026 0.201789 11.9028L0.199463 1.23744C0.372235 1.24807 0.535704 1.18594 0.704489 1.17531C1.75358 1.10985 3.27115 1.11052 4.31974 1.17813C5.78199 1.27232 7.2989 1.92188 7.61321 3.49377C7.79362 4.39567 7.51835 5.52451 6.72061 6.03269V6.03252ZM2.40563 5.38446L4.96996 5.47018C5.574 4.94938 5.67899 3.87736 4.95833 3.39792C4.82643 3.3102 4.35064 3.11932 4.21226 3.11932H2.40546V5.38446H2.40563ZM2.40563 10.0227C3.35255 10.1149 5.65839 10.2317 5.80359 8.91715C5.86173 8.39103 5.75059 7.8365 5.24673 7.58598C5.09306 7.50956 4.46959 7.32599 4.32024 7.32599H2.40563V10.0227Z'
                              fill='white'
                            />
                            <path
                              d='M15.9969 11.5059C15.1321 12.0961 13.7675 12.1518 12.7409 12.0652C7.3914 11.6148 8.43568 2.45709 14.1742 3.72846C16.2591 4.19029 16.9204 6.44547 16.5825 8.3428C16.4526 8.55727 12.1524 8.4139 11.5741 8.45859C11.7664 10.5722 14.5551 10.3375 15.9969 9.75305V11.5059ZM14.4867 6.84051C14.5046 4.93238 11.7298 4.98255 11.5748 6.81161C11.6439 6.9362 11.6876 6.84051 11.709 6.84051H14.4867Z'
                              fill='white'
                            />
                            <path
                              d='M10.4691 0.799988H15.5389L15.6199 0.880892V2.39099L15.5389 2.47189H10.5231C10.5136 2.47189 10.3882 2.34663 10.3882 2.33699V0.880892L10.4691 0.799988Z'
                              fill='white'
                            />
                            <path
                              d='M14.4873 6.84054H11.7097C11.6882 6.84054 11.6445 6.93623 11.5754 6.81163'
                              fill='white'
                            />
                          </g>
                          <defs>
                            <clipPath id='clip0_5_4247'>
                              <rect
                                width='16.4667'
                                height='11.2976'
                                fill='white'
                                transform='translate(0.199585 0.800003)'
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    )}

                    {member.socialLinks.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='xs:w-[26px] xs:h-[26px] md:w-[24px] md:h-[24px] lg:w-[30px] lg:h-[30px] bg-zinc-600 hover:bg-[#4B4F57] rounded flex items-center justify-center'
                        aria-label='링크드인'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='none'
                          className='w-full h-full'
                        >
                          <g clipPath='url(#clip0_5_4046)'>
                            <rect x='3.45148' y='4.25142' width='16.2971' height='16.2971' fill='white' />
                            <path
                              d='M11.6001 0C4.75177 0 -0.799805 5.55157 -0.799805 12.3999C-0.799805 19.2483 4.75177 24.7999 11.6001 24.7999C18.4485 24.7999 24.0002 19.2483 24.0002 12.3999C24.0002 5.55157 18.4484 0 11.6001 0ZM8.29182 18.3947H5.5693V9.59896H8.29182V18.3947ZM6.91754 8.44715C6.02843 8.44715 5.30755 7.72048 5.30755 6.82414C5.30755 5.9278 6.02843 5.20114 6.91754 5.20114C7.80665 5.20114 8.52742 5.9278 8.52742 6.82414C8.52742 7.72048 7.80665 8.44715 6.91754 8.44715ZM18.4945 18.3947H15.7851V13.7777C15.7851 12.5114 15.3042 11.8045 14.3028 11.8045C13.213 11.8045 12.6437 12.5407 12.6437 13.7777V18.3947H10.0326V9.59896H12.6437V10.7836C12.6437 10.7836 13.4292 9.33059 15.2943 9.33059C17.1594 9.33059 18.4945 10.4694 18.4945 12.8253V18.3947Z'
                              fill='#4B4F57'
                            />
                          </g>
                          <defs>
                            <clipPath id='clip0_5_4046'>
                              <rect width='24.8' height='24.8' fill='white' transform='translate(-0.799805)' />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}