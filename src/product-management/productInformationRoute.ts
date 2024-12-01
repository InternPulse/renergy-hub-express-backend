import { Router } from "express";
import { verifyUserToken, authorizeUserRoles } from "../util/authorizeUser";

import {
  createProductInformation,
  getAllProductInformation,
  getProductInformation,
  updateProductInformation,
  deleteProductInformation
} from "./productInformation";

const router = Router();

// Public routes (no auth required)
router.get("/product-information", getAllProductInformation);  // Get all product information
router.get("/product-information/:id", getProductInformation);  // Get specific product information

// Protected routes (authentication and authorization required)
router.post("/product-information", createProductInformation);  // Create product information

router.put("/product-information/:id", updateProductInformation);  // Update product information


router.delete("/product-information/:id", deleteProductInformation);  // Delete product information

export default router;
