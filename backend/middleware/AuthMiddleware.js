import jwt from "jsonwebtoken";
import User from "../models/UserModel.js"; // Import User model

export const verifyToken = async (req, res, next) => { // Make function async
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ msg: "Token tidak ditemukan" });
  }

  // Check correct format (Bearer token)
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: "Format token tidak valid" });
  }

  const token = authHeader.split(" ")[1];
  
  // Check if token is not empty
  if (!token) {
    return res.status(401).json({ msg: "Token tidak ditemukan" });
  }

  try {
    // Get token secret from environment variable or use default (for development)
    const secretKey = process.env.ACCESS_TOKEN_SECRET || "access_secret_dev_key";
    
    // Verify token
    const decoded = jwt.verify(token, secretKey);
    
    // Log for debugging
    console.log("Token decoded:", decoded);

    // Check if user_id exists in decoded payload
    if (!decoded.user_id) {
      console.error("Token does not contain user_id:", decoded);
      return res.status(403).json({ msg: "Token tidak valid (tidak ada user ID)" });
    }
    
    // Verify if the user still exists in the database
    const user = await User.findByPk(decoded.user_id);
    if (!user) {
      console.warn(`User with ID ${decoded.user_id} from token not found in database.`);
      return res.status(401).json({ msg: "User tidak lagi terautentikasi atau tidak ditemukan." });
    }
    
    // Add user ID to request for use in controllers
    req.userId = decoded.user_id;
    // Optionally, attach the user object itself if needed frequently in controllers
    // req.user = user; 
    
    console.log("Token verified successfully for user ID:", req.userId);
    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    
    // Send appropriate error based on error type
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token sudah kadaluarsa" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ msg: "Token tidak valid" });
    } else {
      // This might catch errors from User.findByPk if it's not a JWT specific error
      return res.status(500).json({ msg: "Error verifikasi token atau server" });
    }
  }
};