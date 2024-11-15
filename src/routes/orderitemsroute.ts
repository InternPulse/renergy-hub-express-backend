import { Router } from "express";
import { createorderitem, getOrderItemById, updateOrderItem } from "../controller/controller";




const router = Router()

router.post("/createorderitems",createorderitem)
router.put("/updateorderitems/:id",updateOrderItem)
router.get("/getorderitem/:id",getOrderItemById)











export default router

