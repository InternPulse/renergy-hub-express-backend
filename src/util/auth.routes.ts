import { Router } from "express";
import {
  registerUser,
  verifyEmail,
  resendEmail,
  login,
  logout,
} from "../user-management/controller/auth.controllers";

const router = Router();

router.post("/register", registerUser);
router.post("/verify", verifyEmail);
router.get("/resend/:id", resendEmail);
router.post("/login", login);
router.get("/logout", logout);

export default router;
