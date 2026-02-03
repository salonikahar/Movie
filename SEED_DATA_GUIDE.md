# Seed Data Guide

## Overview
This guide explains how to populate your database with sample data for testing.

## Available Seed Scripts

### 1. Seed All Data (Recommended)
This script seeds movies, users, shows, and bookings.

```bash
cd server
npm run seed
```

**What it adds:**
- 5 sample movies (Avengers, Spider-Man, Dark Knight, Inception, Interstellar)
- 3 sample users
- Shows for next 7 days across 3 theaters with 4 showtimes each
- Sample bookings for testing

### 2. Seed Admin Only
Creates the admin account.

```bash
cd server
npm run seed:admin
```

**What it adds:**
- Admin account: `admin@gmail.com` / `admin@123`

## Sample User Credentials

After running `npm run seed`, you can login with:

1. **Email:** john@example.com  
   **Password:** password123

2. **Email:** jane@example.com  
   **Password:** password123

3. **Email:** mike@example.com  
   **Password:** password123

## Sample Data Details

### Movies
- Avengers: Endgame
- Spider-Man: No Way Home
- The Dark Knight
- Inception
- Interstellar

### Shows
- **Duration:** Next 7-14 days (seed scripts may generate up to 14 days)
- **Theaters:** theater1, theater2, theater3
- **Showtimes:** several slots per day (e.g., 10:00, 12:00, 14:00, 16:00, 18:00, 21:00) depending on the seed script
- **Price:** dynamic — scripts set reasonable defaults per time of day (morning/afternoon/evening)

### Bookings
- Sample bookings are created for testing
- All bookings are marked as paid via Razorpay
- Includes invoice-ready booking IDs

## Usage

1. **First Time Setup:**
   ```bash
   # From the server folder run (PowerShell / cmd):
   cd server; npm run seed:admin   # creates admin account
   cd server; npm run seed         # seeds movies, shows, users and sample bookings
   ```

2. **Reset Data:**
   - Delete existing data from MongoDB
   - Run seed scripts again

3. **Add More Data:**
   - Use admin panel to add movies
   - Use "Add Shows" to create more showtimes
   - Users can register new accounts

## Notes

- Seed scripts check for existing data and skip duplicates
- All passwords are hashed using bcrypt
- Shows are created for the next 7–14 days from current date depending on which seed script you run
- Sample bookings include real booking IDs for invoice testing



