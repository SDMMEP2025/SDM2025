export function ArchiveImage({ children, src }: { children: React.ReactNode; src: string }) {
  return (
    <div className='w-full aspect-[4/3] md:aspect-[16/9] flex items-center justify-center relative '>
      {children}
      <img src={src} alt={src} className='w-full h-full object-cover' />
    </div>
  )
}
