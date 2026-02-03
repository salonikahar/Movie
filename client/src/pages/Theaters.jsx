import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'

const Theaters = () => {
  const navigate = useNavigate()
  const [selectedTheater, setSelectedTheater] = useState(null)
  const [theaters, setTheaters] = useState([])
  const [movies, setMovies] = useState([])
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

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
    navigate(`/movies/${movieId}`)
  }

  const getMoviesForTheater = (theaterId) => {
    const theaterShows = shows.filter(show => show.theater === theaterId)
    const movieIds = [...new Set(theaterShows.map(show => (typeof show.movie === 'string' ? show.movie : show.movie?._id)))]
    return movies.filter(movie => movieIds.includes(movie._id))
  }

  if (loading) {
    return <Loading />
  }

  if (theaters.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-3xl font-bold text-center'>No theaters available</h1>
      </div>
    )
  }

  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className='text-lg font-medium my-4'>Our Theaters</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {theaters.map((theater) => (
          <div
            key={theater._id}
            onClick={() => handleTheaterClick(theater)}
            className={`bg-primary/10 border border-primary/20 rounded-lg p-6 transition cursor-pointer ${
              selectedTheater?._id === theater._id ? 'ring-2 ring-primary' : 'hover:bg-primary/20'
            }`}
          >
            <h3 className='text-xl font-semibold mb-2'>{theater.name}</h3>
            <p className='text-gray-400 text-sm mb-2'>{theater.location}</p>
            <p className='text-gray-400 text-sm mb-4'>{theater.screens} screens</p>
            <div className='flex flex-wrap gap-2'>
              {theater.facilities.map((facility, index) => (
                <span key={index} className='text-xs bg-primary/20 px-3 py-1 rounded-full'>
                  {facility}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTheater && (
        <div className='mt-20'>
          <h2 className='text-lg font-medium mb-8'>Movies at {selectedTheater.name}</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {getMoviesForTheater(selectedTheater._id).map((movie) => (
              <div
                key={movie._id}
                onClick={() => handleMovieClick(movie._id)}
                className='cursor-pointer'
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          <div className='flex justify-center mt-10'>
            <button
              onClick={() => navigate('/movies')}
              className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
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
