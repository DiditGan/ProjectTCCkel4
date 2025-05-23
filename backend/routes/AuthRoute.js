import express from "express";
import { register, login, refreshToken, logout } from "../controllers/AuthController.js";

const router = express.Router();

// Routes without prefix (they'll get the /auth prefix from app.use("/auth", AuthRoute))
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken); // Changed from /token to /refresh-token for clarity
router.post("/logout", logout);

export default router;