import CustomHttpError from "../../util/custom.error";
import prisma from "../../util/lib/client";
import { CreateReviewDTO, UpdateReviewDTO } from "./create-review.dto";

export const createReview = async (userId : number, data: CreateReviewDTO) => {
  
  const user = await prisma.user.findUnique({
    where: { id: userId},
  });

  if (!user) throw new CustomHttpError(404, "User not found");

  if (user.userType != "CUSTOMER")
    throw new CustomHttpError(403, "Only cusomters can create reviews");

  //if product exists
 
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });
  if (!product) throw new CustomHttpError(404, "Product not Found");

  return prisma.review.create({
    data: {
      userId,
      ...data,
      datePosted: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
};

export const getReviewById = async (reviewId: number) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  if (!review) throw new CustomHttpError(404, "Review not found");
  return review;
};

export const getAllReviews = async () => {
  return prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
};

export const updateReview = async (
  reviewId: number,
  userId: number,
  data: UpdateReviewDTO
) => {
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) throw new CustomHttpError(404, "Review not found");
  if (existingReview.userId !== userId)
    throw new CustomHttpError(403, "Review does not bleong to this user");

  return prisma.review.update({
    where: { id: reviewId },
    data,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
};
