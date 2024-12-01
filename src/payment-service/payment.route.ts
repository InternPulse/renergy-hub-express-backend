import { Router } from "express";
import { Route } from "../util/route";
import { authorizeUserOrderPaymentRoles, verifyUserToken } from "../util/authorizeUser";
import { getAllPayments, getAllPaymentsByUser, initializePayment, processWebhook } from "./payment.controller";


export class PaymentRoute extends Route {
	readonly name: string = 'payments';


	initRoutes(): Router {
		this.router
		.post('/', verifyUserToken, initializePayment)

		this.router
		.get('/', verifyUserToken, authorizeUserOrderPaymentRoles(['ADMIN']), getAllPayments)

		this.router
		.get('/user', verifyUserToken, getAllPaymentsByUser)

		this.router
		.post('/pay-processor/callback', processWebhook)


		return this.router;
	}
}