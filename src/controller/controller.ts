
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { success } from "../util/response";
import OrderManagementService from "../services/order.service";
import { Order } from "../types";

const orderService: OrderManagementService = new OrderManagementService();

// @Method GET
// @Desc Get all orders
// @Route /api/auth
export const getAll = asyncHandler(async (req: Request, res: Response) => {

    const data: Order[] = await orderService.listOrders();

    success(res, 201, data, "Orders listed successfully");
});

// @Desc Create Order
// @Route /api/v1/orders
// @Method POST
export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    try 
    {
        
        success(res, 201, [], "Book created successfully");
    }
    catch (err)
    {
        next(err);
    }

});