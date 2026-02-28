

import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';

export const getNowPlayingMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ isActive: true });
        res.json({ success: true, movies });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getShows = async (req, res) => {
    try {
        const now = new Date();
        const bookedShowIds = await Booking.distinct('show');
        await Show.deleteMany({
            showDateTime: { $lt: now },
            _id: { $nin: bookedShowIds }
        });
        // Return show documents as they are (movie stored as string id)
        // Client code expects movie to be an id string and filters locally.
        const shows = await Show.find({});
        res.json({ success: true, shows });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
