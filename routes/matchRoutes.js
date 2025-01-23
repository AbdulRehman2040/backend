import express from 'express';
import { Router } from 'express';
import Seller from '../models/seller.js';
import Buyer from '../models/buyer.js';
import nodemailer from 'nodemailer'

// Find potential matches between sellers and buyers
router.get('/matches', async (req, res) => {
  try {
    const sellers = await Seller.find();

    const matches = [];

    for (const seller of sellers) {
      const potentialBuyers = await Buyer.find({
        areaRequired: seller.landlordPropertyAddress,
        budget: { $gte: seller.landlordRent },
      });

      for (const buyer of potentialBuyers) {
        matches.push({ seller, buyer });

        // Send email notification to the buyer from database
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'roomk592@gmail.com', // Assuming senderEmailAddress is in Seller schema
            pass: 'Westyorkshire', // Replace with your sender email password
          },
        });

        const mailOptions = {
          from: 'roomk592@gmail.com', // Sender address
          to: buyer.emailAddress, // Recipient address
          subject: 'Potential Property Match Found!',
          text: `A property matching your criteria has been found. Please contact the seller: ${seller.landlordName} at ${seller.landlordPhoneNumber}.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      }
    }

    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;