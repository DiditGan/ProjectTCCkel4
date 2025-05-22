import express from "express";
import {
  getConversations,
  getMessages,
  createMessage,
} from "../controllers/ChatController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/conversations", verifyToken, getConversations);
router.get("/conversations/:conversation_id/messages", verifyToken, getMessages);
// POST to existing conversation or create new if conversation_id is 'new'
router.post("/conversations/:conversation_id/messages", verifyToken, createMessage); 

export default router;
