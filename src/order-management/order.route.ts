import { Router } from "express";
import { createorderitemhandler, deletedorderitemsbyid, getOrderItemById, updateOrderItemhandler } from "./order.controller";
import { createOrder, getAllOrders, performOrderOperation } from "./order.controller";
import { Route } from "../util/route";
import { createOrderV2, deleteOrder, getOrderById, updateOrder } from "./order.service";
import { createWishList, getWishListById, getAllWishListsForUser, updateWishList, deleteWishList } from "./wishlist.controller";
import { verifyUserToken } from "../util/authorizeUser";
import { generateAuthJWT } from '../util/authJWT'

export class OrderRoute extends Route {
	readonly name: string = 'orders';


	initRoutes(): Router {
		this.router
		.post('/', verifyUserToken, createOrder)
		.get('/', verifyUserToken, getAllOrders);

		this.router
		.post('/v2/createOrderV2', verifyUserToken, createOrderV2)

		this.router
		.post('/createorderitem',verifyUserToken,createorderitemhandler)
		.get('/getorderitems/:id',verifyUserToken,getOrderItemById)
		.put('/updateorderitems/:id',verifyUserToken,updateOrderItemhandler)
		.delete('/deleteorderitems/:id',verifyUserToken,deletedorderitemsbyid)
		.post('/v2/performOrderOperation', verifyUserToken, performOrderOperation)


		this.router
			.get('/:orderId', generateAuthJWT, getOrderById)
			.put('/:orderId', generateAuthJWT, updateOrder)
			.delete('/:orderId', generateAuthJWT, deleteOrder);

		  // WishList routes
		  this.router
			.post('/wishlist', verifyUserToken, createWishList)
			.get('/wishlist/:wishlistId', verifyUserToken, getWishListById)
			.get('/user/:userId/wishlist', verifyUserToken, getAllWishListsForUser)
			.put('/wishlist/:wishlistId', verifyUserToken, updateWishList)
			.delete('/wishlist/:wishlistId', verifyUserToken, deleteWishList);
			
		//   this.router
		// 	.post('/createorderitem', verifyUserToken, createorderitemhandler)
		// 	.get('/:id', verifyUserToken, getOrderItemById)
		// 	.put('/:id', verifyUserToken, updateOrderItemhandler)

		return this.router;
	}
}