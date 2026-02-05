import React, { useEffect, useMemo, useState } from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailerSection from '../components/TrailerSection'
import Loading from '../components/Loading'

const Home = () => {
  const [movies, setMovies] = useState([])
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('top')
  const [selectedGenre, setSelectedGenre] = useState('all')

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [moviesRes, showsRes] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/shows')
        ])

        const moviesData = await moviesRes.json()
        const showsData = await showsRes.json()

        if (moviesData.success) setMovies(moviesData.movies || [])
        if (showsData.success) setShows(showsData.shows || [])
      } catch (error) {
        console.error('Error loading home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const genres = useMemo(() => {
    const all = movies.flatMap((movie) =>
      (movie.genres || []).map((genre) => (typeof genre === 'string' ? genre : genre?.name))
    )
    return Array.from(new Set(all.filter(Boolean))).sort()
  }, [movies])

  const moviesWithShows = useMemo(() => {
    if (!shows.length) return movies
    const movieIdsWithShows = new Set(
      shows
        .map((show) => (typeof show.movie === 'string' ? show.movie : show.movie?._id))
        .filter(Boolean)
    )
    return movies.filter((movie) => movieIdsWithShows.has(movie._id))
  }, [movies, shows])

  const filteredMovies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return moviesWithShows.filter((movie) => {
      const titleMatch = movie.title?.toLowerCase().includes(query)
      const genreMatch = (movie.genres || []).some((genre) => {
        const name = typeof genre === 'string' ? genre : genre?.name
        return name?.toLowerCase().includes(query)
      })
      const matchesQuery = !query || titleMatch || genreMatch
      const matchesGenre =
        selectedGenre === 'all' ||
        (movie.genres || []).some((genre) => {
          const name = typeof genre === 'string' ? genre : genre?.name
          return name === selectedGenre
        })

      return matchesQuery && matchesGenre
    })
  }, [moviesWithShows, searchQuery, selectedGenre])

  const sortedMovies = useMemo(() => {
    const list = [...filteredMovies]
    if (sortBy === 'newest') {
      return list.sort(
        (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      )
    }
    return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
  }, [filteredMovies, sortBy])

  const heroMovie = sortedMovies[0] || movies[0]

  return (
    <>
      <HeroSection movie={heroMovie} />
      {loading ? (
        <Loading />
      ) : (
        <FeaturedSection
          movies={sortedMovies}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />
      )}
      <TrailerSection />
    </>
  )
}

export default Home
