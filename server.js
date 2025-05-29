import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

// Import routes
import userRoutes from './src/apis/routes/userRoutes.js';
import customerRoutes from './src/apis/routes/customerRoutes.js';
import orderRoutes from './src/apis/routes/orderRoutes.js';
import segmentRuleRoutes from './src/apis/routes/segmentRuleRoutes.js';
import campaignRoutes from './src/apis/routes/campaignRoutes.js';
import communicationLogRoutes from './src/apis/routes/communicationLogRoutes.js';

// Import models
import User from "./src/models/User.js";

const app = express();

// 🌐 Global CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    if (error.name === 'MongooseServerSelectionError') {
      console.error("\n⚠️  Please make sure to:");
      console.error("1. Add your IP address to MongoDB Atlas whitelist");
      console.error("2. Check if your MongoDB URI is correct");
      console.error("3. Verify your MongoDB username and password");
      console.error("\n🔗 MongoDB Atlas IP Whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/");
    }
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segment-rules', segmentRuleRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/communication-logs', communicationLogRoutes);

// Google OAuth Authentication
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/auth/google", async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    console.error("No credential provided in request");
    return res.status(400).json({ error: "No credential provided" });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("GOOGLE_CLIENT_ID is not set in environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    console.log("Verifying token with client ID:", process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Token verified successfully. Email:", payload.email);

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      console.log("Creating new user for email:", payload.email);
      user = new User({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
      await user.save();
    }

    const tokenPayload = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
    };

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("JWT token generated successfully");

    res.json({ token, user: tokenPayload });
  } catch (error) {
    console.error("Token verification failed. Full error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(401).json({ error: "Invalid token", details: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Debug Environment
console.log("🔑 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Missing");
