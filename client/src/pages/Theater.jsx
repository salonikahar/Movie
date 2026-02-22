import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import isoTimeFormat from '../lib/isoTimeFormat'
import { MOVIE_POSTER_PLACEHOLDER, resolveMovieImageUrl } from '../lib/imageUrl'

const Theater = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [movie, setMovie] = useState(null)
  const [theaters, setTheaters] = useState([])
  const [showMap, setShowMap] = useState({})
  const [selectedTheater, setSelectedTheater] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedShow, setSelectedShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState(
    location.state?.selectedCity || localStorage.getItem('selectedCity') || 'Mumbai'
  )
  const [availableCities, setAvailableCities] = useState([])
  const preselectHandledRef = useRef(false)

  const fetchData = async () => {
    try {
      const [movieRes, showRes, theaterRes] = await Promise.all([
        fetch('/api/movies'),
        fetch('/api/shows'),
        fetch('/api/theaters')
      ])

      const movieData = await movieRes.json()
      const showData = await showRes.json()
      const theaterData = await theaterRes.json()

      if (!movieData.success || !showData.success || !theaterData.success) {
        throw new Error('Failed to load data')
      }

      const currentMovie = movieData.movies.find((m) => m._id === id)
      if (!currentMovie) {
        toast.error('Movie not found')
        return
      }

      setMovie(currentMovie)

      const now = new Date()
      const movieShows = showData.shows.filter((show) => {
        const showMovieId = typeof show.movie === 'string' ? show.movie : show.movie?._id
        if (showMovieId !== id) return false
        return new Date(show.showDateTime) >= now
      })

      const groupedByTheater = movieShows.reduce((acc, show) => {
        const theaterId = typeof show.theater === 'string' ? show.theater : show.theater?._id
        if (!theaterId) return acc
        if (!acc[theaterId]) acc[theaterId] = []
        acc[theaterId].push(show)
        return acc
      }, {})

      Object.keys(groupedByTheater).forEach((theaterId) => {
        groupedByTheater[theaterId].sort(
          (a, b) => new Date(a.showDateTime).getTime() - new Date(b.showDateTime).getTime()
        )
      })

      const cities = Array.from(
        new Set(theaterData.theaters.map((theater) => theater.city).filter(Boolean))
      ).sort()

      setShowMap(groupedByTheater)
      setAvailableCities(cities)
      setTheaters(theaterData.theaters)
    } catch (error) {
      console.error(error)
      toast.error('Unable to load showtimes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    const handleStorage = () => {
      const nextCity = localStorage.getItem('selectedCity')
      if (nextCity) setSelectedCity(nextCity)
    }

    const handleCityChanged = (event) => {
      const nextCity = event.detail?.city || localStorage.getItem('selectedCity')
      if (nextCity) setSelectedCity(nextCity)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('cityChanged', handleCityChanged)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('cityChanged', handleCityChanged)
    }
  }, [])

  useEffect(() => {
    if (!theaters.length) return

    if (!preselectHandledRef.current && location.state?.preselectedTheaterId) {
      const preselected = theaters.find((th) => th._id === location.state.preselectedTheaterId)
      if (preselected) {
        preselectHandledRef.current = true
        if (preselected.city && preselected.city !== selectedCity) {
          setSelectedCity(preselected.city)
          localStorage.setItem('selectedCity', preselected.city)
          window.dispatchEvent(new CustomEvent('cityChanged', { detail: { city: preselected.city } }))
        }
        setSelectedTheater(preselected)
        return
      }
    }

    if (selectedTheater && selectedTheater.city === selectedCity) return

    const cityTheaters = theaters.filter((theater) => theater.city === selectedCity)
    if (cityTheaters.length > 0) {
      setSelectedTheater(cityTheaters[0])
    } else {
      setSelectedTheater(null)
    }
  }, [theaters, selectedCity, location.state, selectedTheater])

  useEffect(() => {
    if (!theaters.length) return

    const availableCitySet = new Set(theaters.map((theater) => theater.city).filter(Boolean))
    if (!availableCitySet.has(selectedCity)) {
      const fallbackCity = theaters[0]?.city
      if (fallbackCity) {
        setSelectedCity(fallbackCity)
        localStorage.setItem('selectedCity', fallbackCity)
        window.dispatchEvent(new CustomEvent('cityChanged', { detail: { city: fallbackCity } }))
        toast(`Switched city to ${fallbackCity} because theaters are not available in ${selectedCity}.`)
      }
    }
  }, [theaters, selectedCity])

  useEffect(() => {
    setSelectedDate(null)
    setSelectedShow(null)
  }, [selectedTheater?._id])

  const cityTheaters = useMemo(
    () => theaters.filter((theater) => theater.city === selectedCity),
    [theaters, selectedCity]
  )

  const showsForSelectedTheater = useMemo(() => {
    if (!selectedTheater) return []
    return showMap[selectedTheater._id] || []
  }, [showMap, selectedTheater])

  const availableDates = useMemo(() => {
    const dates = Array.from(
      new Set(
        showsForSelectedTheater.map((show) =>
          new Date(show.showDateTime).toISOString().split('T')[0]
        )
      )
    )
    return dates.sort((a, b) => new Date(a) - new Date(b))
  }, [showsForSelectedTheater])

  const timesForSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    return showsForSelectedTheater.filter(
      (show) => new Date(show.showDateTime).toISOString().split('T')[0] === selectedDate
    )
  }, [showsForSelectedTheater, selectedDate])

  const handleCitySwitch = (city) => {
    localStorage.setItem('selectedCity', city)
    setSelectedCity(city)
    window.dispatchEvent(new CustomEvent('cityChanged', { detail: { city } }))
  }

  const handleTheaterSelect = (theater) => {
    setSelectedTheater(theater)
  }

  const handleProceed = () => {
    if (!selectedTheater) {
      toast.error('Please select a theater')
      return
    }
    if (!selectedDate) {
      toast.error('Please select a date')
      return
    }
    if (!selectedShow) {
      toast.error('Please select a time')
      return
    }

    navigate(`/booking/seats/${selectedShow._id}`)
  }

  if (loading) return <Loading />

  if (!movie) {
    return (
      <div className='flex items-center justify-center min-h-[50vh]'>
        <p className='text-slate-500'>Movie not found</p>
      </div>
    )
  }

  return (
    <div className='relative pt-32 pb-24 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <div className='flex flex-col gap-8 max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row gap-6'>
          <img
            src={resolveMovieImageUrl(movie.poster_path) || MOVIE_POSTER_PLACEHOLDER}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = MOVIE_POSTER_PLACEHOLDER
            }}
            alt={movie.title}
            className='rounded-xl h-72 w-52 object-cover shadow-sm'
          />
          <div className='flex flex-col justify-center'>
            <p className='text-sm uppercase tracking-wide text-slate-500'>Step 1 complete</p>
            <h1 className='text-4xl font-semibold text-slate-900'>{movie.title}</h1>
            <p className='text-slate-500 mt-2 max-w-2xl line-clamp-3'>{movie.overview}</p>
          </div>
        </div>

        <div>
          <p className='text-lg font-semibold text-slate-900'>Step 2: Select Theater in {selectedCity}</p>
          <div className='flex flex-wrap gap-2 mt-3'>
            {availableCities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySwitch(city)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  selectedCity === city
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-primary/40'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
            {cityTheaters.length === 0 ? (
              <p className='text-slate-500'>No theaters available in {selectedCity}</p>
            ) : (
              cityTheaters.map((theater) => (
                <button
                  key={theater._id}
                  onClick={() => handleTheaterSelect(theater)}
                  className={`text-left bg-white border rounded-2xl p-4 transition shadow-sm ${
                    selectedTheater?._id === theater._id
                      ? 'ring-2 ring-primary border-primary/40'
                      : 'border-slate-200 hover:border-primary/40'
                  }`}
                >
                  <h3 className='text-lg font-semibold'>{theater.name}</h3>
                  <p className='text-slate-500 text-sm'>{theater.location}</p>
                  <p className='text-slate-500 text-sm'>{theater.screens} screens</p>
                </button>
              ))
            )}
          </div>
        </div>

        {selectedTheater && (
          <div className='bg-white border border-slate-200 rounded-2xl p-6 shadow-sm'>
            <p className='text-lg font-semibold text-slate-900'>Step 3: Select Show Date & Time</p>
            <p className='text-sm text-slate-500 mt-1'>Selected theater: {selectedTheater.name}</p>

            {availableDates.length === 0 ? (
              <p className='text-slate-500 mt-4'>No upcoming shows for this theater.</p>
            ) : (
              <>
                <div className='flex flex-wrap gap-3 mt-4'>
                  {availableDates.map((date) => {
                    const d = new Date(date)
                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date)
                          setSelectedShow(null)
                        }}
                        className={`h-14 w-14 rounded-xl flex flex-col items-center justify-center text-sm ${
                          selectedDate === date
                            ? 'bg-primary text-white'
                            : 'border border-slate-200 text-slate-700 hover:border-primary/40'
                        }`}
                      >
                        <span>{d.getDate()}</span>
                        <span>{d.toLocaleString('en-US', { month: 'short' })}</span>
                      </button>
                    )
                  })}
                </div>

                {selectedDate && (
                  <div className='mt-6'>
                    <p className='text-sm text-slate-600'>Available times</p>
                    <div className='flex flex-wrap gap-3 mt-3'>
                      {timesForSelectedDate.map((show) => (
                        <button
                          key={show._id}
                          onClick={() => setSelectedShow(show)}
                          className={`px-4 py-2 rounded-full text-sm border ${
                            selectedShow?._id === show._id
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-primary/40'
                          }`}
                        >
                          {isoTimeFormat(show.showDateTime)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              onClick={handleProceed}
              className='mt-8 px-8 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md text-white font-semibold'
            >
              Step 4: Select Seats
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Theater
