import { Router } from "express";
import { createOrder, getAllOrders, performOrderOperation, getAllOrdersByUser, createOrderV2, deleteOrder, getOrderById, updateOrder, trackOrder } from "./order.controller";
import { createorderitemhandler, deletedorderitemsbyid, getOrderItemById, updateOrderItemhandler } from "./order.controller";
import { Route } from "../util/route";
import { createWishList, getWishListById, getAllWishListsForUser, updateWishList, deleteWishList } from "../wishlist-management/wishlist.controller";
import { authorizeUserPermissions, authorizeUserRoles, verifyUserToken } from "../util/authorizeUser";
import { generateAuthJWT } from '../util/authJWT'

export class OrderRoute extends Route {
	readonly name: string = 'orders';


	initRoutes(): Router {
		this.router
		.post('/', verifyUserToken, createOrder)
		.get('/', verifyUserToken, authorizeUserRoles(['ADMIN', 'VENDOR']), getAllOrders)
		.get('/users', verifyUserToken, getAllOrdersByUser);

		this.router
		.post('/performOrderOperation', verifyUserToken, authorizeUserPermissions(['ADMIN']), performOrderOperation)

		this.router
		.get('/track/:orderNumber', verifyUserToken, trackOrder)

		this.router
		.post('/v2/createOrderV2', verifyUserToken, createOrderV2)
		
		

		//Order Items
		.post('/createorderitem',verifyUserToken,createorderitemhandler)
		.get('/getorderitems/:id',verifyUserToken,getOrderItemById)
		.put('/updateorderitems/:id',verifyUserToken,updateOrderItemhandler)
		.delete('/deleteorderitems/:id',verifyUserToken,deletedorderitemsbyid)
		.post('/v2/performOrderOperation', verifyUserToken, performOrderOperation)


		this.router
			.get('/view/:orderId', verifyUserToken, getOrderById)
			.put('/view/:orderId', verifyUserToken, updateOrder)
			.delete('/view/:orderId', verifyUserToken, deleteOrder);

		  

		return this.router;
	}
}