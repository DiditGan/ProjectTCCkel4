import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
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

  jwt.verify(token, process.env._ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ msg: "Token sudah kadaluarsa" });
    }

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
  });
};