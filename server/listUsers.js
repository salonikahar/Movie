import connectDB from './configs/db.js';
import User from './models/User.js';

const run = async () => {
  await connectDB();
  const users = await User.find({}).lean();
  console.log('users count', users.length);
  for (const u of users) {
    console.log(u._id, u.email, u.name);
  }
  process.exit(0);
}

run();
