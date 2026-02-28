# Movie Ticket Booking System - Client

A modern, responsive movie ticket booking web application built with React, Vite, and Tailwind CSS.

## Features

### User Features
- **Home Page**: Browse featured and now-playing movies
- **Movie Listing**: View all available movies with filtering
- **Movie Details**: View movie information, trailers, and showtimes
- **Theater Selection**: Choose preferred theater for a movie
- **Seat Selection**: Interactive seat layout with real-time availability
- **Booking & Checkout**: Secure checkout with Razorpay payment integration
- **User Dashboard**: View booking history, download invoices
- **Favorites**: Save favorite movies
- **Profile Management**: Update user profile information

### Admin Features
- **Dashboard**: View statistics and overview
- **Movie Management**: Add, edit, remove movies
- **Show Management**: Create and manage showtimes
- **Theater Management**: Manage theater details
- **User Management**: View and manage registered users
- **Booking Management**: View all bookings

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Authentication**: Clerk
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A running backend server (see server/README.md)

## Installation

1. Navigate to the client directory:
```
bash
cd client
```

2. Install dependencies:
```
bash
npm install
```

3. Create a `.env` file in the client root:
```
env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. Start the development server:
```
bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, dummy data
│   ├── components/        # Reusable UI components
│   │   ├── admin/         # Admin-specific components
│   │   ├── DateSelect.jsx
│   │   ├── FeaturedSection.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── MovieCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── TrailerSection.jsx
│   │   └── ...
│   ├── lib/               # Utility functions
│   │   ├── dateFormat.js
│   │   ├── imageUrl.js
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── Home.jsx
│   │   ├── Movies.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── SeatLayout.jsx
│   │   ├── Checkout.jsx
│   │   └── ...
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
└── vercel.json           # Vercel deployment config
```

## API Endpoints

The client communicates with the backend server at `VITE_API_URL`:

### Public Endpoints
- `GET /api/movies` - Get now-playing movies
- `GET /api/shows` - Get all shows
- `GET /api/theaters` - Get all theaters

### User Endpoints (Protected)
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/invoice/:bookingId` - Get booking invoice
- `POST /api/payments/razorpay/order` - Create payment order
- `POST /api/payments/razorpay/verify` - Verify payment

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/movies` - List all movies
- `POST /api/admin/movies` - Add movie
- `PUT /api/admin/movies/:id` - Update movie
- `DELETE /api/admin/movies/:id` - Delete movie
- `GET /api/admin/shows` - List all shows
- `POST /api/admin/shows` - Add show
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/users` - List all users
- `GET /api/admin/dashboard` - Get dashboard stats

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

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables for Production

Set these in your Vercel project settings:
- `VITE_API_URL` - Your production API URL
- `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

ISC
