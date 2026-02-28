# Movie Ticket Booking System - Server

A robust backend API for a movie ticket booking system built with Express.js, MongoDB, and integrated payment processing.

## Features

### Core Features
- **User Authentication**: JWT-based authentication for users
- **Admin Authentication**: Simple admin login system
- **Movie Management**: CRUD operations for movies
- **Show Management**: Create and manage movie showtimes
- **Theater Management**: Manage theater information
- **Booking System**: Handle ticket bookings with seat selection
- **Payment Integration**: Razorpay payment gateway integration
- **Invoice Generation**: Generate booking invoices
- **Background Jobs**: Inngest integration for scheduled tasks
- **Image Upload**: Cloudinary integration for movie posters

### API Features
- RESTful API design
- CORS enabled
- JSON Web Token authentication
- Input validation
- Error handling
- Scheduled cleanup of past shows
- Automatic theater seeding

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Payment Gateway**: Razorpay
- **Image Storage**: Cloudinary
- **Background Jobs**: Inngest
- **Security**: bcrypt for password hashing
- **HTTP Client**: Axios
- **Development**: Nodemon for hot reloading

## Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to the server directory:
```
bash
cd server
```

2. Install dependencies:
```
bash
npm install
```

3. Create a `.env` file in the server root:
```
env
MONGODB_URI=mongodb://localhost:27017/movie-booking
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Seed initial data (optional):
```
bash
npm run seed
```

5. Start the development server:
```
bash
npm run server
```

The server will be available at `http://localhost:3000`

## Project Structure

```
server/
├── configs/
│   └── db.js              # Database connection configuration
├── controllers/
│   ├── adminController.js # Admin-related operations
│   ├── bookingController.js # Booking management
│   ├── paymentController.js # Payment processing
│   ├── showController.js  # Show/movie operations
│   └── userController.js  # User authentication
├── data/
│   └── theaters.js        # Initial theater data
├── inngest/
│   └── index.js           # Background job definitions
├── integration-tests/
│   └── razorpay_integration_test.js # Payment integration tests
├── migrations/
│   ├── normalize_show_ids.js
│   └── verify_normalize_show_ids.js
├── models/
│   ├── Admin.js           # Admin model
│   ├── Booking.js         # Booking model
│   ├── Movie.js           # Movie model
│   ├── Show.js            # Show model
│   ├── Theater.js         # Theater model
│   └── User.js            # User model
├── utils/
│   └── fetchDynamicMovies.js # Movie data fetching utility
├── public/                # Static files
├── package.json
├── server.js              # Main server file
├── vercel.json            # Vercel deployment config
└── seed*.js               # Data seeding scripts
```

## API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user (protected)
- `GET /api/users/:id` - Get user by ID
- `POST /api/admin/login` - Admin login

### Public Routes
- `GET /` - Server health check
- `GET /api/movies` - Get now-playing movies
- `GET /api/shows` - Get all shows
- `GET /api/theaters` - Get all theaters

### User Routes (JWT Protected)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user's bookings
- `GET /api/bookings/invoice/:bookingId` - Get booking invoice
- `POST /api/payments/razorpay/order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify Razorpay payment

### Admin Routes (Admin Protected)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/movies` - List all movies
- `POST /api/admin/movies` - Add new movie
- `GET /api/admin/movies/:id` - Get movie by ID
- `PUT /api/admin/movies/:id` - Update movie
- `DELETE /api/admin/movies/:id` - Delete movie
- `GET /api/admin/shows` - List all shows
- `POST /api/admin/shows` - Add new show
- `PUT /api/admin/shows/:id` - Update show
- `DELETE /api/admin/shows/:id` - Delete show
- `GET /api/admin/theaters` - List all theaters
- `POST /api/admin/theaters` - Add new theater
- `PUT /api/admin/theaters/:id` - Update theater
- `DELETE /api/admin/theaters/:id` - Delete theater
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/users` - List all users

## Database Models

### User
- `_id`: ObjectId
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `phone`: String
- `createdAt`: Date

### Admin
- `_id`: ObjectId
- `email`: String (unique)
- `password`: String (hashed)

### Movie
- `_id`: ObjectId
- `title`: String
- `description`: String
- `genre`: [String]
- `duration`: Number (minutes)
- `releaseDate`: Date
- `poster`: String (Cloudinary URL)
- `trailer`: String (YouTube URL)
- `rating`: Number
- `cast`: [String]
- `director`: String
- `language`: String

### Theater
- `_id`: String (custom ID)
- `name`: String
- `city`: String
- `location`: String
- `screens`: Number
- `facilities`: [String]

### Show
- `_id`: ObjectId
- `movie`: ObjectId (ref: Movie)
- `theater`: ObjectId (ref: Theater)
- `showDateTime`: Date
- `price`: Number
- `seats`: [[String]] (2D array for seat layout)
- `bookedSeats`: [String]

### Booking
- `_id`: ObjectId
- `user`: ObjectId (ref: User)
- `show`: ObjectId (ref: Show)
- `seats`: [String]
- `totalAmount`: Number
- `paymentStatus`: String (pending/success/failed)
- `razorpayOrderId`: String
- `razorpayPaymentId`: String
- `bookedAt`: Date

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## Scripts

- `npm run server` - Start server with nodemon (development)
- `npm start` - Start server with node (production)
- `npm run seed` - Seed all initial data
- `npm run seed:admin` - Seed admin user only

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```
bash
npm i -g vercel
```

2. Deploy:
```
bash
vercel
```

### Environment Variables for Production

Set these in your Vercel project settings or deployment environment.

## Testing

Run integration tests:
```
bash
node integration-tests/razorpay_integration_test.js
```

## License

ISC
