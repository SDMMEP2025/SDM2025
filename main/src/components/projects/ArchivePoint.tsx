interface ArchivePointProps {
  point: {
    id: string
    top: string
    left: string
    images: string[]
  }
  setOpenSidebar: (point: ArchivePointProps['point']) => void
}

export function ArchivePoint({ point, setOpenSidebar, className = '' }: { className?: string } & ArchivePointProps) {
  return (
    <div
      className={`w-6 h-6 z-10 absolute bg-white rounded-full cursor-pointer hover:opacity-70 active:scale-105 transition-all duration-300 ease-in-out ${className}`}
      style={{ top: point.top, left: point.left }}
      onClick={() => setOpenSidebar(point)}
    ></div>
  )
}
