import express from "express";
import {
  getBarang,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
  getMyBarang
} from "../controllers/BarangController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { uploadProductImage } from "../middleware/UploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/barang", getBarang);
router.get("/barang/:item_id", getBarangById);

// Protected routes - image upload middleware handles both file and form data
router.post("/barang", verifyToken, uploadProductImage, createBarang);
router.put("/barang/:item_id", verifyToken, uploadProductImage, updateBarang);
router.delete("/barang/:item_id", verifyToken, deleteBarang);
router.get("/my-barang", verifyToken, getMyBarang);

export default router;