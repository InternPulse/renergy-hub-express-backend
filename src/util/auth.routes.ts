import { Router } from "express";
import {
  registerUser,
  verifyEmail,
  resendEmail,
  login,
} from "../user-management/controller/auth.controllers";

const router = Router();

router.post("/register", registerUser);
router.post("/verify", verifyEmail);
router.get("/resend/:id", resendEmail);
router.post("/login", login);

export default router;
