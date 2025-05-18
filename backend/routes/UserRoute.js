import express from "express";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/UserController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", verifyToken, createUser);
router.put("/users/:user_id", verifyToken, updateUser);
router.delete("/users/:user_id", verifyToken, deleteUser);

export default router;
