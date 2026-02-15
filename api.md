Base URL (local)

http://localhost:3000
Public

GET /
GET /api/theaters
GET /api/movies
GET /api/shows
User Auth

POST /api/users/signup
POST /api/users/login
GET /api/users/me (requires user token)
GET /api/users/:id
Bookings (User)

POST /api/bookings (requires user token)
GET /api/bookings/user (requires user token)
GET /api/bookings/invoice/:bookingId (requires user token)
Payments

POST /api/payments/razorpay/order (requires user token)
POST /api/payments/razorpay/verify (requires user token)
Admin Auth

POST /api/admin/login
Admin Movies

POST /api/admin/movies
GET /api/admin/movies
GET /api/admin/movies/:id
PUT /api/admin/movies/:id
DELETE /api/admin/movies/:id
Admin Shows

POST /api/admin/shows
GET /api/admin/shows
PUT /api/admin/shows/:id
DELETE /api/admin/shows/:id
Admin Theaters

GET /api/admin/theaters
POST /api/admin/theaters
PUT /api/admin/theaters/:id
DELETE /api/admin/theaters/:id
Admin Dashboard

GET /api/admin/dashboard
Admin Users & Bookings

GET /api/admin/users
GET /api/admin/bookings