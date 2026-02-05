import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import axios from 'axios';

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { showId, bookedSeats } = req.body;
        const userId = req.userId;
        console.log('createRazorpayOrder - request', { showId, seats: bookedSeats?.length, userId });

        // Find the show to get the price
        // Some environments have mixed _id types for Show (string ids and ObjectIds).
        // Try a few lookup strategies so the API works regardless of the stored _id type.
        // Use raw collection lookup so we don't get blocked by schema _id type mismatches.
        // Try the literal id first (works for string _id), then try ObjectId if the id looks like one.
        let show = await Show.collection.findOne({ _id: showId });
        if (!show && typeof showId === 'string' && /^[0-9a-fA-F]{24}$/.test(showId)) {
            try {
                show = await Show.collection.findOne({ _id: new mongoose.Types.ObjectId(showId) });
            } catch (err) {
                // ignore — will return not found below
            }
        }
        if (!show) {
            console.warn('createRazorpayOrder - show lookup failed for id:', showId)
            return res.json({ success: false, message: 'Show not found' });
        }

        if (!Array.isArray(bookedSeats) || bookedSeats.length === 0) {
            return res.json({ success: false, message: 'Please select at least one seat' });
        }

        // Calculate amount
        const amount = show.showPrice * bookedSeats.length;
        const amountInPaise = Math.round(amount * 100); // Razorpay expects amount in paise

        // If Razorpay keys are configured, call Razorpay orders API
        const keyId = process.env.RAZORPAY_KEY_ID
        const keySecret = process.env.RAZORPAY_SECRET
        console.log('createRazorpayOrder - keys present', { keyId: Boolean(keyId), keySecret: Boolean(keySecret) });

        if (!keyId || !keySecret) {
            return res.json({ success: false, message: 'Razorpay keys are not configured on the server' });
        }

        try {
            const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
            const payload = {
                amount: amountInPaise,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                payment_capture: 1
            }
            console.log('createRazorpayOrder - calling Razorpay orders API', { amountInPaise });
            const resp = await axios.post('https://api.razorpay.com/v1/orders', payload, {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            })
            console.log('createRazorpayOrder - Razorpay order created', { id: resp.data?.id, amount: resp.data?.amount });
            return res.json({ success: true, order: resp.data })
        } catch (err) {
            console.error('Razorpay order creation failed:', {
                status: err?.response?.status,
                data: err?.response?.data,
                message: err?.message
            })
            return res.json({ success: false, message: 'Failed to create Razorpay order. Check server keys and Razorpay API status.' })
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Verify Razorpay payment
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, showId, bookedSeats } = req.body;
        const userId = req.userId;
        console.log('verifyRazorpayPayment - request', {
            razorpayOrderId,
            razorpayPaymentId,
            hasSignature: Boolean(razorpaySignature),
            showId,
            seats: bookedSeats?.length,
            userId
        });

        // Verify signature when secret is configured
        if (process.env.RAZORPAY_SECRET) {
            const generatedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_SECRET)
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest('hex')

            if (generatedSignature !== razorpaySignature) {
                console.warn('verifyRazorpayPayment - signature mismatch', {
                    generatedSignature,
                    razorpaySignature
                })
                return res.json({ success: false, message: 'Payment signature verification failed' })
            }
        } else {
            return res.json({ success: false, message: 'Razorpay secret is not configured on the server' })
        }

        // Find the show (try string id then ObjectId fallback for mixed DB states)
        // Raw lookup similar to create flow
        let show = await Show.collection.findOne({ _id: showId });
        if (!show && typeof showId === 'string' && /^[0-9a-fA-F]{24}$/.test(showId)) {
            try {
                show = await Show.collection.findOne({ _id: new mongoose.Types.ObjectId(showId) });
            } catch (err) {
                // ignore — will return not found below
            }
        }
        if (!show) {
            console.warn('verifyRazorpayPayment - show lookup failed for id:', showId)
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

        // Create booking
        const booking = new Booking({
            user: userId,
            show: showId,
            amount,
            bookedSeats,
            isPaid: true,
            paymentMethod: 'razorpay',
            paymentStatus: 'completed',
            razorpayOrderId,
            razorpayPaymentId,
            bookingId
        });

        await booking.save();

        // Update occupied seats in show using a raw collection update so the code works
        // whether the show document has a string _id or an ObjectId _id in the DB.
        const existing = show.occupiedSeats || {};
        const newOccupied = { ...existing };
        bookedSeats.forEach(seat => { newOccupied[seat] = userId });

        // Use the actual _id value returned by the collection lookup for the update query
        const showKey = show._id;
        console.log('paymentController - before collection.updateOne', { showKey, newOccupied })
        await Show.collection.updateOne({ _id: showKey }, { $set: { occupiedSeats: newOccupied } });
        const freshShow = await Show.collection.findOne({ _id: showKey });
        console.log('paymentController - after collection update occupied:', freshShow?.occupiedSeats)

        res.json({ success: true, booking, message: 'Payment successful and booking confirmed' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}



