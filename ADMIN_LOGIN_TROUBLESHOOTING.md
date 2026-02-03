# Admin Login Troubleshooting Guide

## Common Issues and Solutions

### 1. "Admin account not found" Error

**Solution:** Run the seed script to create the admin account:

```bash
cd server
node seedAdmin.js
```

Expected output:
```
Cleared existing admin accounts
✓ Admin created successfully!
  Email: admin@gmail.com
  Password: admin@123
  ID: [admin_id]
```

### 2. "Server error" or Network Error

**Check:**
- Make sure the server is running on port 3000
- Check if MongoDB is connected
- Verify JWT_SECRET is set in `.env` file

**To check if admin exists:**
```bash
cd server
node checkAdmin.js
```

### 3. "Invalid credentials" Error

**Verify:**
- Email must be exactly: `admin@gmail.com`
- Password must be exactly: `admin@123`
- No extra spaces or characters

### 4. Environment Variables

Make sure your `server/.env` file contains:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 5. Database Connection

Ensure MongoDB is running and the connection string is correct in `.env`

## Admin Credentials

- **Email:** admin@gmail.com
- **Password:** admin@123

## Testing Steps

1. Start the server:
   ```bash
   cd server
   npm run server
   ```

2. Seed the admin (if not done):
   ```bash
   node seedAdmin.js
   ```

3. Check if admin exists:
   ```bash
   node checkAdmin.js
   ```

4. Start the client:
   ```bash
   cd client
   npm run dev
   ```

5. Navigate to `/admin/login` and use the credentials above



