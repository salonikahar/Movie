import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import 'dotenv/config';
import connectDB from './configs/db.js';

const checkPaths = async () => {
    await connectDB();
    try {
        const movies = await Movie.find({}, 'title poster_path backdrop_path');
        console.log('--- Suspicious Movie Image Paths ---');
        let found = false;
        movies.forEach(m => {
            if (m.poster_path && !m.poster_path.startsWith('http')) {
                console.log(`Title: ${m.title}`);
                console.log(`  Poster: ${m.poster_path}`);
                found = true;
            }
            if (m.backdrop_path && !m.backdrop_path.startsWith('http')) {
                console.log(`Title: ${m.title}`);
                console.log(`  Backdrop: ${m.backdrop_path}`);
                found = true;
            }
        });
        if (!found) console.log("No non-http paths found.");
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};

checkPaths();
