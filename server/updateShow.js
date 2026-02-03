import connectDB from './configs/db.js';
import Show from './models/Show.js';

const id = process.argv[2];
const seat = process.argv[3] || 'Z1';
const user = process.argv[4] || 'user_test';

const run = async () => {
  await connectDB();
  const show = await Show.findById(id);
  if (!show) {
    console.log('Show not found', id);
    process.exit(1);
  }
  const existing = show.occupiedSeats || {};
  const newOccupied = { ...existing };
  newOccupied[seat] = user;
  show.occupiedSeats = newOccupied;
  await show.save();
  console.log('Saved show.occupiedSeats:', show.occupiedSeats);
  const fresh = await Show.findById(id);
  console.log('After fetch, occupiedSeats:', fresh.occupiedSeats);
  process.exit(0);
}

run();
