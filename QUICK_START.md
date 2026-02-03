# Quick Start Guide

## Your MongoDB URI
```
mongodb://localhost:27017/bookmyscreen
```

## Step-by-Step Setup

### 1. Create Environment File (Server)
Create `server/.env` file with:
```env
MONGODB_URI=mongodb://localhost:27017/bookmyscreen
JWT_SECRET=bookmyscreen_secret_key_2024
```

### 2. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 3. Seed Database

**Seed Admin:**
```bash
cd server
npm run seed:admin
```

**Seed All Data:**
```bash
cd server
npm run seed
```

### 4. Run Project

**Terminal 1 - Server:**
```bash
cd server
npm run server
```
✅ Server runs on: http://localhost:3000

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```
✅ Client runs on: http://localhost:5173

## Access Points

### User Side
- URL: http://localhost:5173
- Sign up/Login to book tickets

### Admin Panel
- URL: http://localhost:5173/admin/login
- Email: `admin@gmail.com`
- Password: `admin@123`

## Sample User Accounts
- john@example.com / password123
- jane@example.com / password123
- mike@example.com / password123

## Windows Quick Run
Double-click `run.bat` in the project root to start both server and client automatically.

