import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import { getFavoriteIds } from '../lib/favorites'

const Favorite = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/movies')
        const data = await response.json()
        if (data.success) {
          const favoriteIds = getFavoriteIds()
          const filtered = data.movies.filter((movie) => favoriteIds.includes(movie._id))
          setMovies(filtered)
        } else {
          setMovies([])
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
        setMovies([])
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  if (loading) return <Loading />

  return movies.length > 0 ?  (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44
     overflow-hidden min-h-[80vh]'>

      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className='text-lg font-medium my-4'>Your Favorite Movies</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {movies.map((movie)=> (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex felx-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No favorite movies yet</h1>
    </div>
  )
}

export default Favorite
