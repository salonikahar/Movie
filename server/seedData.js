import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import Show from './models/Show.js';
import 'dotenv/config';
import connectDB from './configs/db.js';
import dummyDateTimeData from '../client/src/assets/dummyDateTimeData.js';
import { fetchPopularMovies } from './utils/fetchDynamicMovies.js';

const seedData = async () => {
    await connectDB();
    try {
        // Fetch movies dynamically
        const dynamicMoviesData = await fetchPopularMovies();

        // Seed Movies dynamically
        for (const movieData of dynamicMoviesData) {
            const existingMovie = await Movie.findById(movieData._id);
            if (!existingMovie) {
                const movie = new Movie({
                    _id: movieData._id,
                    title: movieData.title,
                    overview: movieData.overview,
                    poster_path: movieData.poster_path,
                    backdrop_path: movieData.backdrop_path,
                    release_date: movieData.release_date,
                    original_language: movieData.original_language,
                    tagline: movieData.tagline,
                    genres: movieData.genres,
                    casts: movieData.casts,
                    crew: [], // Assuming no crew data in dynamic fetch
                    vote_average: movieData.vote_average,
                    runtime: movieData.runtime,
                });
                await movie.save();
                console.log(`Movie ${movieData.title} seeded`);
            }
        }

        // Seed Shows
        const baseDate = new Date();
        const dateKeys = Object.keys(dummyDateTimeData);
        for (const [index, [date, slots]] of dateKeys.entries()) {
            const showDate = new Date(baseDate.getTime() + index * 24 * 60 * 60 * 1000); // Each date is baseDate + index days
            for (const slot of slots) {
                const existingShow = await Show.findById(slot.showId);
                if (!existingShow) {
                    // Assign movie based on date index to use more movies
                    const movieId = dynamicMoviesData[index % dynamicMoviesData.length]._id;
                    const movie = await Movie.findById(movieId);
                    if (movie) {
                        const time = new Date(slot.time);
                        const showDateTime = new Date(showDate.getFullYear(), showDate.getMonth(), showDate.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
                        if (!isNaN(showDateTime.getTime())) {
                            const show = new Show({
                                _id: slot.showId,
                                movie: movieId, // Use string _id
                                showDateTime: showDateTime,
                                showPrice: 50, // Default price
                                occupiedSeats: {},
                                theater: slot.theaterId
                            });
                            await show.save();
                            console.log(`Show ${slot.showId} seeded for movie ${movieId} on ${showDateTime}`);
                        }
                    }
                }
            }
        }

        // Seed additional shows for all movies on upcoming dates for all theaters
        const upcomingDates = [];
        for (let i = 0; i < 14; i++) { // Next 14 days
            upcomingDates.push(new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000));
        }

        const theaters = ['theater1', 'theater2', 'theater3'];

        for (const movie of dynamicMoviesData) {
            for (const date of upcomingDates) {
                for (const theater of theaters) {
                    const showId = `${movie._id}_${date.toISOString().split('T')[0]}_${theater}`;
                    const existingShow = await Show.findById(showId);
                    if (!existingShow) {
                        const showDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0, 0); // 6 PM show
                        if (!isNaN(showDateTime.getTime())) {
                            const show = new Show({
                                _id: showId,
                                movie: movie._id,
                                showDateTime: showDateTime,
                                showPrice: 50,
                                occupiedSeats: {},
                                theater: theater
                            });
                            await show.save();
                            console.log(`Additional show ${showId} seeded for movie ${movie._id} on ${showDateTime} at ${theater}`);
                        }
                    }
                }
            }
        }

        console.log('Data seeded successfully');
    } catch (error) {
        console.log('Error seeding data:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

seedData();
