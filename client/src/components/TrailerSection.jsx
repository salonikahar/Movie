import React, { useEffect, useMemo, useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon } from 'lucide-react'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w780'

const resolveImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${IMAGE_BASE_URL}${path}`
}

const TRAILER_MAP = {
  movie_001: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
  movie_002: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
  movie_003: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
  movie_004: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  movie_005: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
  movie_006: 'https://www.youtube.com/watch?v=8g18jFHCLXk',
  movie_007: 'https://www.youtube.com/watch?v=giXco2jaZ_4',
  movie_008: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
  movie_009: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
  movie_010: 'https://www.youtube.com/watch?v=EXeTwQWrcwY'
}

const TrailerSection = ({ movies = [] }) => {
  const trailerList = useMemo(() => {
    const fromMovies = movies
      .map((movie) => ({
        title: movie.title,
        image: resolveImageUrl(movie.backdrop_path) || resolveImageUrl(movie.poster_path),
        videoUrl: movie.trailerUrl || TRAILER_MAP[movie._id]
      }))
      .filter((item) => item.videoUrl && item.image)

    if (fromMovies.length > 0) return fromMovies.slice(0, 8)
    return dummyTrailers
  }, [movies])

  const [currentTrailer, setCurrentTrailer] = useState(trailerList[0] || dummyTrailers[0])

  useEffect(() => {
    if (trailerList.length > 0) {
      setCurrentTrailer(trailerList[0])
    }
  }, [trailerList])

  const handleSelect = (trailer) => {
    setCurrentTrailer(trailer)
    window.scrollTo(0, 0)
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
      <p className='text-slate-800 font-semibold text-xl max-w-[960px] mx-auto bms-section-title'>Trailers</p>

      <div className='relative mt-6'>
        <BlurCircle top='-100px' right='-100px' />
        <ReactPlayer 
          url={currentTrailer.videoUrl} 
          controls={true} 
          playing={true}
          className="mx-auto max-w-full"
          width="960px"
          height="540px"
        /> 
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-4xl mx-auto'>
        {trailerList.map((trailer) => (
          <div 
            key={trailer.image}
            className='relative hover:-translate-y-1 duration-300 transition 
            max-md:h-60 md:h-60 cursor-pointer'
            onClick={() => handleSelect(trailer)}
          >
            <img 
              src={trailer.image}
              alt="trailer" 
              className='rounded-2xl w-full h-full object-cover brightness-90 shadow-sm'
            />
            <PlayCircleIcon strokeWidth={1.6} className="absolute top-1/2 left-1/2 
              w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrailerSection
