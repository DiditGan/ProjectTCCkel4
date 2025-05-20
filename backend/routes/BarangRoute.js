import express from "express";
import {
  getBarang,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
} from "../controllers/BarangController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/barang", getBarang);
router.get("/barang/:item_id", getBarangById);
router.post("/barang", verifyToken, createBarang);
router.put("/barang/:item_id", verifyToken, updateBarang);
router.delete("/barang/:item_id", verifyToken, deleteBarang);

export default router;