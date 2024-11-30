import { Router } from "express";
import { verifyUserToken, authorizeUserRoles } from "../util/authorizeUser";
import {
  AddNewProduct,
  addProductCategory,
  getAllProducts,
  getProduct,
  deleteProduct
} from "./productController";
const router = Router();

router.post("/", AddNewProduct);
router.post("/category", addProductCategory);

router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);
router.delete("/product/:id", deleteProduct);


export default router;


