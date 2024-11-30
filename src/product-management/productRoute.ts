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

router.post("/", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), AddNewProduct);
router.post("/category", verifyUserToken, authorizeUserRoles(["ADMIN"]), addProductCategory);

router.get("/", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), getAllProducts);
router.get("/:id", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), getProduct);
router.delete("/:id", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), deleteProduct);


export default router;


