import { Router } from "express";
import { Route } from "../../util/route";
import { verifyUserToken } from "../../util/authorizeUser";
import { createShippingAddress, getAll } from "./shipping.address.controller";



export class ShippingAddressRoute extends Route {
	readonly name: string = 'shippingAddress';


	initRoutes(): Router {
		this.router
		.post('/', verifyUserToken, createShippingAddress)
		.get('/', verifyUserToken,  getAll);

		
		  

		return this.router;
	}
}