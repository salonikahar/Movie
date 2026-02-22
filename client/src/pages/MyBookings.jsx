import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { MOVIE_POSTER_PLACEHOLDER, resolveMovieImageUrl } from '../lib/imageUrl'
const MyBookings = () => {
  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const getMyBookings = async () => {
    if (!user) return
    try {
      const token = localStorage.getItem('userToken')
      const response = await fetch('/api/bookings/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        let serverBookings = data.bookings || [];

        // If this client recently completed a booking, check local storage for a lastBookingId
        // and ensure that booking is visible immediately (helps UX after redirect from payment)
        try {
          const lastBookingId = localStorage.getItem('lastBookingId')
          const lastBookingPartial = JSON.parse(localStorage.getItem('lastBookingPartial') || 'null')
          if (lastBookingId && !serverBookings.some(b => b.bookingId === lastBookingId)) {
            if (lastBookingPartial && lastBookingPartial.bookingId === lastBookingId) {
              // If partial booking is missing populated show.movie, fetch full ticket data
              if (!lastBookingPartial.show || !lastBookingPartial.show.movie) {
                const token = localStorage.getItem('userToken')
                if (token) {
                  const ticketRes = await fetch(`/api/bookings/invoice/${lastBookingId}`, { headers: { Authorization: `Bearer ${token}` } })
                  const ticketData = await ticketRes.json()
                  if (ticketData.success) serverBookings = [ticketData.booking, ...serverBookings]
                }
              } else {
                serverBookings = [lastBookingPartial, ...serverBookings]
              }
            } else {
              // Fetch ticket to get fully populated booking
              const token = localStorage.getItem('userToken')
              if (token) {
                const ticketRes = await fetch(`/api/bookings/invoice/${lastBookingId}`, { headers: { Authorization: `Bearer ${token}` } })
                const ticketData = await ticketRes.json()
                if (ticketData.success) serverBookings = [ticketData.booking, ...serverBookings]
              }
            }
            // Clear the localStorage indicator once merged
            localStorage.removeItem('lastBookingId')
            localStorage.removeItem('lastBookingPartial')
          }
        } catch (e) {
          // ignore parsing errors
        }

        setBookings(serverBookings);
      } else {
        console.error('Failed to fetch bookings:', data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(()=> {
    if (user) {
      getMyBookings()

      // Poll bookings every 10s so the list updates if user stays on the page
      const interval = setInterval(() => {
        getMyBookings()
      }, 10000)

      return () => clearInterval(interval)
    }
  },[user])

  const handleClearBookingHistory = async () => {
    if (isClearing) return
    if (!bookings.length) return

    const confirmed = window.confirm('Are you sure you want to clear all booking history? This action cannot be undone.')
    if (!confirmed) return

    try {
      setIsClearing(true)
      const token = localStorage.getItem('userToken')
      const response = await fetch('/api/bookings/user', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setBookings([])
        localStorage.removeItem('lastBookingId')
        localStorage.removeItem('lastBookingPartial')
        window.alert('Booking history cleared')
      } else {
        window.alert(data.message || 'Failed to clear booking history')
      }
    } catch (error) {
      console.error('Error clearing booking history:', error)
      window.alert('Failed to clear booking history')
    } finally {
      setIsClearing(false)
    }
  }

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[80vh]'>
        <h2 className='text-xl font-semibold text-slate-600 mb-2'>Please login to view your bookings</h2>
        <button 
          onClick={() => window.location.href = '/sign-in'}
          className='px-6 py-2 bg-primary hover:bg-primary-dull rounded-md transition text-white font-semibold'
        >
          Login
        </button>
      </div>
    )
  }


  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-32 md:pt-36 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <h1 className='text-2xl font-semibold text-slate-900'>My Bookings</h1>
        {bookings.length > 0 && (
          <button
            onClick={handleClearBookingHistory}
            disabled={isClearing}
            className='px-4 py-2 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium'
          >
            {isClearing ? 'Clearing...' : 'Clear Booking History'}
          </button>
        )}
      </div>

      {bookings.length > 0 ? bookings.map((item,index)=>(
        <div key={item._id || item.bookingId || index} className='flex flex-col md:flex-row justify-between bg-white
        border border-slate-200 rounded-2xl mt-4 p-2 max-w-3xl shadow-sm'>
          <div className='flex flex-col md:flex-col md:flex-row'>
            <img
              src={resolveMovieImageUrl(item.show?.movie?.poster_path) || MOVIE_POSTER_PLACEHOLDER}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = MOVIE_POSTER_PLACEHOLDER
              }}
              alt=""
              className='md:max-w-45 aspect-video h-auto object-cover object-btootm rounded-lg'
            />
            <div className='flex flex-col p-4'>
              <p className='text-lg font-semibold text-slate-900'>{item.show?.movie?.title || 'Title unavailable'}</p>
              <p className='text-slate-500 text-sm'>{timeFormat(item.show?.movie?.runtime || 0)}</p>
              <p className='text-slate-500 text-sm mt-auto'>{dateFormat(item.show?.showDateTime)}</p>
              <p className='text-slate-500 text-sm mt-1'>Theater: {item.show?.theater || 'N/A'}</p>
            </div>
           </div>

            <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
              <div className='flex items-center gap-4'>
                <p className='text-2xl font-semibold mb-3 text-slate-900'>{currency}{item.amount}</p>
                {!item.isPaid && (
                  <span className='px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium'>
                    Payment Pending
                  </span>
                )}
                {item.isPaid && (
                  <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                    Paid
                  </span>
                )}
              </div>
              <div className='text-sm mb-2'>
                  <p><span className='text-slate-500'>Total Tickets:</span> {(item.bookedSeats || []).length}</p>
                  <p><span className='text-slate-500'>Seat Number:</span> {(item.bookedSeats || []).join(", ")}</p>
                  <p><span className='text-slate-500'>Booking ID:</span> {item.bookingId || 'N/A'}</p>
               </div>
               <button
                 onClick={() => navigate(`/ticket/${item.bookingId}`)}
                 className='bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md text-sm font-semibold transition mt-2'
               >
                 View Ticket
               </button>
            </div>

        </div>
      )) : (
        <div className='flex flex-col items-center justify-center min-h-[50vh]'>
          <h2 className='text-xl font-semibold text-slate-600 mb-2'>No bookings found</h2>
          <p className='text-slate-500'>You haven't made any bookings yet.</p>
        </div>
      )}

    </div>
  ) : <Loading />
}

export default MyBookings
