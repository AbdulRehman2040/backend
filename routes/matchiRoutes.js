import express from 'express';
import matchController from '../controllers/match.js'; // Adjust the path based on your project structure

const router = express.Router();

// Endpoint to fetch matches (GET)
router.get('/matches', matchController);

// Endpoint to send match emails (POST)
router.post('/send-emails', matchController);
router.get('/emails-sent',matchController )

export default router;
