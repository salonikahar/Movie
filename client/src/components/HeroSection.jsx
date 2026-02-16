import React, { useEffect, useMemo, useState } from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ChevronLeft, ChevronRight, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { resolveMovieImageUrl } from '../lib/imageUrl'

const DEFAULT_HERO_BANNER = 'https://image.tmdb.org/t/p/original/1p5aI299YBnqrEEvVGJERk2MXXb.jpg'

const FALLBACK_MOVIE = {
  title: 'Now Showing',
  overview:
    'Browse the newest releases and book the best seats in seconds.',
  release_date: '2018-01-01',
  runtime: 128,
  genres: [{ name: 'Action' }, { name: 'Adventure' }, { name: 'Sci-Fi' }]
}

const HeroSection = ({ movies = [] }) => {

  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)

  const sliderMovies = useMemo(() => {
    if (movies.length > 0) return movies.slice(0, 3)
    return [FALLBACK_MOVIE]
  }, [movies])

  useEffect(() => {
    setCurrentIndex(0)
  }, [sliderMovies.length])

  useEffect(() => {
    if (sliderMovies.length <= 1) return undefined
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderMovies.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [sliderMovies.length])

  const movie = sliderMovies[currentIndex] || FALLBACK_MOVIE
  const heroBackground =
    resolveMovieImageUrl(movie?.backdrop_path, 'original') ||
    resolveMovieImageUrl(movie?.poster_path, 'original') ||
    DEFAULT_HERO_BANNER
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
      min-h-[82vh] pt-28 pb-16 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBackground})`, backgroundPosition: 'center top' }}
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
          <button
            onClick={() => navigate(movie?._id ? `/movies/${movie._id}` : '/movies')}
            className='flex items-center gap-1 px-6 py-3 text-sm bg-primary 
          hover:bg-primary-dull transition rounded-md text-white font-semibold cursor-pointer'>
              Book Tickets
              <ArrowRight className='w-5 h-5' />
          </button>
          <button onClick={() => navigate('/movies')} className='px-6 py-3 text-sm border border-white/40 text-white rounded-md hover:bg-white/10 transition'>
            Explore Movies
          </button>
        </div>
      </div>
      {sliderMovies.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + sliderMovies.length) % sliderMovies.length)
            }
            className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/35 border border-white/25 text-white flex items-center justify-center hover:bg-black/55 transition'
            aria-label='Previous slide'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % sliderMovies.length)}
            className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/35 border border-white/25 text-white flex items-center justify-center hover:bg-black/55 transition'
            aria-label='Next slide'
          >
            <ChevronRight className='w-5 h-5' />
          </button>
          <div className='absolute z-10 bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2'>
            {sliderMovies.map((item, index) => (
              <button
                key={item._id || index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  currentIndex === index ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default HeroSection
