import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./review.service";
import { CreateReviewDTO } from "./create-review.dto";
import { success, fail } from "../../util/response";
import { Review } from "../../util/types/review.types";

const reviewService = new ReviewService();
// Create a review
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = Number(req.params.id);
  const dto: CreateReviewDTO = req.body;
  try {
    const newReview = await reviewService.createReview(userId, dto);
    success(res, 201, newReview, "Review created successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllReviewsForProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await reviewService.getAllReviews(
      parseInt(req.params.productId)
    );
    if (reviews.length === 0) {
      fail(res, 404, "No reviews found");
      return;
    }
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
  const reviewId = Number(req.params.id); // ID from the request parameters

  try {
    const review = await reviewService.getReviewById(reviewId);
    if (!review) {
      fail(res, 404, "Review Not found");
      return;
    }
    success(res, 200, review, "Review retrieved successfully");
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
  const reviewId = parseInt(req.params.id, 10);
  const updates = req.body;
  try {
    const existingReview = await reviewService.getReviewById(reviewId);

    // Check if the review exists
    if (!existingReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    // Merge existing data with updates
    const updatedReviewData: Review = {
      ...existingReview, // Preserve existing properties
      ...updates,
      datePosted: existingReview.datePosted,
    };

    // Update the review using the ReviewService
    const updatedReview = await reviewService.updateReview(updatedReviewData);

    success(res, 200, updatedReview, "Review updated successfully");
  } catch (error) {
    next(error);
  }
};
