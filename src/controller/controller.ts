import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Order } from "../types";
import { success } from "../util/response";
import OrderManagementService from "../services/order.service";
import { CreateOrderDto } from "../dto/orders/create-order.dto";

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
        const createOrderDto = req.body;
        console.log(createOrderDto)
        const createdOrder = await orderService.createOrder(createOrderDto);
        success(res, 201, createdOrder, "Order created successfully");
    }
    catch (err)
    {
        next(err);
    }

});