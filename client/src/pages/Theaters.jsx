import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import { MOVIE_POSTER_PLACEHOLDER, resolveMovieImageUrl } from '../lib/imageUrl'

const Theaters = () => {
  const navigate = useNavigate()
  const [selectedTheater, setSelectedTheater] = useState(null)
  const [theaters, setTheaters] = useState([])
  const [movies, setMovies] = useState([])
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('Mumbai')

  useEffect(() => {
    const storedCity = localStorage.getItem('selectedCity')
    if (storedCity) setSelectedCity(storedCity)
    const handleStorage = () => {
      const nextCity = localStorage.getItem('selectedCity')
      if (nextCity) setSelectedCity(nextCity)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [theaterRes, movieRes, showRes] = await Promise.all([
          fetch('/api/theaters'),
          fetch('/api/movies'),
          fetch('/api/shows')
        ])

        const theaterData = await theaterRes.json()
        const movieData = await movieRes.json()
        const showData = await showRes.json()

        if (!theaterData.success || !movieData.success || !showData.success) {
          throw new Error('Failed to load theater information')
        }

        setTheaters(theaterData.theaters)
        setMovies(movieData.movies)
        setShows(showData.shows)
      } catch (error) {
        console.error(error)
        toast.error('Unable to load theaters right now')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTheaterClick = (theater) => {
    setSelectedTheater(theater)
  }

  const handleMovieClick = (movieId) => {
    if (!selectedTheater) {
      toast.error('Please select a theater first')
      return
    }

    navigate(`/movies/${movieId}/theater`, {
      state: {
        preselectedTheaterId: selectedTheater._id,
        selectedCity
      }
    })
  }

  const getMoviesForTheater = (theaterId) => {
    const theaterShows = shows.filter((show) => {
      const showTheaterId = typeof show.theater === 'string' ? show.theater : show.theater?._id
      return showTheaterId === theaterId
    })
    const movieIds = [...new Set(theaterShows.map(show => (typeof show.movie === 'string' ? show.movie : show.movie?._id)))]
    return movies.filter(movie => movieIds.includes(movie._id))
  }

  const cityTheaters = theaters.filter(theater => theater.city === selectedCity)
  const moviesForSelectedTheater = useMemo(() => {
    if (!selectedTheater) return []
    return getMoviesForTheater(selectedTheater._id)
  }, [selectedTheater, shows, movies])

  useEffect(() => {
    if (selectedTheater && selectedTheater.city !== selectedCity) {
      setSelectedTheater(null)
    }
  }, [selectedCity, selectedTheater])

  if (loading) {
    return <Loading />
  }

  if (theaters.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-3xl font-bold text-center text-slate-900'>No theaters available</h1>
      </div>
    )
  }

  return (
    <div className='relative pt-32 pb-24 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className='text-2xl font-semibold my-4 text-slate-900'>Theaters in {selectedCity}</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {cityTheaters.length > 0 ? cityTheaters.map((theater) => (
            <div
              key={theater._id}
              onClick={() => handleTheaterClick(theater)}
              className={`bg-white border border-slate-200 rounded-2xl p-6 transition cursor-pointer shadow-sm ${
                selectedTheater?._id === theater._id ? 'ring-2 ring-primary' : 'hover:border-primary/40'
              }`}
            >
              <h3 className='text-xl font-semibold mb-2'>{theater.name}</h3>
              <p className='text-slate-500 text-sm mb-2'>{theater.location}</p>
              <p className='text-slate-500 text-sm mb-4'>{theater.screens} screens</p>
              <div className='flex flex-wrap gap-2'>
                {theater.facilities.map((facility, index) => (
                  <span key={index} className='text-xs bg-primary/10 text-primary px-3 py-1 rounded-full'>
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )) : (
            <div className='col-span-full text-center text-slate-500 py-12'>
              No theaters available in {selectedCity}.
            </div>
          )}
      </div>

      {selectedTheater && (
        <div className='mt-20'>
          <h2 className='text-lg font-semibold mb-2 text-slate-900'>Step 2: Select Movie at {selectedTheater.name}</h2>
          <p className='text-sm text-slate-500 mb-8'>After movie selection, you will choose show date and time.</p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {moviesForSelectedTheater.length === 0 && (
              <p className='col-span-full text-slate-500'>No movies available for this theater right now.</p>
            )}
            {moviesForSelectedTheater.map((movie) => (
              <div
                key={movie._id}
                onClick={() => handleMovieClick(movie._id)}
                className='cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-primary/40 transition'
              >
                <img
                  src={resolveMovieImageUrl(movie.poster_path) || MOVIE_POSTER_PLACEHOLDER}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = MOVIE_POSTER_PLACEHOLDER
                  }}
                  alt={movie.title}
                  className='w-full h-72 object-cover'
                />
                <div className='p-4'>
                  <p className='font-semibold text-slate-900 truncate'>{movie.title}</p>
                  <p className='text-sm text-slate-500 mt-1'>
                    {new Date(movie.release_date).getFullYear()} | {(movie.genres || [])
                      .slice(0, 2)
                      .map((genre) => (typeof genre === 'string' ? genre : genre?.name))
                      .filter(Boolean)
                      .join(' | ')}
                  </p>
                  <button className='mt-4 px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dull transition'>
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-center mt-10'>
            <button
              onClick={() => navigate('/movies')}
              className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md text-white font-semibold cursor-pointer'
            >
              View All Movies
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Theaters
