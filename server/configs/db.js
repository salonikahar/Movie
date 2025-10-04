import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'));
        console.log('[db] connecting to', process.env.MONGODB_URI ? 'MONGODB_URI set' : 'MONGODB_URI missing');
        await mongoose.connect(`${process.env.MONGODB_URI}/bookmyscreen`, { serverSelectionTimeoutMS: 5000 })
        console.log('[db] connected');
    } catch (error) {
        console.log('[db] connection error:', error.message);
        throw error; // rethrow so startup fails fast
    }
}

export default connectDB;
