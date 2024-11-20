import { Router } from "express";
import {
  registerUser,
  verifyEmail,
  resendEmail,
} from "../user-management/controller/auth.controllers";

const router = Router();

router.post("/register", registerUser);
router.post("/verify", verifyEmail);
router.get("/resend/:id", resendEmail);

export default router;
