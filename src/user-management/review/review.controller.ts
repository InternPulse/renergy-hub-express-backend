import { NextFunction, Request, Response } from "express";
import * as reviewService from "./review.service";
import { success } from "../../util/response";
import CustomHttpError from "../../util/custom.error";

// Create a review
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user?.userID)
    const newReview = await reviewService.createReview(userId, req.body);
    success(
      res,
      201,
      { ...newReview, userId: req.user?.id },
      "Review created successfully"
    );
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
    const reviews = await reviewService.getAllReviews();
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
    const reviewId = parseInt(params.reviewId);
    if (isNaN(reviewId)) throw new CustomHttpError(400, "Invalid review ID");
    const review = await reviewService.getReviewById(reviewId);
    return success(res, 200, review, "Review retrieved successfully");
  } catch (error) {
    next(error);
  }s
};

// Update review
export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedReview = await reviewService.updateReview(
      parseInt(req.params.reviewId),
      Number(req.user?.userID),
      req.body
    );
    success(res, 200, updatedReview, "Review updated successfully");
  } catch (error) {
    next(error);
  }
};
