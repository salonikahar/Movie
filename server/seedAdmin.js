import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from './models/Admin.js';
import 'dotenv/config';
import connectDB from './configs/db.js';

const seedAdmin = async () => {
    try {
        await connectDB();
        
        // Delete all existing admins first
        await Admin.deleteMany({});
        console.log('Cleared existing admin accounts');
        
        // Create the only allowed admin
        const hashedPassword = await bcrypt.hash('admin@123', 10);
        const admin = new Admin({
            email: 'admin@gmail.com',
            password: hashedPassword
        });
        await admin.save();
        console.log('✓ Admin created successfully!');
        console.log('  Email: admin@gmail.com');
        console.log('  Password: admin@123');
        console.log('  ID:', admin._id);
    } catch (error) {
        console.error('✗ Error seeding admin:', error.message);
        console.error(error);
    } finally {
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
};

seedAdmin();
