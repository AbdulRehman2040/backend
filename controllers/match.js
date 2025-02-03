import express from 'express';
import nodemailer from 'nodemailer';
import Seller from '../models/seller.js'; // Import the Seller model
import Buyer from '../models/buyer.js';

const router = express.Router();

// Create the transporter once
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'powerpeak3@gmail.com', // Your Gmail address
    pass: 'fixw agfv kkwq zqqq',    // Your App Password
  },
});

// Helper function to find matches (based on active status and matching criteria)
const findMatches = async () => {
  const sellers = await Seller.find({ propertyStatus: 'active' });
  const buyers = await Buyer.find({ propertyStatus: 'active' });
  const matches = [];

  // Loop through each seller
  for (const seller of sellers) {
    const potentialBuyers = buyers.filter((buyer) => {
      return (
        buyer.propertyCategory === seller.propertyCategory &&
        buyer.propertyTypeSelect === seller.landlordPropertyType &&
        buyer.areaRequired === seller.landlordPropertyAddress
      );
    });
    // For each matching buyer, add the pair to matches
    for (const buyer of potentialBuyers) {
      matches.push({ seller, buyer });
    }
  }
  return matches;
};

// GET endpoint to fetch matches
router.get('/matches', async (req, res) => {
  try {
    const matches = await findMatches();
    res.status(200).json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST endpoint to send emails for matches
router.post('/send-emails', async (req, res) => {
  try {
    const matches = await findMatches();
    let emailCount = 0;

    // Loop through each match and send email to the seller
    for (const match of matches) {
      const { seller } = match;
      const mailOptions = {
        from: 'powerpeak3@gmail.com',
        to: seller.landlordEmailAddress, // Email sent to the seller
        subject: 'Potential Property Match Found!',
        text: `
Hello ${seller.landlordName},

We have found a potential property for you..

Please get in touch with the buyer or contact our office for further assistance.

Thank you!

Best Regards,
LBRE Office
Phone: 0800 788 0542
Website: www.lbre.co.uk
Email: info@lbre.co.uk
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${seller.landlordEmailAddress}: ${info.response}`);
        emailCount++; // Increment on success

        // Update the seller's emailsSent count in the database
        await Seller.findByIdAndUpdate(seller._id, { $inc: { emailsSent: 1 } });
      } catch (mailError) {
        console.error(`Error sending email to ${seller.landlordEmailAddress}:`, mailError);
      }
    }

    // Return matches and the number of emails sent
    res.status(200).json({ matches, emailsSent: emailCount, message: 'Emails sent to all matched Tenants successfully.' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET endpoint to fetch the total emailsSent count
router.get('/emails-sent', async (req, res) => {
  try {
    // Calculate the total emailsSent count across all sellers
    const totalEmailsSent = await Seller.aggregate([
      { $group: { _id: null, totalEmailsSent: { $sum: "$emailsSent" } } },
    ]);

    res.status(200).json({ totalEmailsSent: totalEmailsSent[0]?.totalEmailsSent || 0 });
  } catch (error) {
    console.error('Error fetching total emails sent:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;