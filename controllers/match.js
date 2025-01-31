import express from 'express';
import nodemailer from 'nodemailer';
import Seller from '../models/seller.js';
import Buyer from '../models/buyer.js';

const router = express.Router();

// Create the transporter *once* outside the route handler
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'powerpeak3@gmail.com', // Your Gmail address
    pass: 'fixw agfv kkwq zqqq', // Your App Password
  },
});

router.get('/matches', async (req, res) => {
  try {
    // Fetch all active sellers and buyers
    const sellers = await Seller.find({ propertyStatus: 'active' });
    const buyers = await Buyer.find({ propertyStatus: 'active' });

    const matches = [];

    // Loop through each seller
    for (const seller of sellers) {
      // Find buyers with matching criteria
      const potentialBuyers = buyers.filter((buyer) => {
        return (
          buyer.propertyCategory === seller.propertyCategory &&
          buyer.propertyTypeSelect === seller.landlordPropertyType &&
          buyer.areaRequired === seller.landlordPropertyAddress
        );
      });

      // If matching buyers are found, add them to the matches array
      for (const buyer of potentialBuyers) {
        matches.push({ seller, buyer });

        // Send email to the seller
        const mailOptions = {
          from: 'powerpeak3@gmail.com',
          to: seller.landlordEmailAddress, // Send email to the seller
          subject: 'Potential Buyer Match Found!',
          text: `
Hello ${seller.landlordName},

We have found a potential buyer for your property.

Please get in touch with the buyer or contact our office for further assistance.

Thank you!

Best Regards,
LBRE Office
Phone: 0800 788 0542
Website: www.lbre.co.uk
Email: info@lbre.co.uk
          `,
        };

        // Send the email
        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`Error sending email to ${seller.landlordEmailAddress}:`, error);
          } else {
            console.log(`Email sent successfully to ${seller.landlordEmailAddress}:`, info.response);
          }
        });
      }
    }

    // Return the matches and a success message
    res.status(200).json({ matches, message: 'Emails sent to all matched sellers successfully.' });
  } catch (error) {
    console.error('Error in matching logic:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;