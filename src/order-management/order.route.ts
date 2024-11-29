import { Router } from "express";
import { createOrder, createorderitemhandler, getAllOrders, getOrderItemById, updateOrderItemhandler } from "./order.controller";
import { Route } from "../util/route";
import { deleteOrder, getOrderById, updateOrder } from "./order.service";
import { createWishList, getWishListById, getAllWishListsForUser, updateWishList, deleteWishList } from "./wishlist.controller";


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

		  // WishList routes
		  this.router
			.post('/wishlist', createWishList)
			.get('/wishlist/:wishlistId', getWishListById)
			.get('/user/:userId/wishlist', getAllWishListsForUser)
			.put('/wishlist/:wishlistId', updateWishList)
			.delete('/wishlist/:wishlistId', deleteWishList);
			
		  this.router
			.post('/createorderitem',createorderitemhandler)
			.get('/:id',getOrderItemById)
			.put('/:id',updateOrderItemhandler)

		return this.router;
	}
}