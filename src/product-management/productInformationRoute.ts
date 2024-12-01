import { Router } from "express";
import { verifyUserToken, authorizeUserRoles } from "../util/authorizeUser";

import {
  createProductInformation,
  getAllProductInformation,
  getProductInformation,
  updateProductInformation,
  deleteProductInformation,
  getProductInformationByProductId
} from "./productInformation";

const router = Router();

// Public routes (no auth required)
router.get("/product-information", getAllProductInformation);  // Get all product information
router.get("/product-information/:id", getProductInformation);  // Get specific product information

router.get("/product-information/by-product/:productId", getProductInformationByProductId); //Get product information by product ID


// Protected routes (authentication and authorization required)
router.post("/product-information", createProductInformation);  // Create product information

router.put("/product-information/:id", updateProductInformation);  // Update product information


router.delete("/product-information/:id", deleteProductInformation);  // Delete product information

export default router;
