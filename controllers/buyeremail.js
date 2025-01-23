import express from 'express';
import Buyer from '../models/buyer.js';
import Seller from '../models/seller.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password', // or use OAuth2 for better security
  },
});

// Function to send email to buyer
const sendEmailToBuyer = (buyerEmail, area) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: buyerEmail,
    subject: 'Property match for your area requirement',
    text: `Hi, a property is available in the area you are looking for: ${area}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Route to add a buyer and check if their area matches any seller's property address
router.post('/', async (req, res) => {
  const { name, phoneNumber, emailAddress, areaRequired, budget, notes } = req.body;

  try {
    // Save buyer data
    const buyer = new Buyer({
      name,
      phoneNumber,
      emailAddress,
      areaRequired,
      budget,
      notes,
    });
    await buyer.save();

    // Check if any seller's address matches the buyer's areaRequired
    const sellers = await Seller.find();

    sellers.forEach((seller) => {
      if (seller.landlordPropertyAddress.toLowerCase() === areaRequired.toLowerCase()) {
        // If the area matches, send an email to the buyer
        sendEmailToBuyer(emailAddress, areaRequired);
      }
    });

    res.status(201).json(buyer);
  } catch (error) {
    res.status(500).json({ message: 'Error saving buyer data' });
  }
});

export default router;
