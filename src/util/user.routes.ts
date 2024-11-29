import { Router } from "express";
import {
  deleteUserByID,
  getAllUsers,
  getUserByID,
  updateUserByID,
} from "../user-management/controller/user.controllers";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserByID);
router.delete("/:id", deleteUserByID);
router.put("/:id", updateUserByID);

export default router;
