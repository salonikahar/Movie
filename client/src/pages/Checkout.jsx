import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Loading from '../components/Loading'
import { ArrowLeftIcon, CreditCardIcon, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import BlurCircle from '../components/BlurCircle'

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [bookingData, setBookingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paymentMethod] = useState('razorpay')
  const [showPrice, setShowPrice] = useState(location.state?.showPrice || 0)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    if (location.state) {
      setBookingData(location.state)
      setShowPrice(location.state.showPrice || 0)
      fetchShowPrice(location.state.showId)
    } else {
      navigate(-1)
    }
  }, [location.state, navigate])

  const fetchShowPrice = async (showId) => {
    try {
      const response = await fetch('/api/shows')
      const data = await response.json()
      if (data.success) {
        const show = data.shows.find(s => s._id === showId)
        if (show) {
          setShowPrice(show.showPrice || 250)
        }
      }
    } catch (error) {
      console.error('Error fetching show price:', error)
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleRazorpayPayment = async () => {
    try {
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript()
      if (!razorpayLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your connection and try again.')
        return
      }

      const token = localStorage.getItem('userToken')
      if (!token) {
        toast.error('Please sign in before continuing to payment')
        navigate('/sign-in')
        return
      }
      
      // Create order
      const orderResponse = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          showId: bookingData.showId,
          bookedSeats: bookingData.selectedSeats
        })
      })

      if (orderResponse.status === 401) {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userData')
        toast.error('Session expired. Please sign in again.')
        navigate('/sign-in')
        return
      }

      const orderData = await orderResponse.json()
      if (!orderData.success) {
        console.error('Order creation failed', orderData)
        toast.error(orderData.message || 'Failed to create order')
        return
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
      if (!razorpayKey) {
        toast.error('Razorpay key missing. Set VITE_RAZORPAY_KEY_ID in client/.env')
        return
      }

      const options = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'BookMyScreen',
        description: `Booking for ${bookingData.movieTitle}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              showId: bookingData.showId,
              bookedSeats: bookingData.selectedSeats
            })
          })

          if (verifyResponse.status === 401) {
            localStorage.removeItem('userToken')
            localStorage.removeItem('userData')
            toast.error('Session expired. Please sign in again.')
            navigate('/sign-in')
            return
          }

          let verifyData
          try {
            verifyData = await verifyResponse.json()
          } catch (err) {
            console.error('Failed to parse verify response', err)
            toast.error('Payment verification failed (invalid server response)')
            return
          }

          if (verifyData.success) {
            toast.success('Payment successful! Booking confirmed.')
            // Store lastBookingId and lastBookingPartial so MyBookings can show it immediately
            try {
              localStorage.setItem('lastBookingId', verifyData.booking.bookingId)
              localStorage.setItem('lastBookingPartial', JSON.stringify(verifyData.booking))
            } catch (e) {
              // ignore localStorage set errors
            }
            navigate(`/invoice/${verifyData.booking.bookingId}`)
          } else {
            console.error('Payment verification failed', verifyData)
            toast.error(verifyData.message || 'Payment verification failed')
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#F84565'
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Razorpay error:', error)
      toast.error('Payment failed. Please try again.')
    }
  }

  const handlePayment = () => {
    handleRazorpayPayment()
  }

  if (!bookingData) {
    return <Loading />
  }

  const { selectedSeats, movieTitle, theaterName, showTime, date } = bookingData
  const totalAmount = selectedSeats.length * showPrice

  return (
    <div className='relative min-h-screen py-10 px-6 md:px-16 lg:px-40'>
      <BlurCircle top="50px" left="50px" />
      <BlurCircle bottom="50px" right="50px" />
      
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <button
            onClick={() => navigate(-1)}
            className='p-2 hover:bg-primary/20 rounded-full transition'
          >
            <ArrowLeftIcon className='w-5 h-5' />
          </button>
          <h1 className='text-3xl font-bold'>Checkout</h1>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Booking Summary */}
          <div className='bg-primary/10 border border-primary/20 rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4'>Booking Summary</h2>

            <div className='space-y-3 mb-6'>
              <div>
                <p className='text-sm text-gray-400'>Movie</p>
                <p className='font-medium'>{movieTitle}</p>
              </div>

              <div>
                <p className='text-sm text-gray-400'>Theater</p>
                <p className='font-medium'>{theaterName || 'Theater 1'}</p>
              </div>

              <div>
                <p className='text-sm text-gray-400'>Date & Time</p>
                <p className='font-medium'>{date} at {showTime}</p>
              </div>

              <div>
                <p className='text-sm text-gray-400'>Seats</p>
                <p className='font-medium'>{selectedSeats.join(', ')}</p>
              </div>

              <div className='border-t border-primary/20 pt-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-400'>
                    {selectedSeats.length} × ₹{showPrice}
                  </span>
                  <span className='font-semibold text-lg'>₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className='bg-primary/10 border border-primary/20 rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
              <CreditCardIcon className='w-5 h-5' />
              Payment Method
            </h2>

            <div className='mb-6'>
              {/* Razorpay - Only Payment Option */}
              <div className='p-4 border-2 border-primary bg-primary/20 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-full bg-primary'>
                    <Wallet className='w-5 h-5 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='font-semibold'>Online Payment (Razorpay)</p>
                    <p className='text-sm text-gray-400'>Pay securely online</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='border-t border-primary/20 pt-4 mb-4'>
              <div className='flex justify-between items-center text-lg font-semibold'>
                <span>Total Amount</span>
                <span className='text-primary'>₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className='w-full bg-primary hover:bg-primary-dull text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

