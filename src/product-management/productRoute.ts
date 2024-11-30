import { Router } from "express";
import { verifyUserToken, authorizeUserRoles } from "../util/authorizeUser";
import {
  AddNewProduct,
  addProductCategory
} from "./productController";
const router = Router();

router.post("/", AddNewProduct);
router.post("/category", addProductCategory);


export default router;


