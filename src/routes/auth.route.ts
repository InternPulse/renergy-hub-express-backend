import { Router } from "express";
import { createOrder, getAll } from "../controller/order.controller";
import { Route } from "./route";
import { login } from "../controller/auth";

export class AuthRoute extends Route{
    
	readonly name: string = 'auth';

    initRoutes(): Router {
		this.router
		.post('/login', login);

		return this.router;
	}
	
}