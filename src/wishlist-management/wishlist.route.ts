import { Router } from "express";
import { Route } from "../util/route";
import { createWishList, getWishListById, getAllWishListsForUser, updateWishList, deleteWishList } from "../wishlist-management/wishlist.controller";
import { authorizeUserPermissions, authorizeUserRoles, verifyUserToken } from "../util/authorizeUser";
import { generateAuthJWT } from '../util/authJWT'

export class WishListRoute extends Route {
	readonly name: string = 'wishlists';


	initRoutes(): Router {
		
		  this.router
			.post('/', verifyUserToken, createWishList)
			.get('/:wishlistId', verifyUserToken, getWishListById)
			.get('/', verifyUserToken, getAllWishListsForUser)
			.put('/:wishlistId', verifyUserToken, updateWishList)
			.delete('/:wishlistId', verifyUserToken, deleteWishList);

		return this.router;
	}
}