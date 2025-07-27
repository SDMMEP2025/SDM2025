'use client'

interface ImageProps {
  src: string
  alt?: string
  className?: string
}

export function Image({ src, alt = 'Image', className = '' }: ImageProps) {
  if (!src) {
    return (
      <div className={`w-full aspect-[16/9] relative bg-zinc-600 overflow-hidden flex items-center justify-center ${className}`}>
      </div>
    )
  }

  return (
    <div className={`w-full aspect-[16/9] relative bg-zinc-600 overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  )
}