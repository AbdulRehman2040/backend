import express from 'express';
import matchController from '../controllers/match.js'; // Adjust the path based on your project structure

const router = express.Router();

// Route to find matches between sellers and buyers and send emails
router.get('/matches', matchController);

export default router;
