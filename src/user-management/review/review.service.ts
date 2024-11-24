import { ReviewRepository } from "./review.repository";
import { CreateReviewDTO } from "./create-review.dto";
import { Review } from "../../util/types/review.types";

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }
  // create a new Reviw.
  async createReview(userId: number, dto: CreateReviewDTO): Promise<Review> {
    const reviewData: Omit<Review, "id" | "datePosted"> = {
      userId: userId,
      productId: dto.productId,
      rating: dto.rating,
      comment: dto.comment,
    };
    return this.reviewRepository.create(reviewData);
  }

  //Get review by ID
  async getReviewById(id: number): Promise<Review | null> {
    return this.reviewRepository.findById(id);
  }

  //get all reviews

  async getAllReviews(productId: number): Promise<Review[]> {
    return this.reviewRepository.findAll(productId);
  }
  // Update a review
  async updateReview(review: Review): Promise<Review> {
    return this.reviewRepository.update(review);
  }
}
