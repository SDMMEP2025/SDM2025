'use client'

interface MediaContainerProps {
  type?: 'image' | 'video'
  src?: string
  alt?: string
}

export function MediaContainer({ type = 'image', src, alt = 'Media content' }: MediaContainerProps) {
  return (
    <div className="w-screen h-screen bg-zinc-600 overflow-hidden">
      {/* 실제 미디어가 있을 때 */}
      {src && (
        <>
          {type === 'image' ? (
            <img 
              src={src} 
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full relative overflow-hidden">
              <iframe
                src={`${src}?background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&muted=1`}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  width: '177.78vh', 
                  height: '100vh',
                  minWidth: '100vw',
                  minHeight: '56.25vw' 
                }}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={alt}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}