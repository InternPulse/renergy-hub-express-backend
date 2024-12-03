import { NextFunction, Request, Response } from 'express';
import * as shippingOptionService from './shipping.option.service'
import { success } from '../../util';
import { CreateShippingOptionDto } from './shipping.option.dto';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try 
  {
    const shippingOption = await shippingOptionService.getAll();
    success(res, 201, shippingOption, "Shipping Option returned successfully");
  }
  catch (error) {
    next(error);
  }
};


export const getShippingOptionById = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const order = await shippingOptionService.getShippingOptionById(parseInt(req.params.shippingOptionId));
    success(res, 201, order, "Order returned successfully");
  }
  catch (error) {
    next(error)
  }
};

export const createShippingOption = async (req: Request, res: Response, next: NextFunction) => {

  try 
  {
    const newOrder = await shippingOptionService.createShippingOption({ ...<CreateShippingOptionDto>req.body});
    success(res, 201, newOrder, "Shipping Option created successfully");
  } 
  catch (error) 
  {
    next(error)
  }
};


export const updateShippingOption = async (req: Request, res: Response, next: NextFunction) => {
  try 
  {
    
    const shippingOption = await shippingOptionService.updateShippingOption(parseInt(req.params.shippingOptionId), req.body);
    success(res, 201, shippingOption, "Shipping Option updated successfully");
  }
  catch (error) {
    next(error);
  }
};

export const deleteShippingOption = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await shippingOptionService.deleteShippingOption(parseInt(req.params.shippingOptionId));
    success(res, 201, {}, "Shipping Option deleted successfully");
  }
  catch (error) {
    next(error);
  }

};

