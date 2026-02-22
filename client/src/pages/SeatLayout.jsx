import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

const SeatLayout = () => {
  const { showId } = useParams()
  const navigate = useNavigate()

  const [selectedSeats, setSelectedSeats] = useState([])
  const [showDetails, setShowDetails] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState({})
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

        const show = showsData.shows.find((item) => item._id === showId)
        if (!show) {
          setShowDetails(null)
          return
        }

        const movieId = typeof show.movie === 'string' ? show.movie : show.movie?._id
        const theaterId = typeof show.theater === 'string' ? show.theater : show.theater?._id

        setShowDetails(show)
        setOccupiedSeats(show.occupiedSeats || {})
        setMovie(moviesData.movies.find((item) => item._id === movieId) || null)
        setTheater(theatersData.theaters.find((item) => item._id === theaterId) || null)
      } catch (error) {
        console.error('Error fetching show data:', error)
        toast.error('Failed to load seat map')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [showId])

  const handleSeatClick = (seatId) => {
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      toast('You can select up to 5 seats')
      return
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]
    )
  }

  const renderSeats = (row) => (
    <div key={row} className="flex gap-2 mb-1 justify-center">
      {Array.from({ length: 9 }, (_, i) => {
        const seatId = `${row}${i + 1}`
        const isOccupied = occupiedSeats[seatId]
        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            disabled={isOccupied}
            className={`h-8 w-8 rounded border cursor-pointer ${
              isOccupied
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : selectedSeats.includes(seatId)
                  ? 'bg-primary text-white'
                  : 'border-slate-200 hover:border-primary/40 hover:bg-primary/10'
            }`}
          >
            {seatId}
          </button>
        )
      })}
    </div>
  )

  if (loading) return <Loading />

  if (!showDetails || !movie) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] text-center px-4'>
        <p className='text-slate-500'>Selected show was not found.</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 pt-32 pb-16'>
      <div className='w-full md:w-72 bg-white border border-slate-200 rounded-2xl py-8 px-6 h-max md:sticky md:top-30 shadow-sm'>
        <p className='text-lg font-semibold text-slate-900'>Booking Summary</p>
        <div className='mt-4 space-y-3 text-sm text-slate-600'>
          <div>
            <p className='text-slate-500'>Movie</p>
            <p className='text-slate-900 font-medium'>{movie.title}</p>
          </div>
          <div>
            <p className='text-slate-500'>Theater</p>
            <p className='text-slate-900 font-medium'>{theater?.name || 'Theater'}</p>
          </div>
          <div>
            <p className='text-slate-500'>Date</p>
            <p className='text-slate-900 font-medium'>
              {new Date(showDetails.showDateTime).toISOString().split('T')[0]}
            </p>
          </div>
          <div>
            <p className='text-slate-500'>Time</p>
            <p className='text-slate-900 font-medium'>{isoTimeFormat(showDetails.showDateTime)}</p>
          </div>
          <div>
            <p className='text-slate-500'>Price / seat</p>
            <p className='text-slate-900 font-medium'>Rs. {showDetails.showPrice}</p>
          </div>
        </div>
      </div>

      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0px" right="0px" />
        <h1 className='text-2xl font-semibold mb-1 text-slate-900'>Step 4: Select your seat</h1>
        <p className='text-sm text-slate-500 mb-1'>{movie.title}</p>
        <p className='text-lg font-medium text-primary mb-4'>{theater?.name}</p>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-slate-500 text-sm mb-6'>SCREEN SIDE</p>

        <div className='flex flex-col gap-2 mb-8 items-center'>
          {['A', 'B'].map(renderSeats)}
        </div>

        <div className='flex flex-row gap-16 mb-8 justify-center'>
          <div className='flex flex-col'>{['C', 'D'].map(renderSeats)}</div>
          <div className='flex flex-col'>{['E', 'F'].map(renderSeats)}</div>
        </div>

        <div className='flex flex-row gap-16 justify-center'>
          <div className='flex flex-col'>{['G', 'H'].map(renderSeats)}</div>
          <div className='flex flex-col'>{['I', 'J'].map(renderSeats)}</div>
        </div>

        <button
          onClick={() => {
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
                showId: showDetails._id,
                movieTitle: movie?.title || '',
                theaterName: theater?.name || '',
                showTime: isoTimeFormat(showDetails.showDateTime),
                date: new Date(showDetails.showDateTime).toISOString().split('T')[0],
                showPrice: showDetails.showPrice
              }
            })
          }}
          className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full text-white font-semibold cursor-pointer active:scale-95'
        >
          Proceed To Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default SeatLayout
