import { ReviewRepository } from "../repository/review.repository";
import { CreateReviewDTO } from "../dto/review/create-review.dto";
import { Review } from "../types/review.types";

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

  async getAllReviews(): Promise<Review[]> {
    return this.reviewRepository.findAll();
  }
  // Update a review
  async updateReview(review: Review): Promise<Review> {
    return this.reviewRepository.update(review);
  }
}
