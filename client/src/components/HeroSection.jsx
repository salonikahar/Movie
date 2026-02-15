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
    <section
      className="relative isolate flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 
      min-h-[82vh] pt-28 pb-16 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-slate-900/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      <div className="relative z-10 max-w-2xl">
        <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mb-4" />
        <h1 className="text-5xl md:text-[68px] md:leading-[1.1] font-semibold text-white">
          {titleLineOne}
          {titleLineTwo ? (
            <>
              <br /> {titleLineTwo}
            </>
          ) : null}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-slate-200 mt-4 text-sm">
          <span className="px-3 py-1 text-xs uppercase tracking-wide text-slate-200 bg-white/10 border border-white/20 rounded-full">Now Showing</span>
          <span>{heroGenres.length ? heroGenres.slice(0, 3).join(' | ') : 'Action | Adventure | Sci-Fi'}</span>
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" /> {heroYear}
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" /> {heroRuntime}
          </div>
        </div>
        <p className='max-w-md text-slate-200 mt-4'>{heroOverview}</p>
        <div className='flex items-center gap-3 mt-6'>
          <button onClick={() => navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary 
          hover:bg-primary-dull transition rounded-md text-white font-semibold cursor-pointer'>
              Book Tickets
              <ArrowRight className='w-5 h-5' />
          </button>
          <button onClick={() => navigate('/movies')} className='px-6 py-3 text-sm border border-white/40 text-white rounded-md hover:bg-white/10 transition'>
            Explore Movies
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
