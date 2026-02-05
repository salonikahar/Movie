import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import backgroundImage from '../assets/backgroundImage.png'
import { useNavigate } from 'react-router-dom'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w1280'

const resolveImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${IMAGE_BASE_URL}${path}`
}

const HeroSection = ({ movie }) => {

  const navigate = useNavigate()
  const heroBackground = resolveImageUrl(movie?.backdrop_path) || backgroundImage
  const heroTitle = movie?.title || 'Guardian Of The Galaxy'
  const heroOverview = movie?.overview ||
    'In a post-apocalyptic world where cities ride on wheels and consume each other to survive, two people meet in London and try to stop a conspiracy.'
  const heroGenres = (movie?.genres || []).map((genre) => (typeof genre === 'string' ? genre : genre?.name)).filter(Boolean)
  const heroYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : '2018'
  const heroRuntime = movie?.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '2h 8m'
  const titleWords = heroTitle.split(' ')
  const titleLineOne = titleWords.slice(0, 2).join(' ')
  const titleLineTwo = titleWords.slice(2).join(' ')
  return (
    <div
      className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 
      h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20" />
      <h1 className="text-5xl md:text-[70px] md:leading-[1.2] font-semibold max-w-[110ch]">
        {titleLineOne}
        {titleLineTwo ? (
          <>
            <br /> {titleLineTwo}
          </>
        ) : null}
      </h1>
      <div className="flex items-center gap-4 text-gray-300">
        <span>{heroGenres.length ? heroGenres.slice(0, 3).join(' | ') : 'Action | Adventure | Sci-Fi'}</span>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-5 h-5" /> {heroYear}
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-5 h-5" /> {heroRuntime}
        </div>
      </div>
      <p className='max-w-md text-gray-300'>{heroOverview}</p>
        <button onClick={() => navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary 
        hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
            Explore Movies
            <ArrowRight className='w-5 h-5' />
        </button>
    </div>
  )
}

export default HeroSection
