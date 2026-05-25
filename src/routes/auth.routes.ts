import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getSingleUser,
  saveFcmToken,
  logoutUser
} from "../controllers/auth.controller";

import { protect } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


// router.get("/me", protect, getMe);
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getSingleUser);

router.post(

  "/fcm-token",

  protect,

  saveFcmToken
);

router.post("/logout", protect, logoutUser);


export default router;
