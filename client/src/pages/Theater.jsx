import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import DateSelect from '../components/DateSelect'
import toast from 'react-hot-toast'

const Theater = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [theaters, setTheaters] = useState([])
  const [showMap, setShowMap] = useState({})
  const [selectedTheater, setSelectedTheater] = useState(null)
  const [selectedDateTime, setSelectedDateTime] = useState({})
  const [loading, setLoading] = useState(true)

  // ================= FETCH DATA =================
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

      // ===== FIND MOVIE =====
      const currentMovie = movieData.movies.find(m => m._id === id)

      if (!currentMovie) {
        toast.error('Movie not found')
        return
      }

      setMovie(currentMovie)

      // ===== FILTER SHOWS BY MOVIE + NEXT 5 DAYS =====
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const endDate = new Date(today)
      endDate.setDate(endDate.getDate() + 4)
      endDate.setHours(23, 59, 59, 999)

      const movieShows = showData.shows.filter(show => {
        const isMovieMatch = show.movie?.toString() === id || show.movie?._id === id
        if (!isMovieMatch) return false
        const showTime = new Date(show.showDateTime)
        return showTime >= today && showTime <= endDate
      })

      // ===== GROUP SHOWS BY THEATER =====
      const groupedByTheater = movieShows.reduce((acc, show) => {

        const theaterId =
          typeof show.theater === 'string'
            ? show.theater
            : show.theater?._id

        if (!acc[theaterId]) acc[theaterId] = []
        acc[theaterId].push(show)

        return acc
      }, {})

      // ===== ONLY THEATERS THAT HAVE SHOWS =====
      const availableTheaters = theaterData.theaters.filter(
        theater => groupedByTheater[theater._id]
      )

      setShowMap(groupedByTheater)
      setTheaters(availableTheaters)

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

  // ================= THEATER CLICK =================
  const handleTheaterSelect = (theater) => {

    setSelectedTheater(theater)

    const shows = showMap[theater._id] || []

    const dateTimeObj = {}

    shows.forEach(show => {

      const date = new Date(show.showDateTime)

      const dateKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      if (!dateTimeObj[dateKey]) dateTimeObj[dateKey] = []

      dateTimeObj[dateKey].push({
        time: show.showDateTime,
        showId: show._id,
        theaterId: theater._id
      })

    })

    setSelectedDateTime(dateTimeObj)
  }

  // ================= DATE CLICK =================
  const handleDateSelect = (date) => {

    if (!selectedTheater) {
      toast.error('Please select a theater first')
      return
    }

    navigate(`/movies/${id}/${date}/${selectedTheater._id}`)
  }

  // ================= UI =================
  if (loading) return <Loading />

  if (!movie) {
    return (
      <div className='flex items-center justify-center min-h-[50vh]'>
        <p className='text-gray-400'>Movie not found</p>
      </div>
    )
  }

  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>

      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <div className='flex flex-col gap-8 max-w-6xl mx-auto'>

        {/* Movie Poster */}
        <img
          src={movie.poster_path}
          alt={movie.title}
          className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'
        />

        <div className='flex flex-col gap-3'>

          <h1 className='text-4xl font-semibold'>{movie.title}</h1>

          {/* THEATERS */}
          <p className='text-lg font-medium mt-8'>Select a Theater</p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>

            {theaters.length === 0 ? (
              <p className='text-gray-400'>No theaters available</p>
            ) : (
              theaters.map(theater => (

                <div
                  key={theater._id}
                  onClick={() => handleTheaterSelect(theater)}
                  className={`bg-primary/10 border border-primary/20 rounded-lg p-4 cursor-pointer hover:bg-primary/20 transition
                    ${selectedTheater?._id === theater._id ? 'ring-2 ring-primary' : ''}
                  `}
                >

                  <h3 className='text-lg font-semibold'>{theater.name}</h3>
                  <p className='text-gray-400 text-sm'>{theater.location}</p>
                  <p className='text-gray-400 text-sm'>{theater.screens} screens</p>

                  <div className='flex flex-wrap gap-1 mt-2'>
                    {theater.facilities.slice(0, 3).map(facility => (
                      <span
                        key={facility}
                        className='text-xs bg-primary/20 px-2 py-1 rounded'
                      >
                        {facility}
                      </span>
                    ))}
                  </div>

                </div>
              ))
            )}

          </div>

          {/* DATE SELECT */}
          {selectedTheater && (
            <>
              <p className='text-lg font-medium mt-8'>
                Selected Theater: {selectedTheater.name}
              </p>

              <DateSelect
                dateTime={selectedDateTime}
                id={id}
                onDateSelect={handleDateSelect}
              />
            </>
          )}

        </div>

      </div>
    </div>
  )
}

export default Theater
