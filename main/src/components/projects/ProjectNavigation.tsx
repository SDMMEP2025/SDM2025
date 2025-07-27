'use client'

interface Project {
  id: string
  title: string
  imageUrl: string
  englishName: string
  koreanName: string
}

interface ProjectNavigationProps {
  projects?: Project[]
  onProjectClick?: (project: Project) => void
}

export function ProjectNavigation({
  projects = [
    {
      id: '1',
      title: 'Project 1',
      imageUrl: '/images/previous_image.png',
      englishName: 'MEET',
      koreanName: '미트'
    },
    {
      id: '2',
      title: 'Project 2',
      imageUrl: '/images/next_image.png',
      englishName: 'CONNECT',
      koreanName: '연결'
    }
  ],
  onProjectClick
}: ProjectNavigationProps) {
  const handleProjectClick = (project: Project) => {
    if (onProjectClick) {
      onProjectClick(project)
    }
  }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div 
        className="relative w-full aspect-[720/400] cursor-pointer group" 
        onClick={() => handleProjectClick(projects[0])}
      >
        <img 
          className="object-cover w-full h-full"
          src={projects[0]?.imageUrl}
          alt={projects[0]?.title}
        />
        {/* Hover overlay */}
        <div className="w-full h-full left-0 top-0 absolute bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
          <div className="w-20 flex-col justify-center items-center hidden lg:flex">
            <div className="text-center justify-start text-white text-3xl font-bold leading-10">
              {projects[0]?.englishName}
            </div>
            <div className="text-center justify-start text-white text-lg font-bold leading-relaxed">
              {projects[0]?.koreanName}
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="relative w-full aspect-[720/400] cursor-pointer group" 
        onClick={() => handleProjectClick(projects[1])}
      >
        <img 
          className="object-cover w-full h-full"
          src={projects[1]?.imageUrl}
          alt={projects[1]?.title}
        />
        {/* Hover overlay */}
        <div className="w-full h-full left-0 top-0 absolute bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
          <div className="w-20 flex-col justify-center items-center hidden lg:flex">
            <div className="text-center justify-start text-white text-3xl font-bold leading-10">
              {projects[1]?.englishName}
            </div>
            <div className="text-center justify-start text-white text-lg font-bold leading-relaxed">
              {projects[1]?.koreanName}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}