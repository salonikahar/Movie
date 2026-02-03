# Razorpay Payment Integration Setup

## Overview
The application now supports two payment methods:
1. **Cash on Delivery** - Pay at the theater
2. **Razorpay** - Online payment gateway

## Razorpay Setup Instructions

### 1. Get Razorpay Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test/Live API Keys
4. Copy your **Key ID** and **Key Secret**

### 2. Configure Environment Variables

#### Client Side (`.env` file in `client/` folder):
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

#### Server Side (`.env` file in `server/` folder):
```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_SECRET=your_razorpay_secret_here
```

### 3. Update Checkout.jsx

The Razorpay key is currently set to a test key. Update line in `client/src/pages/Checkout.jsx`:

```javascript
key: process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
```

Replace with your actual Razorpay Key ID from environment variable.

### 4. Payment Flow

#### Cash on Delivery:
- User selects "Cash on Delivery"
- Booking is created with `paymentStatus: 'pending'`
- User can view invoice
- Payment is made at theater

#### Razorpay:
- User selects "Razorpay"
- Order is created on Razorpay
- Payment popup opens
- After successful payment, booking is confirmed
- Invoice is automatically shown

If you configure `RAZORPAY_KEY_ID` and `RAZORPAY_SECRET` on the server the app will use the real Razorpay orders API and will verify the payment signature returned by Razorpay. If you don't provide keys the server falls back to the development/simulated flow.

Important client-side note: Checkout now reads the public key from the Vite runtime via `import.meta.env.VITE_RAZORPAY_KEY_ID`. Make sure to restart your dev server after setting the client env variable so Vite picks up the new value.

## Invoice Features

- **View Invoice**: Click "View Invoice" button in My Bookings
- **Download Invoice**: Click "Download Invoice" button on invoice page
- Invoice includes:
  - Booking ID
  - Customer details
  - Movie and show details
  - Seat numbers
  - Payment status
  - Total amount

## Testing

### Test Mode:
- Use Razorpay test keys
- Test card: 4111 1111 1111 1111
- Any future expiry date
- Any CVV

### Live demo: run a real Razorpay test payment locally

These steps will run a real Razorpay test order and allow you to complete checkout using a Razorpay test card. You'll need test keys from the Razorpay dashboard.

1) Set environment variables for the server and client (PowerShell):

```powershell
# Server (reload server after setting env vars)
$env:RAZORPAY_KEY_ID='rzp_test_XXXXXXXXXXXXXXXX'
$env:RAZORPAY_SECRET='your_razorpay_secret_here'
$env:JWT_SECRET='a-strong-jwt-secret-for-testing'

# Client (Vite runtime) - create client/.env or export before Vite starts
$env:VITE_RAZORPAY_KEY_ID='rzp_test_XXXXXXXXXXXXXXXX'
```

2) (IMPORTANT) Restart your server and your client dev server so both pick up new env vars.

3) Open the app in the browser, sign in with a user (or create one), pick a movie + show and proceed to checkout.

4) At the Razorpay checkout modal use the Razorpay test card details (example):

 - Card: 4111 1111 1111 1111
 - Expiry: any future date (eg 12/29)
 - CVV: 123

5) After payment completes the frontend will call `/api/payments/razorpay/verify`. Because the server has RAZORPAY_SECRET configured it will verify the signature and create a booking.

6) You can view the invoice in the app UI or call the server endpoint directly using your token:

GET /api/bookings/invoice/:bookingId

Example to fetch invoice (PowerShell / curl):

```powershell
# Example: fetch invoice JSON using a saved token (replace <token> and <bookingId>)
Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/invoice/<bookingId>" -Headers @{ Authorization = "Bearer <token>" } -UseBasicParsing | ConvertTo-Json -Depth 3
```

7) Optionally run the integration test script (real-order + computed signature)

From project root (PowerShell), you can run the integration test which will:
 - Signup/login
 - Create a real order on Razorpay (because server has keys)
 - The script will compute the correct signature if you pass RAZORPAY_SECRET into the script and call /verify

```powershell
$env:RAZORPAY_SECRET='your_razorpay_secret_here'; node server/integration-tests/razorpay_integration_test.js
```

Security & notes:
- These are test-mode keys and transactions — no real money flows.
- Keep your test keys private (don't commit them to git).
- For production use live keys and follow Razorpay's security guides.

### Integration test script (example)

An example Node test script is included at `server/integration-tests/razorpay_integration_test.js`. It performs the full cycle using the server endpoints:

- signup -> login -> create order -> verify payment -> assert booking & show occupancy

How to run:

1. Ensure server is running on http://localhost:3000
2. From project root (PowerShell / terminal):

```powershell
# (optional) provide RAZORPAY_SECRET if you want the script to compute a real signature
RAZORPAY_SECRET=your_razorpay_secret node server/integration-tests/razorpay_integration_test.js

# If you don't provide RAZORPAY_SECRET the script will use a simulated signature and exercise the fallback flow
node server/integration-tests/razorpay_integration_test.js
```

Notes:
- If the server has RAZORPAY_KEY_ID and RAZORPAY_SECRET configured, the script will create a real order on Razorpay (test mode) and will compute the signature locally (if you pass RAZORPAY_SECRET to the script) to verify with the server.
- If keys are not present the server will fallback to a simulated order and the script will also proceed using simulated values.

### Production:
- Switch to live keys
- Update environment variables
- Test with real payment methods

## Notes

- Cash on Delivery bookings show as "Payment Pending"
- Razorpay bookings are automatically marked as "Paid"
- All bookings generate an invoice
- Invoice can be downloaded/printed



