import express from 'express';
import { sendContactForm } from '../controllers/contactController.js';

const router = express.Router();

// Route to handle contact form submission
router.post('/contact', sendContactForm);

export default router;
