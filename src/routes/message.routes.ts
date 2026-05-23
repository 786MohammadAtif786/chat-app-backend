import express from "express";

import {
  sendMessage,
  getMessages
} from "../controllers/message.controller";

import { getMe } from "../controllers/auth.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();
router.get("/me", protect, getMe);

router.post("/", protect, sendMessage);

router.get("/:id", protect, getMessages);


export default router;