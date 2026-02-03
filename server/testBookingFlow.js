import axios from 'axios';

const API = 'http://localhost:3000';

async function run() {
  try {
    console.log('1) Fetching movies...')
    const moviesRes = await axios.get(`${API}/api/movies`);
    if (!moviesRes.data.success) throw new Error('Failed to get movies')
    const movie = moviesRes.data.movies[0];
    console.log('  movie:', movie._id, movie.title)

    console.log('2) Fetching shows...')
    const showsRes = await axios.get(`${API}/api/shows`);
    if (!showsRes.data.success) throw new Error('Failed to get shows')
    const shows = showsRes.data.shows;

    const show = shows.find(s => (typeof s.movie === 'string' ? s.movie : s.movie?._id) === movie._id)
    if (!show) throw new Error('No show found for movie')
    console.log('  chosen show:', show._id, 'theater:', show.theater, 'price:', show.showPrice)

    // login seeded user
    console.log('3) Logging in seeded user...')
    const loginRes = await axios.post(`${API}/api/users/login`, { email: 'john@example.com', password: 'password123' });
    if (!loginRes.data.success) throw new Error('Login failed: ' + loginRes.data.message)
    const token = loginRes.data.token
    console.log('  got token length:', token.length)

    // create order
    console.log('4) Create Razorpay order (simulated)')
    const bookedSeats = ['A1','A2']
    const orderRes = await axios.post(`${API}/api/payments/razorpay/order`, { showId: show._id, bookedSeats }, { headers: { Authorization: `Bearer ${token}` } })
    if (!orderRes.data.success) throw new Error('Order creation failed: ' + orderRes.data.message)
    const order = orderRes.data.order
    console.log('  order returned:', order.id, 'amount:', order.amount)

    // verify payment -> should create booking and mark seats
    console.log('5) Verify payment (simulated)')
    const verifyRes = await axios.post(`${API}/api/payments/razorpay/verify`, { razorpayOrderId: order.id, razorpayPaymentId: `pay_${Date.now()}`, razorpaySignature: 'fake_signature', showId: show._id, bookedSeats }, { headers: { Authorization: `Bearer ${token}` } })
    if (!verifyRes.data.success) throw new Error('Verify failed: ' + verifyRes.data.message)
    const booking = verifyRes.data.booking
    console.log('  booking id:', booking.bookingId, 'amount:', booking.amount)

    // confirm booking appears in user's bookings
    console.log('6) Fetching user bookings...')
    const userBookings = await axios.get(`${API}/api/bookings/user`, { headers: { Authorization: `Bearer ${token}` } })
    console.log('  total bookings for user:', userBookings.data.bookings.length)

    // confirm show occupied seats updated
    const freshShowRes = await axios.get(`${API}/api/shows`)
    const updatedShow = freshShowRes.data.shows.find(s => s._id === show._id)
    console.log('7) Occupied seats on show after booking:', Object.keys(updatedShow.occupiedSeats || {}).slice(0,20))

    console.log('\nTEST COMPLETED SUCCESSFULLY')
  } catch (err) {
    console.error('Error during E2E test:', err.message || err)
    process.exitCode = 1
  }
}

run()
