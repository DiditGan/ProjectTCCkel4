import express from "express";
import { getMyProfile, updateMyProfile, getAllUsers, deleteUserById } from "../controllers/UserController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Profile routes for logged-in user
router.get("/profile", verifyToken, getMyProfile);
router.put("/profile", verifyToken, updateMyProfile);

// Admin routes (optional, protect with admin role middleware if implemented)
router.get("/users", verifyToken, getAllUsers); // Example: Get all users for admin
router.delete("/users/:user_id", verifyToken, deleteUserById); // Example: Delete user by ID for admin


export default router;
