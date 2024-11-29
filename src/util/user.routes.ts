import { Router } from "express";
import { getAllUsers } from "../user-management/controller/user.controllers";

const router = Router();

router.get("/", getAllUsers);

export default router;
