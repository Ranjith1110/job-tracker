import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import your route files
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- MIDDLEWARE ---
// 1. Enable CORS so your React frontend can communicate with the backend
app.use(cors()); 

// 2. Parse incoming JSON payloads
app.use(express.json());


// --- ROUTES ---
// Mount the authentication routes (Signup/Signin)
app.use('/api/auth', authRoutes);

// Mount the job applications routes (Add Application / Get Applications)
app.use('/api/applications', applicationRoutes);


// --- DATABASE CONNECTION & SERVER START ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });