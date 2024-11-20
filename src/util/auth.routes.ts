import { Router } from "express";
import { registerUser } from "../user-management/controller/auth.controllers";
import { verifyEmail } from "../user-management/controller/auth.controllers";

const router = Router();

router.post("/register", registerUser);
router.post("/verify", verifyEmail);

export default router;
