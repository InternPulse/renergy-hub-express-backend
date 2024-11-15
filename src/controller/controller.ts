
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Order } from "../types";
import { success } from "../util/response";
import OrderManagementService from "../services/order.service";
import { CreateOrderDto } from "../dto/orders/create-order.dto";
import { PrismaClient } from "@prisma/client";
import CreateOrderItemDto from "../dto/orders/create-order-items.dto";



const prisma = new PrismaClient();
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

//create a new orderid item

export const createorderitem = async (request: Request, response: Response)=>{
    try {
    const{orderId,productId,quantity,price,cartId}= request.body
    const createOrderDto = new CreateOrderItemDto(orderId,productId,quantity,price,cartId)

    const Orderitem = await prisma.orderItem.create({
        data:{
            orderId: createOrderDto.orderId,
            productId : createOrderDto.productId,
            quantity: createOrderDto.quantity,
            price: createOrderDto.price,
            cartId : createOrderDto.cartId

        }
    })

    return response.status(200).json({
        "message":"Successful",
        "Status": 200,
        Orderitem
    }) 
    } catch (error) {
        return response.status(500).json({
            "message":"Server Error",
            error
        })
    }
   

}


// @Desc Update Order Item by ID
// @Route /api/v1/updateorderitems/:id
// @Method PUT
export const updateOrderItem = async (request: Request, response: Response) => {
    try {
      const { id } = request.params; // Get the orderItem ID from the URL
      const { orderId, productId, quantity, price, cartId } = request.body; // Get updated data from the request body
  
      // Create DTO for the order item
      const createOrderDto = new CreateOrderItemDto(orderId, productId, quantity, price, cartId);
  
      // Update the order item in the database using Prisma
      const updatedOrderItem = await prisma.orderItem.update({
        where: { id: Number(id) }, // Find the orderItem by ID
        data: {
          orderId: createOrderDto.orderId,
          productId: createOrderDto.productId,
          quantity: createOrderDto.quantity,
          price: createOrderDto.price,
          cartId: createOrderDto.cartId,
        },
      });
  
      return response.status(200).json({
        message: "Order item updated successfully",
        status: 200,
        updatedOrderItem,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: "Server Error",
        error,
      });
    }
  };



export const getOrderItemById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const orderItem = await prisma.orderItem.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!orderItem) {
            return res.status(404).json({
                message: 'Order item not found',
                Status: 404,
            });
        }

        return res.status(200).json({
            message: 'Order item retrieved successfully',
            Status: 200,
            orderItem,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error,
        });
    }
};

  

