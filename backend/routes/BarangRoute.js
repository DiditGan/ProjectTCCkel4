import express from "express";
import {
  getBarang,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
  getMyBarang, // Added
} from "../controllers/BarangController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/barang", getBarang); // Public, or verifyToken if all items require login to view
router.get("/barang/me", verifyToken, getMyBarang); // Get items for logged-in user
router.get("/barang/:item_id", getBarangById); // Public, or verifyToken
router.post("/barang", verifyToken, createBarang);
router.put("/barang/:item_id", verifyToken, updateBarang);
router.delete("/barang/:item_id", verifyToken, deleteBarang);

export default router;