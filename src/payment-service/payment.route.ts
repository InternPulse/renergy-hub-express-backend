import { Router } from "express";
import { Route } from "../util/route";
import { verifyUserToken } from "../util/authorizeUser";
import { initializePayment, processWebhook } from "./payment.controller";


export class PaymentRoute extends Route {
	readonly name: string = 'payments';


	initRoutes(): Router {
		this.router
		.post('/', verifyUserToken, initializePayment)

		this.router
		.post('/pay-processor/callback', verifyUserToken, processWebhook)


		return this.router;
	}
}