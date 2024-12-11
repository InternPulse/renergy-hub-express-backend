import { Router } from "express";
import { verifyUserToken, authorizeUserRoles } from "../util/authorizeUser";
import upload from "../util/multer";
import {
  AddNewProduct,
  addProductCategory,
  getAllProductCategories,
  getAllProducts,
  getProduct,
  deleteProduct,
  UpdateProduct,
  deleteProductCategory
} from "./productController";
const router = Router();

router.post("/", upload.single("image"), AddNewProduct);
// router.post("/", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), upload.single("image"), AddNewProduct);
// router.post("/category", verifyUserToken, authorizeUserRoles(["ADMIN"]), addProductCategory);
router.post("/category", addProductCategory);
router.get("/category", getAllProductCategories);
router.put("/:id", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), upload.single("image"), UpdateProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.delete("/:id", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), deleteProduct);
router.delete("/category/:id", verifyUserToken, authorizeUserRoles(["ADMIN", "VENDOR"]), deleteProductCategory);


export default router;


