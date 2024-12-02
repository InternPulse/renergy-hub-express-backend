import { Request, Response, NextFunction } from "express";
import * as paymentService from './payment.service';
import { success } from "../util";
import { PaymentStatus, User } from "../util/types";
import { WebhookData } from "./payment.dto";

export const initializePayment = async (req: Request, res: Response, next: NextFunction) => {
    
    try 
    {
      const user = <User>req.user;
      const paymentUrl = await paymentService.initializePayment(user , req.body);
      success(res, 201, paymentUrl, "Payment Url returned successfully");
    } 
    catch (error) 
    {
      next(error);
    }
  };


  export const processWebhook = async (req: Request, res: Response, next: NextFunction) => {
    
    try 
    {
      const webhookData: WebhookData = req.body;
      const paymentUrl = await paymentService.processWebhook(webhookData);
      success(res, 201, paymentUrl, "Payment Url returned successfully");
    } 
    catch (error) 
    {
      next(error);
    }
  };

  export const getAllPaymentsByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await paymentService.getAllPaymentsByUser(parseInt(req.user?.userID));
      success(res, 201, payments, "Payments returned successfully");
    }
    catch (error) {
      next(error);
    }
  };


  export const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
    try 
    {
      const status = req.query.status as PaymentStatus;
      const payments = await paymentService.getAllPayments(status);
      success(res, 201, payments, "Payments returned successfully");
    }
    catch (error) {
      next(error);
    }
  };