import { Router } from "express";
import { Route } from "../util/route";
import { verifyUserToken } from "../util/authorizeUser";
import { getAllPayments, getAllPaymentsByUser, initializePayment, processWebhook } from "./payment.controller";


export class PaymentRoute extends Route {
	readonly name: string = 'payments';


	initRoutes(): Router {
		this.router
		.post('/', verifyUserToken, initializePayment)

		this.router
		.get('/', verifyUserToken, getAllPayments)

		this.router
		.get('/', verifyUserToken, getAllPaymentsByUser)

		this.router
		.post('/pay-processor/callback', processWebhook)


		return this.router;
	}
}