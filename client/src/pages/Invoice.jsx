import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { Download, ArrowLeft, CheckCircle } from 'lucide-react'
import { dateFormat } from '../lib/dateFormat'
import timeFormat from '../lib/timeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

const Invoice = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('userToken')
        const response = await fetch(`/api/bookings/invoice/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.success) {
          setBooking(data.booking)
        } else {
          toast.error('Invoice not found')
          navigate('/my-bookings')
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to load invoice')
        navigate('/my-bookings')
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) {
      fetchInvoice()
    }
  }, [bookingId, navigate])

  const handleDownload = () => {
    const printContent = document.getElementById('invoice-content')
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${booking?.bookingId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin: 20px 0; }
            .details div { margin: 10px 0; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .table th { background-color: #f2f2f2; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
            .status { padding: 5px 10px; border-radius: 5px; display: inline-block; }
            .paid { background-color: #d4edda; color: #155724; }
            .pending { background-color: #fff3cd; color: #856404; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) return <Loading />

  if (!booking) return null

  const movie = booking.show?.movie
  const show = booking.show

  return (
    <div className='relative min-h-screen py-10 px-6 md:px-16 lg:px-40'>
      <BlurCircle top="50px" left="50px" />
      <BlurCircle bottom="50px" right="50px" />
      
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <button
            onClick={() => navigate('/my-bookings')}
            className='flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Bookings
          </button>
          <button
            onClick={handleDownload}
            className='flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dull rounded-lg transition'
          >
            <Download className='w-4 h-4' />
            Download Invoice
          </button>
        </div>

        <div id='invoice-content' className='bg-primary/10 border border-primary/20 rounded-lg p-8'>
          {/* Header */}
          <div className='text-center mb-8 pb-6 border-b border-primary/20'>
            <h1 className='text-3xl font-bold mb-2'>BookMyScreen</h1>
            <p className='text-gray-400'>Movie Ticket Booking Invoice</p>
          </div>

          {/* Invoice Details */}
          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <div>
              <h3 className='font-semibold mb-2'>Invoice Details</h3>
              <p className='text-sm text-gray-400'>Invoice Number</p>
              <p className='font-medium'>{booking.bookingId}</p>
              <p className='text-sm text-gray-400 mt-2'>Booking Date</p>
              <p className='font-medium'>{new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className='font-semibold mb-2'>Payment Status</h3>
              <div className='flex items-center gap-2'>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.isPaid 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {booking.isPaid ? 'Paid' : 'Pending'}
                </span>
                {booking.isPaid && <CheckCircle className='w-5 h-5 text-green-400' />}
              </div>
              <p className='text-sm text-gray-400 mt-2'>Payment Method</p>
              <p className='font-medium capitalize'>{booking.paymentMethod?.replace('_', ' ') || 'Cash on Delivery'}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className='mb-6'>
            <h3 className='font-semibold mb-2'>Customer Details</h3>
            <p className='text-gray-300'>{booking.user?.name || user?.name}</p>
            <p className='text-sm text-gray-400'>{booking.user?.email || user?.email}</p>
            {booking.user?.phone && (
              <p className='text-sm text-gray-400'>{booking.user.phone}</p>
            )}
          </div>

          {/* Booking Details */}
          <div className='mb-6'>
            <h3 className='font-semibold mb-4'>Booking Details</h3>
            <div className='bg-gray-800/50 rounded-lg p-4 space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Movie:</span>
                <span className='font-medium'>{movie?.title}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Theater:</span>
                <span className='font-medium'>{show?.theater || 'Theater 1'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Show Date & Time:</span>
                <span className='font-medium'>{show?.showDateTime ? dateFormat(show.showDateTime) : 'N/A'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Seats:</span>
                <span className='font-medium'>{booking.bookedSeats.join(', ')}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Number of Tickets:</span>
                <span className='font-medium'>{booking.bookedSeats.length}</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className='border-t border-primary/20 pt-6'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-gray-400'>Ticket Price (×{booking.bookedSeats.length})</span>
              <span>₹{booking.amount}</span>
            </div>
            <div className='flex justify-between items-center text-lg font-semibold mt-4 pt-4 border-t border-primary/20'>
              <span>Total Amount</span>
              <span className='text-primary'>₹{booking.amount}</span>
            </div>
          </div>

          {/* Footer */}
          <div className='mt-8 pt-6 border-t border-primary/20 text-center text-sm text-gray-400'>
            <p>Thank you for booking with BookMyScreen!</p>
            <p className='mt-2'>Please arrive at the theater 15 minutes before showtime.</p>
            {!booking.isPaid && (
              <p className='mt-2 text-yellow-400 font-medium'>
                Please pay at the theater counter.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice



