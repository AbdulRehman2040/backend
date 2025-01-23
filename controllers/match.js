import express from 'express';
import nodemailer from 'nodemailer';
import Seller from '../models/seller.js';
import Buyer from '../models/buyer.js';

const router = express.Router();

// Find potential matches between sellers and buyers
router.get('/matches', async (req, res) => {
  try {
    const sellers = await Seller.find();
    const matches = [];

    // Loop through each seller
    for (const seller of sellers) {
      // Find buyers matching the seller's property
      const potentialBuyers = await Buyer.find({
        areaRequired: seller.landlordPropertyAddress,
        budget: { $gte: seller.landlordRent },
      });

      // If there are matches, process them
      for (const buyer of potentialBuyers) {
        matches.push({ seller, buyer });

        // Create email transporter
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'powerpeak3@gmail.com', // Your Gmail address
            pass: '', // Your App Password
          },
          
        });

        // Email details for the buyer
        const mailOptions = {
          from: 'powerpeak3@gmail.com', // Sender address
          to: buyer.emailAddress,      // Recipient email
          subject: 'Potential Property Match Found!',
          text: `
            A property matching your criteria has been found!
            Seller Details:
            Name: ${seller.landlordName}
            Phone: ${seller.landlordPhoneNumber}
            Email: ${seller.landlordEmailAddress}
            Property Type: ${seller.landlordPropertyType}
            Address: ${seller.landlordPropertyAddress}
            Rent: $${seller.landlordRent}

            Contact the seller for more details!
          `,
        };

        // Send email to the buyer
        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`Error sending email to ${buyer.emailAddress}:`, error);
          } else {
            console.log(`Email sent successfully to ${buyer.emailAddress}:`, info.response);
          }
        });
      }
    }

    // Respond with the list of matches and a success message
    res.status(200).json({ matches, message: 'Emails sent to all matched buyers successfully.' });
  } catch (error) {
    console.error('Error in matching logic:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
