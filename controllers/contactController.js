import nodemailer from 'nodemailer';

 router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'powerpeak3@gmail.com', // Your Gmail address
            pass: 'fixw agfv kkwq zqqq', // Your App Password
      },
    });

    const mailOptions = {
      from: email,
      to: 'your-email@gmail.com', // Replace with recipient email
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send your message. Please try again later.' });
  }
});


export default router;