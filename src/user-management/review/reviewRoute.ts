import { Router } from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
} from "./review.controller";
import { Route } from "../../util/route";
import { verifyUserToken } from "../../util/authorizeUser";

export class ReviewRoute extends Route {
  readonly name: string = "reviews";

  initRoutes(): Router {
    this.router
      .post("/", verifyUserToken, createReview)
      .get("/:reviewId", verifyUserToken, getReviewById)
      .get("/", getAllReviews)
      .put("/:reviewId", verifyUserToken, updateReview);

    return this.router;
  }
}
