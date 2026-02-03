import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import Show from './models/Show.js';
import User from './models/User.js';
import Booking from './models/Booking.js';
import Admin from './models/Admin.js';
import 'dotenv/config';
import connectDB from './configs/db.js';

const clearData = async () => {
    try {
        await connectDB();
        console.log('Clearing all data...\n');

        // Clear all collections
        await Movie.deleteMany({});
        console.log('✓ Cleared Movies');

        await Show.deleteMany({});
        console.log('✓ Cleared Shows');

        await User.deleteMany({});
        console.log('✓ Cleared Users');

        await Booking.deleteMany({});
        console.log('✓ Cleared Bookings');

        await Admin.deleteMany({});
        console.log('✓ Cleared Admins');

        console.log('\n✅ All data cleared successfully!');
    } catch (error) {
        console.error('✗ Error clearing data:', error.message);
    } finally {
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
};

clearData();
