import express from "express";
import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import BarangRoute from "./routes/BarangRoute.js";
import TransaksiRoute from "./routes/TransaksiRoute.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";

dotenv.config();
const app = express();

// Log env DB config untuk debugging (hapus di production)
console.log("DB_HOST:", process.env._DB_HOST);
console.log("DB_USER:", process.env._DB_USER);
console.log("DB_NAME:", process.env._DB_NAME);

// Middleware - Order is important!
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000"
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// __dirname workaround for ES module
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan path static benar
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Create public/uploads/products directory if it doesn't exist
const publicDir = path.join(__dirname, "public");
const imagesDir = path.join(publicDir, "images");
const uploadsDir = path.join(publicDir, "uploads", "products");

[publicDir, imagesDir, uploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Routes
app.use("/auth", AuthRoute);
app.use("/api", UserRoute);
app.use("/api", BarangRoute);
app.use("/api", TransaksiRoute);

// Test route to check if server is running
app.get("/api-status", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
