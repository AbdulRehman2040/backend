import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import sellerRoutes from './routes/sellerRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dotenv from 'dotenv';  // Added dotenv for environment variables
import matchingRoutes from './routes/matchingRoutes.js';
import Matchrouter from './controllers/match.js'
import matchRoutes from './routes/matchiRoutes.js';
// Load environment variables
dotenv.config();

const app = express();

// MongoDB URI from environment variable or fallback
const data =process.env.MONGODB_URI || 'mongodb+srv://abdulrehmankhawaja20:k2FHsifKHFJLrvWO@cluster0.duv6n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Enable CORS for all origins (adjust the origin if needed)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// MongoDB connection
mongoose.connect(data, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Add routes for sellers, buyers, notifications, and matching

app.use('/api/sellers', sellerRoutes); // All seller-related APIs will have the `/api/sellers` prefix
app.use('/api/buyers', buyerRoutes);   // All buyer-related APIs will have the `/api/buyers` prefix
app.use('/api/match', matchRoutes);

// app.use('/api/match', Matchrouter); // Match and email APIs
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/match', matchingRoutes);  // All 
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
