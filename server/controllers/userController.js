import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// User signup
export const userSignup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate user ID
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create user
        const user = new User({
            _id: userId,
            name,
            email,
            password: hashedPassword,
            phone: phone || ''
        });

        await user.save();

        // Generate token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Return user data without password
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image
        };

        res.json({ success: true, message: 'User created successfully', user: userData, token });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// User login
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Return user data without password
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image
        };

        res.json({ success: true, message: 'Login successful', user: userData, token });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get current user (from token)
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}



