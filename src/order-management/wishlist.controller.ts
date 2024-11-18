import { NextFunction, Request, Response } from 'express';
import * as wishlistService from './wishlist.service';
import { success } from '../util/response';

export const createWishList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newWishList = await wishlistService.createWishList(req.body);
    success(res, 201, newWishList, "WishList created successfully");
  } catch (error) {
    next(error);
  }
};

export const getWishListById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wishlist = await wishlistService.getWishListById(parseInt(req.params.wishlistId));
    success(res, 200, wishlist, "WishList retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllWishListsForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wishlists = await wishlistService.getAllWishListsForUser(parseInt(req.params.userId));
    success(res, 200, wishlists, "WishLists retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateWishList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedWishList = await wishlistService.updateWishList(parseInt(req.params.wishlistId), req.body);
    success(res, 200, updatedWishList, "WishList updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteWishList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await wishlistService.deleteWishList(parseInt(req.params.wishlistId));
    success(res, 200, {}, "WishList deleted successfully");
  } catch (error) {
    next(error);
  }
};