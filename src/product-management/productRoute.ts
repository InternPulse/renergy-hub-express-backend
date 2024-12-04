import { Router } from "express";
import { verifyUserToken, authorizeUserRoles } from "../util/authorizeUser";
import {
  AddNewProduct,
  addProductCategory,
  getAllProductCategories,
  getAllProducts,
  getProduct,
  deleteProduct,
  UpdateProduct
} from "./productController";
const router = Router();

router.post("/", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), AddNewProduct);
router.post("/category", verifyUserToken, authorizeUserRoles(["ADMIN"]), addProductCategory);
router.get("/category", getAllProductCategories);
router.put("/:id", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), UpdateProduct);

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.delete("/:id", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), deleteProduct);


export default router;


