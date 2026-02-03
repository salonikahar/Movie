import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import jwt from 'jsonwebtoken';
import theaters from './data/theaters.js';

const app = express();
const port = 3000;



await connectDB()

// Middleware
app.use(express.json());
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
app.get('/api/theaters', (req, res) => {
    res.json({ success: true, theaters });
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