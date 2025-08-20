'use client'

import { InViewFrame } from '../InViewFrame'

interface ImageProps {
  Image?: string | string[]
  altText?: string
}

export function Image({ Image = '/placeholder-image.jpg', altText = 'Main Image' }: ImageProps) {
  return (
    <InViewFrame className='w-full relative bg-gray-400 flex flex-col justify-center items-start'>
      {Image instanceof Array ? (
        Image.map((img, index) => (
          <img key={index} src={img} alt={`${altText} ${index + 1}`} className='w-full h-auto max-w-full' />
        ))
      ) : (
        <img src={Image} alt={altText} className='w-full h-auto max-w-full' />
      )}
    </InViewFrame>
  )
}
