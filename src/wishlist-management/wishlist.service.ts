import CustomHttpError from "../util/custom.error";
import prisma from "../util/lib/client";
import { CreateWishlistDto } from "./wishlist.dto";

export const createWishList = async (data: CreateWishlistDto) => {
  const wishlist = await prisma.wishList.findFirst({
    where: { productId: data.productId }
  })

  if(wishlist) throw new CustomHttpError(400, "Product already added to wishlist")

  return prisma.wishList.create({
    data,
  });
};

export const getWishListById = async (wishlistId: number) => {
  return prisma.wishList.findUnique({
    where: { id: wishlistId },
  });
};

export const getAllWishListsForUser = async (userId: number) => {
  return prisma.wishList.findMany({
    where: { userId },
  });
};

export const updateWishList = async (wishlistId: number, data: any) => {
  return prisma.wishList.update({
    where: { id: wishlistId },
    data,
  });
};

export const deleteWishList = async (wishlistId: number) => {
  return prisma.wishList.delete({
    where: { id: wishlistId },
  });
};