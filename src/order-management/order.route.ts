import { Router } from "express";
import { createOrder, createorderitemhandler, getAllOrders, getOrderItemById, updateOrderItemhandler } from "./order.controller";
import { Route } from "../util/route";
import { deleteOrder, getOrderById, updateOrder } from "./order.service";

export class OrderRoute extends Route {
	readonly name: string = 'orders';


	initRoutes(): Router {
		this.router
		.post('/', createOrder)
		.get('/', getAllOrders);

		this.router
		.get('/:orderId', getOrderById)
		.put('/:orderId', updateOrder)
		.delete('/:orderId', deleteOrder);

		this.router
		.post('/createorderitem',createorderitemhandler)
		.get('/:id',getOrderItemById)
		.put('/:id',updateOrderItemhandler)


		return this.router;
	}
}