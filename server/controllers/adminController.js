import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import Admin from '../models/Admin.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Add a new movie
export const addMovie = async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.json({ success: true, message: 'Movie added successfully', movie });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update a movie
export const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!movie) {
            return res.json({ success: false, message: 'Movie not found' });
        }
        res.json({ success: true, message: 'Movie updated successfully', movie });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Remove a movie
export const removeMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByIdAndDelete(id);
        if (!movie) {
            return res.json({ success: false, message: 'Movie not found' });
        }
        res.json({ success: true, message: 'Movie removed successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Add a new show
export const addShow = async (req, res) => {
    try {
        const { movie, showDateTime, showPrice, theater } = req.body;
        
        // Generate show ID if not provided
        const showId = `show_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const show = new Show({
            _id: showId,
            movie,
            showDateTime: new Date(showDateTime),
            showPrice: parseFloat(showPrice),
            // Default to existing theater id - theater IDs are like 'theater1'
            theater: theater || 'theater1',
            occupiedSeats: {}
        });
        
        await show.save();
        res.json({ success: true, message: 'Show added successfully', show });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update a show
export const updateShow = async (req, res) => {
    try {
        const { id } = req.params;
        const show = await Show.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!show) {
            return res.json({ success: false, message: 'Show not found' });
        }
        res.json({ success: true, message: 'Show updated successfully', show });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Remove a show
export const removeShow = async (req, res) => {
    try {
        const { id } = req.params;
        await Show.findByIdAndDelete(id);
        res.json({ success: true, message: 'Show removed successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get all movies for admin
export const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find({}).sort({ createdAt: -1 });
        res.json({ success: true, movies });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get single movie by ID
export const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.json({ success: false, message: 'Movie not found' });
        }
        res.json({ success: true, movie });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get all shows for admin
export const getAllShows = async (req, res) => {
    try {
        const now = new Date();
        const bookedShowIds = await Booking.distinct('show');
        await Show.deleteMany({
            showDateTime: { $lt: now },
            _id: { $nin: bookedShowIds }
        });
        const shows = await Show.find({})
            .populate({
                path: 'movie',
                model: 'Movie'
            })
            .sort({ showDateTime: 1 });

        res.json({ success: true, shows });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Admin login - Simple password check
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required' });
        }
        
        // Only allow admin@gmail.com
        if (email !== 'admin@gmail.com') {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
        
        // Find admin
        const admin = await Admin.findOne({ email: 'admin@gmail.com' });
        if (!admin) {
            return res.json({ 
                success: false, 
                message: 'Admin account not found. Please run: node seedAdmin.js' 
            });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }
        
        // Simple success response - no token needed
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Admin login error:', error);
        res.json({ success: false, message: error.message || 'Internal server error' });
    }
}

// Get all bookings for admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate({
                path: 'show',
                populate: { path: 'movie', model: 'Movie' }
            })
            .populate('user')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.json({ success: false, message: error.message });
    }
}

// Get all users for admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments({});
        const totalRevenue = await Booking.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalUsers = await User.countDocuments({});
        const totalMovies = await Movie.countDocuments({});
        const activeMovies = await Movie.countDocuments({ isActive: true });
        const inactiveMovies = await Movie.countDocuments({ isActive: false });
        const today = new Date().toISOString().split('T')[0];
        const upcomingMovies = await Movie.countDocuments({ release_date: { $gte: today } });
        const releasedMovies = Math.max(0, totalMovies - upcomingMovies);
        const activeShows = await Show.find({})
            .populate('movie')
            .sort({ showDateTime: 1 })
            .limit(6);

        res.json({
            success: true,
            stats: {
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                totalUsers,
                totalMovies,
                activeMovies,
                inactiveMovies,
                upcomingMovies,
                releasedMovies,
                activeShows
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
