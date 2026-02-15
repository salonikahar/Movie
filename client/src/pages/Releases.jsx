import React, { useEffect, useMemo, useState } from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'

const Releases = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('upcoming')

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies')
        const data = await response.json()
        if (data.success) setMovies(data.movies || [])
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const filteredMovies = useMemo(() => {
    const today = new Date()
    return movies.filter((movie) => {
      const releaseDate = new Date(movie.release_date)
      if (Number.isNaN(releaseDate.getTime())) return false
      return filter === 'upcoming' ? releaseDate >= today : releaseDate < today
    })
  }, [movies, filter])

  const sortedMovies = useMemo(() => {
    return [...filteredMovies].sort(
      (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    )
  }, [filteredMovies])

  if (loading) return <Loading />

  return (
    <div className='relative pt-32 pb-24 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <h1 className='text-2xl font-semibold text-slate-900'>Releases</h1>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-full text-sm transition border ${
              filter === 'upcoming' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-slate-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('released')}
            className={`px-4 py-2 rounded-full text-sm transition border ${
              filter === 'released' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-slate-900'
            }`}
          >
            Released
          </button>
        </div>
      </div>

      {sortedMovies.length > 0 ? (
        <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
          {sortedMovies.map((movie) => (
            <MovieCard movie={movie} key={movie._id} />
          ))}
        </div>
      ) : (
        <div className='mt-16 text-center text-slate-500'>No movies found for this filter.</div>
      )}
    </div>
  )
}

export default Releases
