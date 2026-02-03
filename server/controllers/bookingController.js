import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';

export const createBooking = async (req, res) => {
    try {
        const { showId, bookedSeats, paymentMethod } = req.body;
        const userId = req.userId; // Get from authenticated token

        // Find the show to get the price
        const show = await Show.findById(showId);
        if (!show) {
            return res.json({ success: false, message: 'Show not found' });
        }

        // Check if seats are already occupied
        const occupiedSeats = Object.keys(show.occupiedSeats);
        const conflictingSeats = bookedSeats.filter(seat => occupiedSeats.includes(seat));
        if (conflictingSeats.length > 0) {
            return res.json({ success: false, message: `Seats ${conflictingSeats.join(', ')} are already booked` });
        }

        // Calculate amount
        const amount = show.showPrice * bookedSeats.length;

        // Generate booking ID
        const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        // Only Razorpay payments are allowed
        if (paymentMethod && paymentMethod !== 'razorpay') {
            return res.json({ success: false, message: 'Only online payment is accepted' });
        }

        const isPaid = true; // All bookings must be paid via Razorpay
        const paymentStatus = 'completed';

        // Create booking
        const booking = new Booking({
            user: userId,
            show: showId,
            amount,
            bookedSeats,
            isPaid,
            paymentMethod: 'razorpay',
            paymentStatus,
            bookingId
        });

        await booking.save();

        // Update occupied seats in show in a way that reliably persists nested keys
        const existing = show.occupiedSeats || {};
        const newOccupied = { ...existing };
        bookedSeats.forEach(seat => {
            newOccupied[seat] = userId;
        });
        show.occupiedSeats = newOccupied;
        await show.save();

        res.json({ success: true, booking, message: paymentMethod === 'cash_on_delivery' ? 'Booking confirmed. Pay at theater.' : 'Booking confirmed' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get booking invoice
export const getBookingInvoice = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.userId;

        const booking = await Booking.findOne({ bookingId, user: userId })
            .populate({
                path: 'show',
                populate: { path: 'movie' }
            })
            .populate('user');

        if (!booking) {
            return res.json({ success: false, message: 'Booking not found' });
        }

        res.json({ success: true, booking });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getUserBookings = async (req, res) => {
    try {
        const userId = req.userId; // Get from authenticated token
        const bookings = await Booking.find({ user: userId }).populate({
            path: 'show',
            populate: { path: 'movie' }
        });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
