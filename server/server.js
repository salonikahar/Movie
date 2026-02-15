import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import jwt from 'jsonwebtoken';
import theatersData from './data/theaters.js';
import Show from './models/Show.js';
import Theater from './models/Theater.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server/.env regardless of cwd
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = 3000;



await connectDB()

// Seed theaters into DB if empty
const ensureTheatersSeed = async () => {
    try {
        await Theater.createCollection();
        const count = await Theater.countDocuments();
        if (count === 0) {
            await Theater.insertMany(theatersData);
        }
        console.log(`🎭 Theaters collection ready in DB: ${count === 0 ? theatersData.length : count} records`);
    } catch (error) {
        console.error('Failed to seed theaters:', error);
    }
};

await ensureTheatersSeed();

// Scheduled cleanup for past shows (runs every 30 minutes)
const cleanupPastShows = async () => {
    try {
        const now = new Date();
        await Show.deleteMany({ showDateTime: { $lt: now } });
    } catch (error) {
        console.error('Failed to cleanup past shows:', error);
    }
};

cleanupPastShows();
setInterval(cleanupPastShows, 30 * 60 * 1000);

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
// Removed clerkMiddleware() - using custom authentication instead

// Simple admin auth - just check if admin is logged in (no token verification)
const adminAuth = (req, res, next) => {
    // No server-side security - just allow access
    // Security is handled client-side only
    next();
}

// JWT middleware for user routes
const userAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied' });
    }
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ success: false, message: 'Server configuration error' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
}



//API Routes
app.get('/', (req, res) => res.send('Server is Live!'))
// Inngest route (optional - only used if Clerk events are configured)
// app.use('/api/inngest', serve({ client: inngest, functions}))
app.get('/api/theaters', async (req, res) => {
    try {
        const theaters = await Theater.find({}).sort({ createdAt: -1 });
        res.json({ success: true, theaters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

import { getNowPlayingMovies, getShows } from './controllers/showController.js';
import { addMovie, removeMovie, updateMovie, addShow, updateShow, removeShow, getAllMovies, getMovieById, getAllShows, adminLogin, getAllBookings, getAllUsers, getDashboardStats } from './controllers/adminController.js';
import { createBooking, getUserBookings, getBookingInvoice } from './controllers/bookingController.js';
import { createRazorpayOrder, verifyRazorpayPayment } from './controllers/paymentController.js';
import { userSignup, userLogin, getUserById, getCurrentUser } from './controllers/userController.js';

// User authentication routes
app.post('/api/users/signup', userSignup);
app.post('/api/users/login', userLogin);
app.get('/api/users/me', userAuth, getCurrentUser);
app.get('/api/users/:id', getUserById);

// Public routes
app.get('/api/movies', getNowPlayingMovies);
app.get('/api/shows', getShows);

// Protected user routes
app.post('/api/bookings', userAuth, createBooking);
app.get('/api/bookings/user', userAuth, getUserBookings);
app.get('/api/bookings/invoice/:bookingId', userAuth, getBookingInvoice);

// Payment routes
app.post('/api/payments/razorpay/order', userAuth, createRazorpayOrder);
app.post('/api/payments/razorpay/verify', userAuth, verifyRazorpayPayment);

// Admin authentication routes (no auth required)
// Only admin@gmail.com can login
app.post('/api/admin/login', adminLogin);

// Admin theaters routes (in-memory)
app.get('/api/admin/theaters', adminAuth, async (req, res) => {
    try {
        const theaters = await Theater.find({}).sort({ createdAt: -1 });
        res.json({ success: true, theaters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/admin/theaters', adminAuth, async (req, res) => {
    try {
        const { name, city, location, screens, facilities } = req.body || {};
        if (!name || !city || !location) {
            return res.status(400).json({ success: false, message: 'Name, city, and location are required' });
        }

        const normalizedFacilities = Array.isArray(facilities)
            ? facilities
            : String(facilities || '')
                .split(',')
                .map(item => item.trim())
                .filter(Boolean);

        const newTheater = new Theater({
            _id: `theater_${Date.now()}`,
            name: String(name).trim(),
            city: String(city).trim(),
            location: String(location).trim(),
            screens: Number.isFinite(Number(screens)) ? Number(screens) : 1,
            facilities: normalizedFacilities
        });

        await newTheater.save();
        res.json({ success: true, theater: newTheater });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/admin/theaters/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, city, location, screens, facilities } = req.body || {};
        const normalizedFacilities = Array.isArray(facilities)
            ? facilities
            : String(facilities || '')
                .split(',')
                .map(item => item.trim())
                .filter(Boolean);

        const update = {
            ...(name ? { name: String(name).trim() } : {}),
            ...(city ? { city: String(city).trim() } : {}),
            ...(location ? { location: String(location).trim() } : {}),
            ...(screens !== undefined ? { screens: Number.isFinite(Number(screens)) ? Number(screens) : 1 } : {}),
            ...(facilities !== undefined ? { facilities: normalizedFacilities } : {})
        };

        const theater = await Theater.findByIdAndUpdate(id, update, { new: true, runValidators: true });
        if (!theater) {
            return res.status(404).json({ success: false, message: 'Theater not found' });
        }
        res.json({ success: true, theater });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/admin/theaters/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const removed = await Theater.findByIdAndDelete(id);
        if (!removed) {
            return res.status(404).json({ success: false, message: 'Theater not found' });
        }
        res.json({ success: true, theater: removed });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin routes (protected)
app.post('/api/admin/movies', adminAuth, addMovie);
app.get('/api/admin/movies', adminAuth, getAllMovies);
app.get('/api/admin/movies/:id', adminAuth, getMovieById);
app.put('/api/admin/movies/:id', adminAuth, updateMovie);
app.delete('/api/admin/movies/:id', adminAuth, removeMovie);
app.post('/api/admin/shows', adminAuth, addShow);
app.put('/api/admin/shows/:id', adminAuth, updateShow);
app.delete('/api/admin/shows/:id', adminAuth, removeShow);
app.get('/api/admin/shows', adminAuth, getAllShows);
app.get('/api/admin/bookings', adminAuth, getAllBookings);
app.get('/api/admin/users', adminAuth, getAllUsers);
app.get('/api/admin/dashboard', adminAuth, getDashboardStats);


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
