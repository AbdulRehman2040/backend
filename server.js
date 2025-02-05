import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import sellerRoutes from './routes/sellerRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dotenv from 'dotenv';  // Added dotenv for environment variables
import matchingRoutes from './routes/matchingRoutes.js';
import Matchrouter from './controllers/match.js'
import matchRoutes from './routes/matchiRoutes.js';
import bodyParser from "body-parser";
import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';
import contactRoutes from './routes/contactRoutes.js';
import Admin from './models/admin.js'


// Load environment variables
dotenv.config();

const app = express();

// MongoDB URI from environment variable or fallback
const data =process.env.MONGODB_URI || 'mongodb+srv://abdulrehmankhawaja20:k2FHsifKHFJLrvWO@cluster0.duv6n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Enable CORS for all origins (adjust the origin if needed)
app.use(cors({
  origin: '*', // Allow all origins (replace * with your frontend's URL for better security)
}));


// Middleware to parse incoming JSON requests
app.use(express.json());

// MongoDB connection
mongoose.connect(data, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Add routes for sellers, buyers, notifications, and matching
app.get("/", (req, res) => {
  res.send({ message: "Welcome to the Express API!" });
});
app.use('/api/sellers', sellerRoutes); // All seller-related APIs will have the `/api/sellers` prefix
app.use('/api/buyers', buyerRoutes);   // All buyer-related APIs will have the `/api/buyers` prefix
app.use('/api/match', matchRoutes);
app.use('/api/', contactRoutes);


// Hardcoded admin credentials (plain text)
// Admin Schema



export const authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the admin from the database
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // Attach the admin's details to the request object
    req.admin = {
      id: admin._id,
      username: admin.username, // Assuming the admin schema has a `username` field
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};



// Nodemailer Setup (for sending emails)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to create an admin
app.post("/api/create-admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", email, password); // Debugging
  localStorage.setItem('token', response.data.token);
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin not found"); // Debugging
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Invalid credentials"); // Debugging
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Login successful, token generated:", token); // Debugging
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error); // Debugging
    res.status(500).json({ message: "Server error" });
  }
});

// Change Password Route
app.post("/api/change-password", authenticateAdmin, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
      const admin = await Admin.findById(req.adminId);
      if (!admin) {
          return res.status(400).json({ message: "Admin not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, admin.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Old password is incorrect" });
      }

      // Hash the new password
      const saltRounds = 10;
      admin.password = await bcrypt.hash(newPassword, saltRounds);

      await admin.save();
      res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
      console.error("Change Password Error:", error);
      res.status(500).json({ message: "Server error" });
  }
});

// Add New Admin Route
app.post("/api/add-admin", async (req, res) => {
  const {username, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin added successfully" });
  } catch (error) {
    console.error("Add admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Profile Route
app.get("/api/admin-profile", async (req, res) => {
  const { email } = req.query;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    res.json({ email: admin.email });
  } catch (error) {
    console.error("Admin profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Forgot Password Route
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Forgot password request for email:", email); // Debugging

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin not found"); // Debugging
      return res.status(400).json({ message: "Admin not found" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await admin.save();

    const resetUrl = `https://ibre.vercel.app/reset-password/${token}`;
    console.log("Reset URL:", resetUrl); // Debugging

    const mailOptions = {
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent"); // Debugging
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error); // Debugging
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password Route
app.post("/api/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log("Reset password request for token:", token); // Debugging

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debugging

    // Find the admin with the matching token and check expiration
    const admin = await Admin.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      console.log("Invalid or expired token"); // Debugging
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("New hashed password:", hashedPassword); // Debugging

    // Update the admin's password and clear the reset token
    admin.password = hashedPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    console.log("Password reset successful for admin:", admin.email); // Debugging
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error); // Debugging
    res.status(500).json({ message: "Server error" });
  }
});
// get all admin
app.get("/api/admins", authenticateAdmin, async (req, res) => {
  try {
    // The admin is already attached to the request by authenticateAdmin middleware
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({
      username: admin.username,
      email: admin.email,
      id: admin._id
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/admins/me", authenticateAdmin, async (req, res) => {
  try {
    // The admin is already attached to the request by authenticateAdmin middleware
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({
      username: admin.username,
      email: admin.email,
      id: admin._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Admin
app.delete("/admins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting admin with ID:", id); // Debugging log

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      console.log("Admin not found"); // Log if not found
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log("Admin deleted successfully"); // Log success
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error); // Log full error
    res.status(500).json({ message: "Error deleting admin", error: error.message });
  }
});


app.get("/api/admin/timer", async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    res.json({
      timer: admin.timer,
      initialTime: admin.initialTime,
      isLoopActive: admin.isLoopActive,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Timer
app.put("/api/admin/timer", async (req, res) => {
  const { timer, initialTime, isLoopActive } = req.body;
  try {
    await Admin.findOneAndUpdate({}, { timer, initialTime, isLoopActive }, { new: true, upsert: true });
    res.json({ message: "Timer updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating timer" });
  }
});







// app.use('/api/match', Matchrouter); // Match and email APIs
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/match', matchingRoutes);  // All 
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;  // ES Modules syntax