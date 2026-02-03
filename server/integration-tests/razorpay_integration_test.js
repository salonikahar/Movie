/**
 * Razorpay integration test
 * Usage (from repo root):
 *
 * # if server is running on default http://localhost:3000
 * node server/integration-tests/razorpay_integration_test.js
 *
 * # If you want the test script to compute a real signature before calling /verify
 * # (use this when testing with real Razorpay test keys) set RAZORPAY_SECRET here
 * RAZORPAY_SECRET=your_razorpay_secret node server/integration-tests/razorpay_integration_test.js
 *
 * The script will:
 *  - create a new test user (unique email)
 *  - login to obtain token
 *  - pick the first available movie and a show for it
 *  - create an order (server may use real Razorpay API if keys configured)
 *  - simulate a payment id and compute signature (if RAZORPAY_SECRET env set) then call verify
 *  - verify booking is created and show occupied seats updated
 */

import axios from 'axios'
import crypto from 'crypto'

const API = process.env.API_URL || 'http://localhost:3000'

async function run() {
  try {
    console.log('\n➡️  Razorpay integration test starting...')

    // 0) create a unique user
    const ts = Date.now()
    const email = `e2e+${ts}@example.com`
    const password = 'password123'

    console.log('1) Creating test user', email)
    const signupRes = await axios.post(`${API}/api/users/signup`, {
      name: 'Razorpay E2E Tester',
      email,
      password,
      phone: '9999999999'
    }).catch(e => e.response?.data || { success: false, message: e.message })

    if (!signupRes.data?.success && signupRes.data?.message !== 'User already exists with this email') {
      throw new Error('Signup failed: ' + JSON.stringify(signupRes.data))
    }

    // 2) Login
    console.log('2) Logging in...')
    const loginRes = await axios.post(`${API}/api/users/login`, { email, password })
    if (!loginRes.data.success) throw new Error('Login failed: ' + loginRes.data.message)
    const token = loginRes.data.token
    console.log('  Obtained token length:', token.length)

    const authHeaders = { Authorization: `Bearer ${token}` }

    // 3) Fetch movies and shows
    console.log('3) Fetching movies & shows...')
    const moviesRes = await axios.get(`${API}/api/movies`)
    if (!moviesRes.data.success) throw new Error('Failed to fetch movies')
    const movie = moviesRes.data.movies[0]
    console.log(`  picked movie: ${movie._id} ${movie.title}`)

    const showsRes = await axios.get(`${API}/api/shows`)
    if (!showsRes.data.success) throw new Error('Failed to fetch shows')
    const shows = showsRes.data.shows
    const show = shows.find(s => (typeof s.movie === 'string' ? s.movie : s.movie?._id) === movie._id)
    if (!show) throw new Error('No show found for movie')
    console.log('  picked show:', show._id, 'theater:', show.theater, 'price:', show.showPrice)

    // 4) Create order
    console.log('4) Creating order via API...')
    const bookedSeats = ['Z1']
    const orderRes = await axios.post(`${API}/api/payments/razorpay/order`, { showId: show._id, bookedSeats }, { headers: authHeaders })
    if (!orderRes.data.success) throw new Error('Order creation failed: ' + JSON.stringify(orderRes.data))

    const order = orderRes.data.order
    console.log('  Received order:', order.id, 'amount:', order.amount)

    // 5) Simulate payment and compute signature only if RAZORPAY_SECRET env provided
    const paymentId = `pay_sim_${Date.now()}`
    const secret = process.env.RAZORPAY_SECRET
    let signature = 'simulated_signature'

    if (secret) {
      signature = crypto.createHmac('sha256', secret).update(`${order.id}|${paymentId}`).digest('hex')
      console.log('  Computed signature using RAZORPAY_SECRET (for test)')
    } else {
      console.log('  No RAZORPAY_SECRET provided to test script; using simulated signature')
    }

    // 6) Call verify endpoint
    console.log('5) Verifying payment / creating booking...')
    const verifyRes = await axios.post(`${API}/api/payments/razorpay/verify`, {
      razorpayOrderId: order.id,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      showId: show._id,
      bookedSeats
    }, { headers: authHeaders }).catch(e => e.response?.data || { success: false, message: e.message })

    if (!verifyRes.data?.success) throw new Error('Verify failed: ' + JSON.stringify(verifyRes.data))

    const booking = verifyRes.data.booking
    console.log('  Booking created: ', booking.bookingId, 'amount:', booking.amount)

    // 7) Validate booking is present under user bookings
    console.log('6) Confirming user bookings...')
    const bookings = await axios.get(`${API}/api/bookings/user`, { headers: authHeaders })
    console.log('  User has', bookings.data.bookings.length, 'bookings')

    // 8) Validate show occupied seats
    const freshShows = await axios.get(`${API}/api/shows`)
    const freshShow = freshShows.data.shows.find(s => s._id === show._id)
    console.log('7) Show occupiedKeys after booking:', Object.keys(freshShow.occupiedSeats || {}))

    console.log('\n✅ Integration test completed successfully')
    process.exit(0)
  } catch (err) {
    console.error('\n❌ Integration test failed:', err.message || err)
    process.exit(1)
  }
}

run()
