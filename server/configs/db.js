import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        // Use provided URI or default
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmyscreen';
        mongoose.connection.on('connected', () => console.log('✅ Database Connected'));
        await mongoose.connect(mongoURI);
        console.log(`📦 Connected to MongoDB: ${mongoURI}`);
    } catch (error) {
        console.log('❌ Database connection error:', error.message);
    }
}

export default connectDB;
