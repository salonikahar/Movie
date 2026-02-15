import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        city: { type: String, required: true },
        location: { type: String, required: true },
        screens: { type: Number, default: 1 },
        facilities: { type: Array, default: [] }
    },
    { timestamps: true }
);

const Theater = mongoose.model('Theater', theaterSchema, 'theaters');
export default Theater;
