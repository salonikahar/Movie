import connectDB from './configs/db.js';
import Show from './models/Show.js';

const id = process.argv[2];

const run = async () => {
  await connectDB();
  const show = await Show.findById(id);
  if (!show) {
    console.log('Show not found', id);
    process.exit(1);
  }
  console.log('occupiedSeats raw:', show.occupiedSeats);
  console.log('occupiedSeats keys:', Object.keys(show.occupiedSeats || {}));
  await process.exit(0);
}

run();
