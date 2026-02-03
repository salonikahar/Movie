import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import 'dotenv/config';
import connectDB from './configs/db.js';

const checkAdmin = async () => {
    try {
        await connectDB();
        const admin = await Admin.findOne({ email: 'admin@gmail.com' });
        if (admin) {
            console.log('✓ Admin account exists');
            console.log('  Email:', admin.email);
            console.log('  ID:', admin._id);
        } else {
            console.log('✗ Admin account not found');
            console.log('  Please run: node seedAdmin.js');
        }
        mongoose.connection.close();
    } catch (error) {
        console.error('Error checking admin:', error.message);
        mongoose.connection.close();
    }
};

checkAdmin();



