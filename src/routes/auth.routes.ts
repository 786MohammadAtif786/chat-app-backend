import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getSingleUser,
  saveFcmToken
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

// POST /api/auth/fcm-token
// router.post("/fcm-token", protect, async (req, res) => {
//   await User.findByIdAndUpdate(req.user.id, { fcmToken: req.body.fcmToken });
//   res.json({ success: true });
// });

export default router;
