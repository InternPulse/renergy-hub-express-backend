import { NextFunction, Request, Response } from 'express';
import * as shippingAddressService from './shipping.service'
import { success } from '../../util';
import { CreateShippingAddressDto } from './shipping.address.dto';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try 
  {
    const shippingAddress = await shippingAddressService.getAllUserAddress(parseInt(req.user?.userID));
    success(res, 201, shippingAddress, "Shipping Address returned successfully");
  }
  catch (error) {
    next(error);
  }
};


export const getShippingAddressById = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const order = await shippingAddressService.getShippingAddressById(parseInt(req.params.shippingAddressId));
    success(res, 201, order, "Order returned successfully");
  }
  catch (error) {
    next(error)
  }
};

export const createShippingAddress = async (req: Request, res: Response, next: NextFunction) => {

  try 
  {
    const newOrder = await shippingAddressService.createShippingAddress({ userId: parseInt(req.user?.userID), ...<CreateShippingAddressDto>req.body});
    success(res, 201, newOrder, "Shipping Address created successfully");
  } 
  catch (error) 
  {
    next(error)
  }
};

// export const createOrderV2 = async (req: Request, res: Response, next: NextFunction) => {

//   try 
//   {
//     const newOrder = await orderService.createOrderV2({ userId: req.user?.id, ...req.body, orderNumber: GenerateOrderNumber() });
//     success(res, 201, newOrder, "Order created successfully");
//   }
//   catch (error) {
//     next(error)
//   }
// };

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

export const trackOrder = async (req: Request, res: Response, next: NextFunction) => {
  try 
  {
    
    const orderNumber = req.params.orderNumber;
    
    const data = await orderService.getOrderByNumber(orderNumber);
    success(res, 201, data, "Order returned successfully");
  } 
  catch (error) 
  {
    next(error);
  }
};


export const performOrderOperation = async (req: Request, res: Response, next: NextFunction) => {
  try 
  {
    
    const orderOperation: OrderOperationDto = req.body;
    
    const data = await orderService.performOrderOperation(orderOperation);
    success(res, 201, data, "Order status updated successfully");
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