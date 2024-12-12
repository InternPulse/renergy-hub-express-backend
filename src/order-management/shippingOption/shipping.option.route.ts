import { Router } from "express";
import { Route } from "../../util/route";
import { verifyUserToken } from "../../util/authorizeUser";
import { createShippingOption, getAll } from "./shipping.option.controller";



export class ShippingOptionRoute extends Route {
	readonly name: string = 'shippingOption';


	initRoutes(): Router {
		this.router
		.post('/', createShippingOption)
		.get('/',  getAll);

		
		  

		return this.router;
	}
}