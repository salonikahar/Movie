import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {type: String, required: true, ref: 'User'},
        show: {type: String, required: true, ref: 'Show'},
        amount: {type: Number, required: true},
        bookedSeats: {type: [String], required: true},
        isPaid: {type: Boolean, default: false},
        paymentMethod: {type: String, enum: ['razorpay'], default: 'razorpay'},
        paymentStatus: {type: String, enum: ['pending', 'completed', 'failed'], default: 'pending'},
        razorpayOrderId: {type: String, default: ''},
        razorpayPaymentId: {type: String, default: ''},
        bookingId: {type: String, unique: true}
    }, {timestamps: true, minimize: false}
)

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
