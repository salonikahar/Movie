import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'

const Movies = () => {

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('now')

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const moviesPerPage = 8

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies')
        const data = await response.json()

        if (data.success) {
          setMovies(data.movies)
        } else {
          setMovies(dummyShowsData)
        }
      } catch (error) {
        console.error('Error fetching movies:', error)
        setMovies(dummyShowsData)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  // ✅ Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  if (loading) return <Loading />

  const today = new Date()

  const filteredMovies = movies.filter((movie) => {
    const releaseDate = new Date(movie.release_date)
    if (Number.isNaN(releaseDate.getTime())) return false
    if (movie.isActive === false) return false
    return filter === 'upcoming'
      ? releaseDate >= today
      : releaseDate < today
  })

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage)
  const indexOfLastMovie = currentPage * moviesPerPage
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  )

  return filteredMovies.length > 0 ? (

    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44
     overflow-hidden min-h-[80vh]'>

      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-4'>
        <h1 className='text-lg font-medium'>Movies</h1>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => setFilter('now')}
            className={`px-4 py-2 rounded-full text-sm transition
              ${filter === 'now'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-300'}`}
          >
            Now Showing
          </button>

          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-full text-sm transition
              ${filter === 'upcoming'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-300'}`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {currentMovies.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12 gap-2 flex-wrap">

        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-40"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded
              ${currentPage === index + 1
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-40"
        >
          Next
        </button>

      </div>

    </div>

  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>
        No movies available
      </h1>
    </div>
  )
}

export default Movies
