# How to Run BookMyScreen Project

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Step 1: Environment Setup

### Server Environment Variables
Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb://localhost:27017
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

JWT_SECRET=your_secret_key_here_any_random_string

# Optional: Razorpay (for payment)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

### Client Environment Variables
Create a `.env` file in the `client/` directory (optional):

```env
VITE_CURRENCY=₹
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Step 2: Install Dependencies

### Install Server Dependencies
```bash
cd server
npm install
```

### Install Client Dependencies
```bash
cd client
npm install
```

## Step 3: Seed Database

### Seed Admin Account
```bash
cd server
npm run seed:admin
```

### Seed All Data (Movies, Shows, Users, Bookings)
```bash
cd server
npm run seed
```

## Step 4: Run the Project

### Terminal 1: Start Server
```bash
cd server
npm run server
```
Server will run on: `http://localhost:3000`

### Terminal 2: Start Client
```bash
cd client
npm run dev
```
Client will run on: `http://localhost:5173` (or similar Vite port)

## Step 5: Access the Application

### User Side
- Open: `http://localhost:5173`
- Browse movies, book tickets, view bookings

## Quick test: End-to-end booking flow

1. Open the site in your browser (example: http://localhost:5173)
2. Login with a seeded test user (see Default Credentials):
	- Email: john@example.com / Password: password123
3. Open a movie -> Click "Buy Tickets" -> choose a theater -> pick a date -> pick a showtime
4. Select up to 5 seats, proceed to Checkout
5. On checkout click "Pay Now" — by default the app will simulate order creation and verification (Razorpay SDK loaded on the client, the server returns a fake order and verify endpoint creates a booking)
6. After success you'll be redirected to the invoice page; you can also view user bookings at: /my-bookings (or GET /api/bookings/user)

Notes:
- If using real Razorpay keys set VITE_RAZORPAY_KEY_ID and RAZORPAY_SECRET accordingly in client/server .env
- The dev verify endpoint currently skips signature verification to allow local testing. Treat this as a dev-only behaviour.

### Admin Side
- Open: `http://localhost:5173/admin/login`
- Email: `admin@gmail.com`
- Password: `admin@123`

## Quick Start Script (Windows PowerShell)

Save this as `run.ps1` in the project root:

```powershell
# Start Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run server"

# Wait a bit for server to start
Start-Sleep -Seconds 3

# Start Client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"
```

Run with: `.\run.ps1`

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in server/.env
- For local MongoDB: `mongodb://localhost:27017`

### Port Already in Use
- Server: Change port in `server/server.js` (default: 3000)
- Client: Vite will automatically use next available port

### Module Not Found
- Run `npm install` in both server and client directories
- Delete `node_modules` and `package-lock.json`, then reinstall

### Database Not Seeded
- Run `npm run seed:admin` first
- Then run `npm run seed` for all data

## Default Credentials

### Admin
- Email: `admin@gmail.com`
- Password: `admin@123`

### Sample Users
- Email: `john@example.com` / Password: `password123`
- Email: `jane@example.com` / Password: `password123`
- Email: `mike@example.com` / Password: `password123`

