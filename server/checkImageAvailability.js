import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import 'dotenv/config';
import connectDB from './configs/db.js';
import fetch from 'node-fetch';

const checkImages = async () => {
    await connectDB();
    try {
        const movies = await Movie.find({});
        console.log('Checking image availability...');

        for (const movie of movies) {
            if (movie.poster_path && movie.poster_path.startsWith('http')) {
                try {
                    const res = await fetch(movie.poster_path, { method: 'HEAD' });
                    if (!res.ok) {
                        console.log(`[BROKEN] ${movie.title} - Poster: ${movie.poster_path} (${res.status})`);
                    } else {
                        // console.log(`[OK] ${movie.title}`);
                    }
                } catch (e) {
                    console.log(`[ERROR] ${movie.title} - Poster: ${e.message}`);
                }
            }

            if (movie.backdrop_path && movie.backdrop_path.startsWith('http')) {
                try {
                    const res = await fetch(movie.backdrop_path, { method: 'HEAD' });
                    if (!res.ok) {
                        console.log(`[BROKEN] ${movie.title} - Backdrop: ${movie.backdrop_path} (${res.status})`);
                    }
                } catch (e) {
                    console.log(`[ERROR] ${movie.title} - Backdrop: ${e.message}`);
                }
            }
        }
        console.log('Check complete.');
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};

checkImages();
