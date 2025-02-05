import express from 'express';
import nodemailer from 'nodemailer';
import Seller from '../models/seller.js'; // Import the Seller model
import Buyer from '../models/buyer.js';
import twilio from 'twilio';

// Twilio Configuration


const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

// Create the transporter once
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'powerpeak3@gmail.com', // Your Gmail address
    pass: 'fixw agfv kkwq zqqq',    // Your App Password
  },
});

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


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
const findUnmatchedProperties = async () => {
  const sellers = await Seller.find({ propertyStatus: 'active' });
  const buyers = await Buyer.find({ propertyStatus: 'active' });

  const matchedSellers = new Set();
  const matchedBuyers = new Set();

  for (const seller of sellers) {
    for (const buyer of buyers) {
      if (
        buyer.propertyCategory === seller.propertyCategory &&
        buyer.propertyTypeSelect === seller.landlordPropertyType &&
        buyer.areaRequired === seller.landlordPropertyAddress
      ) {
        matchedSellers.add(seller._id.toString());
        matchedBuyers.add(buyer._id.toString());
      }
    }
  }

  const unmatchedSellers = sellers.filter(seller => !matchedSellers.has(seller._id.toString()));
  const unmatchedBuyers = buyers.filter(buyer => !matchedBuyers.has(buyer._id.toString()));

  return { unmatchedSellers, unmatchedBuyers };
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
router.get('/unmatched-properties', async (req, res) => {
  try {
    const { unmatchedSellers, unmatchedBuyers } = await findUnmatchedProperties();
    res.status(200).json({ unmatchedSellers, unmatchedBuyers });
  } catch (error) {
    console.error('Error fetching unmatched properties:', error);
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

// **2. New SMS Sending Endpoint**
router.post('/send-sms', async (req, res) => {
  try {
    const matches = await findMatches();
    let smsCount = 0;

    for (const match of matches) {
      const { seller } = match;

      if (!seller.landlordPhoneNumber) {
        console.warn(`Skipping seller ${seller.landlordName}, no phone number provided.`);
        continue;
      }

      try {
        const smsMessage = await client.messages.create({
          body: `Hello ${seller.landlordName}, we found a buyer for your property. Call us at 0800 788 0542.`,
          from: twilioPhoneNumber,
          to: '+923072604625',
        });

        console.log(`SMS sent to ${seller.landlordPhoneNumber}: ${smsMessage.sid}`);
        smsCount++;
      } catch (error) {
        console.error(`Error sending SMS to ${seller.landlordPhoneNumber}:`, error);
      }
    }

    res.status(200).json({ smsSent: smsCount, message: 'SMS sent successfully.' });
  } catch (error) {
    console.error('Error sending SMS:', error);
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