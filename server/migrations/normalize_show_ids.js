#!/usr/bin/env node
/**
 * Normalize show _ids to strings.
 *
 * Usage:
 *  # Dry run (default) - shows what would change
 *  node server/migrations/normalize_show_ids.js
 *
 *  # To apply changes (destructive) set APPLY=1
 *  APPLY=1 node server/migrations/normalize_show_ids.js
 *
 * The script will:
 *  - Find `shows` documents whose _id is not a string (usually Mongo ObjectId)
 *  - For each such show it will create a new document with _id set to the hex string of the ObjectId
 *    unless a target doc already exists in which case it will reuse the target.
 *  - Update `bookings` documents that point to the old id to the new string id
 *  - Delete the old show document
 *
 * The script is idempotent and prints a summary. Always run without APPLY first (dry-run).
 */

import connectDB from '../configs/db.js'
import mongoose from 'mongoose'

async function run() {
  await connectDB()

  const db = mongoose.connection.db
  const showsCol = db.collection('shows')
  const bookingsCol = db.collection('bookings')

  const apply = !!process.env.APPLY

  console.log('\nNormalize Show _ids — dry-run by default')
  if (apply) console.log('Running in APPLY mode — changes will be applied')

  const cursor = showsCol.find({})
  let total = 0
  let candidates = []

  while (await cursor.hasNext()) {
    const doc = await cursor.next()
    total++

    if (typeof doc._id === 'string') continue

    // non-string id (likely ObjectId)
    const oldId = doc._id
    const newId = oldId.toString()

    // If newId === oldId.toString(), but oldId type isn't string, we'll convert
    candidates.push({ oldId, newId, doc })
  }

  if (candidates.length === 0) {
    console.log('No non-string show _ids found — nothing to do.')
    process.exit(0)
  }

  console.log(`Found ${candidates.length} show(s) with non-string _id out of ${total} shows.`)

  for (const c of candidates) {
    console.log('\n---')
    console.log('Old _id (type):', Object.prototype.toString.call(c.oldId), c.oldId)
    console.log('Proposed new _id:', c.newId)

    // check if target already exists
    const target = await showsCol.findOne({ _id: c.newId })
    if (target) {
      console.log('A show already exists with target _id — will migrate references to it and remove old doc')
    }

    // Dry run summary of affected bookings
    const bookingMatchByObjectId = await bookingsCol.find({ show: c.oldId }).limit(5).toArray()
    const bookingMatchByString = await bookingsCol.find({ show: c.oldId.toString() }).limit(5).toArray()
    console.log('Example bookings referencing old id (ObjectId search):', bookingMatchByObjectId.length)
    console.log('Example bookings referencing old id (string search):', bookingMatchByString.length)

    if (!apply) continue

    // Apply changes
    if (!target) {
      // create new document with _id as string
      const newDoc = { ...c.doc, _id: c.newId }
      // Important: if the old doc has BSON ObjectId in fields, copying works — insert with new _id
      delete newDoc._id // ensure insert uses our string id
      await showsCol.insertOne({ ...c.doc, _id: c.newId })
      console.log('Inserted new show document with _id (string)')
    } else {
      console.log('Target show exists; skipping insert')
    }

    // Update bookings: try both object and string matches
    const updateQueries = [ { show: c.oldId }, { show: c.oldId.toString() } ]
    let updatedTotal = 0
    for (const q of updateQueries) {
      const result = await bookingsCol.updateMany(q, { $set: { show: c.newId } })
      if (result.modifiedCount) updatedTotal += result.modifiedCount
    }
    console.log(`Updated bookings (approx): ${updatedTotal}`)

    // Remove old show
    const delRes = await showsCol.deleteOne({ _id: c.oldId })
    console.log('Deleted old show doc count:', delRes.deletedCount)
  }

  console.log('\nMigration completed (apply=' + apply + ').')
  process.exit(0)
}

run().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
