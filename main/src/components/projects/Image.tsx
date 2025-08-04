'use client'

interface ImageProps {
  Image?: string
  altText?: string
}

export function Image({ 
  Image = '/placeholder-image.jpg', 
  altText = "Main Image" 
}: ImageProps) {
  return (
    <div className='w-full relative bg-gray-400 flex justify-center items-center'>
      <img 
        src={Image}
        alt={altText}
        className='w-full h-auto max-w-full'
      />
    </div>
  )
}