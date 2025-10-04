import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"; 



// Ensure dotenv loads the server/.env file regardless of current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });
if (result.error) console.log('[env] no .env loaded from', envPath, '-', result.error.message);
else console.log('[env] loaded .env from', envPath);

const app = express();
const port = 3000;



console.log('[server] starting — attempting DB connect...');
await connectDB()
console.log('[server] DB connect finished — continuing startup');

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())



//API Routes
app.get('/', (req, res) => res.send('Server is Live!'))
app.use('/api/inngest', serve({ client: inngest, functions}))


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));