import { NextFunction, Request, Response } from "express";
import * as reviewService from "./review.service";
import { success, fail } from "../../util/response";

// Create a review
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newReview = await reviewService.createReview({
      ...req.body, userId: req.user?.userID
    })
  
    success(res, 201, newReview, "Review created successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await reviewService.getAllReviews(req.user?.userID)
    success(res, 200, reviews, "Reviews retrieved successfully");
  } catch (error) {
    next(error);
  }
};
// GET a review by ID

export const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params } = req;

  try {
   
    const reviewId = parseInt(params.id);

    const review = await reviewService.getReviewById(reviewId);
    return success(res, 200, review, "Review retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// Update review
export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedReview = await reviewService.updatedReview(
      parseInt(req.params.reviewId),
      Number(req.user?.userID),
      req.body
    )
    success(res, 200, updatedReview, "Review updated successfully");
  } catch (error) {
    next(error);
  }
};
