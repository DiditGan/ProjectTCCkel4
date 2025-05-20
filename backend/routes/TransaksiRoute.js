import express from "express";
import {
  getTransaksi,
  getTransaksiById,
  createTransaksi,
  updateTransaksi,
  deleteTransaksi,
} from "../controllers/TransaksiController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/transaksi", verifyToken, getTransaksi);
router.get("/transaksi/:transaction_id", verifyToken, getTransaksiById);
router.post("/transaksi", verifyToken, createTransaksi);
router.put("/transaksi/:transaction_id", verifyToken, updateTransaksi);
router.delete("/transaksi/:transaction_id", verifyToken, deleteTransaksi);

export default router;