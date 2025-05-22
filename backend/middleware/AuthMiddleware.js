import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
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
    console.log("Token verified:", decoded);
    
    // Add user ID to request for use in controllers
    req.userId = decoded.user_id;
    
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
      return res.status(403).json({ msg: "Error verifikasi token" });
    }
  }
};