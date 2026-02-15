import React, { useEffect, useMemo, useState } from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailerSection from '../components/TrailerSection'
import Loading from '../components/Loading'
import MovieCard from '../components/MovieCard'

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

  const topRated = useMemo(() => {
    return [...movies].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 10)
  }, [movies])

  const upcomingMovies = useMemo(() => {
    const today = new Date()
    return movies
      .filter((movie) => new Date(movie.release_date) >= today)
      .sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())
      .slice(0, 10)
  }, [movies])

  return (
    <>
      <HeroSection movie={heroMovie} />
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="px-6 md:px-16 lg:px-24 xl:px-44 mt-10">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Discover</p>
                <h2 className="text-2xl font-semibold text-slate-900 mt-2">
                  Movie nights, planned in seconds.
                </h2>
                <p className="text-slate-500 mt-2 max-w-xl">
                  Browse trending titles, reserve seats instantly, and keep track of upcoming releases.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Action', 'Comedy', 'Drama', 'Family', 'Thriller', 'Sci-Fi'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedGenre(tag)}
                    className={`px-4 py-2 rounded-full text-sm border ${
                      selectedGenre === tag
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

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

          <div className="px-6 md:px-16 lg:px-24 xl:px-44 mt-16">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Top Rated</h2>
              <button
                onClick={() => {
                  setSortBy('top')
                  window.scrollTo(0, 0)
                }}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                View all
              </button>
            </div>
            <div className="mt-6 overflow-x-auto no-scrollbar">
              <div className="flex gap-6 w-max pb-2">
                {topRated.map((movie) => (
                  <div key={movie._id} className="w-60">
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 md:px-16 lg:px-24 xl:px-44 mt-16">
            <div className="rounded-2xl bg-gradient-to-r from-[#1f2937] via-[#111827] to-[#0f172a] p-8 text-white shadow-sm">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Premieres</p>
                  <h2 className="text-2xl font-semibold mt-2">Weekend Premieres You Can't Miss</h2>
                  <p className="text-white/70 mt-2 max-w-xl">
                    Curated picks with big screen energy. Reserve early to get the best seats.
                  </p>
                </div>
                <button className="px-6 py-3 rounded-md bg-primary hover:bg-primary-dull text-white text-sm font-semibold">
                  Explore Premieres
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-16 lg:px-24 xl:px-44 mt-16">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Coming Soon</h2>
              <button
                onClick={() => {
                  setSortBy('newest')
                  window.scrollTo(0, 0)
                }}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                View all
              </button>
            </div>
            <div className="mt-6 overflow-x-auto no-scrollbar">
              <div className="flex gap-6 w-max pb-2">
                {upcomingMovies.map((movie) => (
                  <div key={movie._id} className="w-60">
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <TrailerSection movies={movies} />
    </>
  )
}

export default Home
