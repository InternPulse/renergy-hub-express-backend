import { NextFunction, Request, Response } from 'express';
import * as orderService from './order.service.ts';
import { success } from '../util/response.ts';
import { CreateOrderDto, CreateOrderItemDto, OrderOperationDto } from './order.dto.ts';
import { OrderItemService } from './order-item.service.ts';
import { GenerateOrderNumber } from '../util/payment.gateway.ts';
import { OrderOperationEnum, OrderStatus } from '../util/types/enums.ts';

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("Orders successfully gotten")
  try {
    const orders = await orderService.getAllOrders(req.query);
    success(res, 201, orders, "Order returned successfully");
  }
  catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const order = await orderService.getOrderById(parseInt(req.params.orderId));
    success(res, 201, order, "Order returned successfully");
  }
  catch (error) {
    next(error)
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {

  try 
  {
    const newOrder = await orderService.createOrder({ userId: parseInt(req.user?.userID), ...<CreateOrderDto>req.body, orderNumber: GenerateOrderNumber() });
    success(res, 201, newOrder, "Order created successfully");
  } 
  catch (error) 
  {
    next(error)
  }
};

export const createOrderV2 = async (req: Request, res: Response, next: NextFunction) => {

  try 
  {
    const newOrder = await orderService.createOrderV2({ userId: req.user?.id, ...req.body, orderNumber: GenerateOrderNumber() });
    success(res, 201, newOrder, "Order created successfully");
  }
  catch (error) {
    next(error)
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try 
  {
    
    const updatedOrder = await orderService.updateOrder(parseInt(req.params.orderId), req.body);
    success(res, 201, updateOrder, "Order updated successfully");
  }
  catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.deleteOrder(parseInt(req.params.orderId));
    success(res, 201, {}, "Order deleted successfully");
  }
  catch (error) {
    next(error);
  }

};

export const performOrderOperation = async (req: Request, res: Response, next: NextFunction) => {
  try 
  {
    
    const orderOperation: OrderOperationDto = req.body;
    

    await orderService.performOrderOperation(orderOperation);
    success(res, 201, {}, "Order status updated successfully");
  } 
  catch (error) 
  {
    next(error);
  }
};


export const createorderitemhandler = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const createOrderItemdto: CreateOrderItemDto = req.body
    const orderitemservice = new OrderItemService()

    const neworderitem = await orderitemservice.createOrderItem(createOrderItemdto)
    return success(res, 201, { neworderitem }, "Order Item successfully created")
  }
  catch (error) {
    next(error)
  }


}


// @Desc Update Order Item by ID
// @Route /api/v1/updateorderitems/:id
// @Method PUT
export const updateOrderItemhandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updatedata: CreateOrderItemDto = req.body
    const updateOrderitem = new OrderItemService()

    const updated = await updateOrderitem.updateorderitems(Number(id), updatedata)
    return success(res, 201, { updated }, "Orderitems updated Successfully ")

  }
  catch (error) {
    next(error)
  }
};

  export const deletedorderitemsbyid = async(req:Request , res:Response,next:NextFunction)=>{
    try {
      const{id}= req.params
      const orderId = Number(id);
      if (isNaN(orderId)) {
          return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const deleted = new OrderItemService()
      const deletedorderitem = await deleted.deletedorderitems(orderId)
      if(!deletedorderitem){
          throw new Error('Order Items cannot be found or successfully deleted')
      }
      return success(res,201,deletedorderitem,"Order items deleted Successfully")
    } catch (error) {
      next(error)
    }
  }



export const getOrderItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const getall = new OrderItemService()
    const getallorderitembyid = await getall.getOrderItembyId(Number(id))
    if (!getallorderitembyid)
      return res.status(400).json({ message: "Orderitem not found" })
    return success(res, 201, { getallorderitembyid }, "Orderitems retrieved Successfully");
  }
  catch (error) {
    next(error)
  }
};