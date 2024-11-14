import { Router } from "express";
import { createOrder, getAll } from "../controller/controller";
import { Route } from "./route";

export class OrderRoute extends Route{
	readonly name: string = 'orders';


	initRoutes(): Router {
		this.router
		.post('/', createOrder)
		.get('/', getAll);

		return this.router;
	}
}