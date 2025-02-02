import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Nodemailer Transport Setup (Gmail example, replace with your SMTP credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // From .env file
    pass: process.env.EMAIL_PASS, // From .env file
  },
});

// Controller for handling contact form submission
export const sendContactForm = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validate the fields (simple check)
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address (your email)
    to: process.env.EMAIL_USER,   // Receiver address (your email)
    subject: 'New Contact Form Submission',
    text: `
      You have a new contact form submission:
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return res.status(200).json({ message: 'Thank you for reaching out to us!' });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
};
