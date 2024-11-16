import { NextFunction, Request, Response } from 'express';
import * as orderService from './order.service.ts';
import { success } from '../util/response.ts';
import { CreateOrderItemDto } from './order.dto.ts';

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    
  try 
  {
    const orders = await orderService.getAllOrders(req.query);
    success(res, 201, orders, "Order returned successfully");
  } 
  catch (error) 
  {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  
try 
  {
    const order = await orderService.getOrderById(parseInt(req.params.orderId));
    success(res, 201, order, "Order returned successfully");
  } 
  catch (error) 
  {
    next(error)
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {

  try 
  {
    const newOrder = await orderService.createOrder(req.body);
    success(res, 201, newOrder, "Order created successfully");
  } 
  catch (error) 
  {
    next(error)
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try 
  {
    const updatedOrder = await orderService.updateOrder(parseInt(req.params.orderId), req.body);
    success(res, 201, updateOrder, "Order updated successfully");
  } 
  catch (error) 
  {
    next(error);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try 
  {
    await orderService.deleteOrder(parseInt(req.params.orderId));
    success(res, 201, {}, "Order deleted successfully");
  } 
  catch (error) 
  {
    next(error);
  }
};


export const createorderitem = async (request: Request, response: Response, next: NextFunction)=>{
    try 
    {
    // const createOrderDto: CreateOrderItemDto = request.body;

    // const Orderitem = await prisma.orderItem.create({
    //     data:{
    //         orderId: createOrderDto.orderId,
    //         productId : createOrderDto.productId,
    //         quantity: createOrderDto.quantity,
    //         price: createOrderDto.price,
    //         cartId : createOrderDto.cartId

    //     }
    // })

    // return response.status(200).json({
    //     "message":"Successful",
    //     "Status": 200,
    //     Orderitem
    // }) 
        return success(response, 201, {}, "TODO");
    } 
    catch (error) 
    {
        next(error)
    }
   

}


// @Desc Update Order Item by ID
// @Route /api/v1/updateorderitems/:id
// @Method PUT
export const updateOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params; // Get the orderItem ID from the URL
      const { orderId, productId, quantity, price, cartId } = req.body; // Get updated data from the request body
  
      // Create DTO for the order item
    //   const createOrderDto = new CreateOrderItemDto(orderId, productId, quantity, price, cartId);
  
    //   // Update the order item in the database using Prisma
    //   const updatedOrderItem = await prisma.orderItem.update({
    //     where: { id: Number(id) }, // Find the orderItem by ID
    //     data: {
    //       orderId: createOrderDto.orderId,
    //       productId: createOrderDto.productId,
    //       quantity: createOrderDto.quantity,
    //       price: createOrderDto.price,
    //       cartId: createOrderDto.cartId,
    //     },
    //   });
  
      return success(res, 201, {}, "TODO");
      
    } 
    catch (error) 
    {
      next(error)
    }
  };



export const getOrderItemById = async (req: Request, res: Response, next: NextFunction) => {
    try 
    {
        // const { id } = req.params; 
        // const orderItem = await prisma.orderItem.findUnique({
        //     where: {
        //         id: Number(id),
        //     },
        // });

        // if (!orderItem) {
        //     return res.status(404).json({
        //         message: 'Order item not found',
        //         Status: 404,
        //     });
        // }

        // return res.status(200).json({
        //     message: 'Order item retrieved successfully',
        //     Status: 200,
        //     orderItem,
        // });
        return success(res, 201, {}, "TODO");
    } 
    catch (error) 
    {
        next(error)
    }
};