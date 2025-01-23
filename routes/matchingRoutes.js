import express from 'express';
import { checkMatchingDataAndNotify } from '../controllers/matchingController.js'; // Import the controller function

const router = express.Router();

// Define the route for checking matching data and sending notifications
router.post('/notify', checkMatchingDataAndNotify);

export default router;
