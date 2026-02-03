import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

const SeatLayout = () => {
  const { id, date, theaterId } = useParams()
  const navigate = useNavigate()

  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedShow, setSelectedShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState({})
  const [showTimes, setShowTimes] = useState([])
  const [movie, setMovie] = useState(null)
  const [theater, setTheater] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, showsRes, theatersRes] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/shows'),
          fetch('/api/theaters')
        ])

        const moviesData = await moviesRes.json()
        const showsData = await showsRes.json()
        const theatersData = await theatersRes.json()

        if (!moviesData.success || !showsData.success || !theatersData.success) {
          throw new Error('Unable to load show information')
        }

        const movieDetails = moviesData.movies.find(movie => movie._id === id)
        const theaterDetails = theatersData.theaters.find(theater => theater._id === theaterId)

        setMovie(movieDetails || null)
        setTheater(theaterDetails || null)

        const filteredShows = showsData.shows.filter(show => {
          const movieId = typeof show.movie === 'string' ? show.movie : show.movie?._id
          return movieId === id &&
          show.theater === theaterId &&
          new Date(show.showDateTime).toISOString().split('T')[0] === date
        })

        setShowTimes(filteredShows)
      } catch (error) {
        console.error('Error fetching show data:', error)
        toast.error('Failed to load seat map')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, theaterId, date])

  const handleSeatClick = (seatId) => {
    if (!selectedShow) {
      toast('Please select a show time first')
      return
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      toast('You can select up to 5 seats')
      return
    }
    setSelectedSeats(prev => (
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : [...prev, seatId]
    ))
  }

  const handleShowSelect = (show) => {
    setSelectedShow(show)
    setOccupiedSeats(show.occupiedSeats || {})
    setSelectedSeats([])
  }

  const renderSeats = row => (
    <div key={row} className="flex gap-2 mb-1 justify-center">
      {Array.from({ length: 9 }, (_, i) => {
        const seatId = `${row}${i + 1}`
        const isOccupied = occupiedSeats[seatId]
        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            disabled={isOccupied}
            className={`h-8 w-8 rounded border cursor-pointer
              ${isOccupied ? "bg-gray-500 text-gray-300 cursor-not-allowed" :
                selectedSeats.includes(seatId) ? "bg-primary text-white" :
                "border-primary/60 hover:bg-primary/20"}`}
          >
            {seatId}
          </button>
        )
      })}
    </div>
  )

  if (loading) {
    return <Loading />
  }

  if (!movie || showTimes.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] text-center px-4'>
        <p className='text-gray-400'>No shows available for the selected date and theater.</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:pt-20'>
      {/* Available Timings */}
      <div className='w-full md:w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {showTimes.map(show => (
            <div
              key={show._id}
              onClick={() => handleShowSelect(show)}
              className={`flex items-center gap-2 px-6 py-2 w-full rounded-r-md cursor-pointer transition ${
                selectedShow?._id === show._id ? "bg-primary text-white" : "hover:bg-primary/20"
              }`}>
              <ClockIcon className='w-4 h-4' />
              <p className='text-sm'>{isoTimeFormat(show.showDateTime)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seats Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0px" right="0px" />
        <h1 className='text-2xl font-semibold mb-1'>Select your seat</h1>
        {movie && <p className='text-sm text-gray-400 mb-1'>{movie.title}</p>}
        {theater && <p className='text-lg font-medium text-primary mb-4'>{theater.name}</p>}
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        {/* Rows A and B */}
        <div className='flex flex-col gap-2 mb-8 items-center'>
          {['A', 'B'].map(renderSeats)}
        </div>

        {/* Block 1: (C/D left, E/F right) */}
        <div className='flex flex-row gap-16 mb-8 justify-center'>
          <div className='flex flex-col'>{['C', 'D'].map(renderSeats)}</div>
          <div className='flex flex-col'>{['E', 'F'].map(renderSeats)}</div>
        </div>
        
        {/* Block 2: (G/H left, I/J right) */}
        <div className='flex flex-row gap-16 justify-center'>
          <div className='flex flex-col'>{['G', 'H'].map(renderSeats)}</div>
          <div className='flex flex-col'>{['I', 'J'].map(renderSeats)}</div>
        </div>

        <button
          onClick={() => {
            if (!selectedShow) {
              toast('Please select a show time')
              return
            }
            if (selectedSeats.length === 0) {
              toast('Please select at least one seat')
              return
            }
            if (!user) {
              toast('Please log in to book tickets')
              navigate('/sign-in')
              return
            }

            navigate('/checkout', {
              state: {
                selectedSeats,
                showId: selectedShow._id,
                movieTitle: movie?.title || '',
                theaterName: theater?.name || '',
                showTime: isoTimeFormat(selectedShow.showDateTime),
                date,
                showPrice: selectedShow.showPrice
              }
            })
          }}
          className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'
        >
          Proceed To Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default SeatLayout
