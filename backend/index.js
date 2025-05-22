import express from "express";
import db from "./config/database.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import BarangRoute from "./routes/BarangRoute.js";
import TransaksiRoute from "./routes/TransaksiRoute.js";
import ChatRoute from "./routes/ChatRoute.js"; // Added
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// Check required environment variables
if (!process.env.ACCESS_TOKEN_SECRET) {
  console.warn("WARNING: ACCESS_TOKEN_SECRET not set! Using default (insecure) value.");
  process.env.ACCESS_TOKEN_SECRET = "default_access_token_secret_key";
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  console.warn("WARNING: REFRESH_TOKEN_SECRET not set! Using default (insecure) value.");
  process.env.REFRESH_TOKEN_SECRET = "default_refresh_token_secret_key";
}

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // Allow frontend origin
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/auth", AuthRoute); // Prefix auth routes
app.use("/api", UserRoute);   // Prefix user routes
app.use("/api", BarangRoute); // Prefix barang routes
app.use("/api", TransaksiRoute); // Prefix transaksi routes
app.use("/api", ChatRoute);   // Prefix chat routes


// Test route to check if server is running
app.get("/api-status", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// Error handling middleware - place it after all routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Terjadi kesalahan pada server" });
});

const startServer = async () => {
  try {
    await db.authenticate();
    console.log("Database connection established.");
    
    // Use { alter: true } carefully in production, it can cause data loss.
    // For development, it helps sync schema changes.
    // For production, use migrations.
    await db.sync({ alter: true }); 
    console.log("Database synchronized.");
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();