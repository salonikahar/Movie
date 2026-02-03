#!/usr/bin/env node
import connectDB from '../configs/db.js'
import mongoose from 'mongoose'

async function run() {
  await connectDB()
  const db = mongoose.connection.db
  const showsCol = db.collection('shows')
  const bookingsCol = db.collection('bookings')

  const nonStringShows = await showsCol.countDocuments({ $expr: { $ne: [ { $type: '$_id' }, 'string' ] } })
  const nonStringBookings = await bookingsCol.countDocuments({ $expr: { $ne: [ { $type: '$show' }, 'string' ] } })

  console.log('nonStringShows=', nonStringShows)
  console.log('nonStringBookings=', nonStringBookings)
  process.exit(0)
}

run().catch(err => {
  console.error('verify script failed:', err)
  process.exit(1)
})
