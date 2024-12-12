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
router.get("/product-information", verifyUserToken, getAllProductInformation);  // Get all product information
router.get("/product-information/:id", verifyUserToken, getProductInformation);  // Get specific product information

router.get("/product-information/:productId", verifyUserToken, getProductInformationByProductId); //Get product information by product ID


// Protected routes (authentication and authorization required)
router.post("/product-information", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), createProductInformation);  // Create product information

router.put("/product-information/:id", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), updateProductInformation);  // Update product information


router.delete("/product-information/:id", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), deleteProductInformation);  // Delete product information

export default router;
