import { Router } from "express";
import { registerUser } from "../user-management/controller/auth.controllers";

const router = Router();

router.post("/register", registerUser);

export default router;
