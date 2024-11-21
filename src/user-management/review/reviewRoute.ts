import { Router } from "express";
import {
  createReview,
  getAllReviewsForProduct,
  getReviewById,
  updateReview,
} from "./review.controller";
import { Route } from "../../util/route";

export class ReviewRoute extends Route {
  readonly name: string = "reviews";

  initRoutes(): Router {
    this.router
      .post("/", createReview)
      .get("/:id", getReviewById)
      .get("/product/:productId/", getAllReviewsForProduct)
      .put("/:id", updateReview);

    return this.router;
  }
}
